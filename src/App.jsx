import React, { useState, useMemo, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FolderArchive,
  GraduationCap,
  Image as ImageIcon,
  RotateCcw,
  Search,
  Sparkles,
  Upload,
  UserCheck,
  ZoomIn,
} from "lucide-react";
import {
  INITIAL_STUDENTS,
  TEACHERS_BY_SUBJECT,
  TEACHER_PHOTOS_BY_SUBJECT,
  normalizeDob,
  normalizePrizeName,
  normalizeSubjectName,
  summarizePrizesBySubject,
  toVietnameseTitleCase,
} from "./data/studentsData";
import { FONT_OPTIONS, SUBJECT_THEMES } from "./data/themes";
import { CertificateCanvas } from "./components/CertificateCanvas";
import { ChiLinh60YearsLogo } from "./components/SvgArtwork";

const DEFAULT_STUDENT_PHOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e0f2fe"/>
        <stop offset="100%" stop-color="#bae6fd"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <circle cx="200" cy="150" r="68" fill="#64748b"/>
    <path d="M80,360 C80,265 320,265 320,360 Z" fill="#475569"/>
  </svg>
`);

const DEFAULT_EVENT =
  "KỲ THI CHỌN HỌC SINH GIỎI THÀNH PHỐ HẢI PHÒNG CẤP THPT\nNĂM HỌC 2026 - 2027 (QĐ 4366/QĐ-SGDĐT)";

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState(INITIAL_STUDENTS[5].id); // Hoàng Thương Thương - Giải Nhất Địa lý
  const [filterSubject, setFilterSubject] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [layoutMode, setLayoutMode] = useState("ribbon"); // 'ribbon' | 'classic' | 'teacher'
  const [scriptFont, setScriptFont] = useState("font-script-alex");
  const [customLogo, setCustomLogo] = useState(() => localStorage.getItem("cl_custom_logo_60") || null);

  // Pan & Zoom ảnh chân dung
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoPan, setPhotoPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, startX: 0, startY: 0, origX: 0, origY: 0 });

  const [isExporting, setIsExporting] = useState(false);
  const [batchProgress, setBatchProgress] = useState(null);

  // Tự động co giãn vùng Preview 1920x1080 cho vừa màn hình
  const previewWrapRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(0.5);

  useEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return;
    const updateScale = () => {
      const w = el.clientWidth;
      if (w > 0) setPreviewScale(Math.min(1, w / 1920));
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const initialStudent = INITIAL_STUDENTS[5];
  const [certData, setCertData] = useState({
    org: "SỞ GD&ĐT TP. HẢI PHÒNG",
    school: "TRƯỜNG THPT CHÍ LINH",
    subjectKey: initialStudent.subject,
    role: initialStudent.className ? `Học sinh lớp ${initialStudent.className}` : `SBD: ${initialStudent.sbd}`,
    name: initialStudent.name,
    prize: `ĐẠT ${initialStudent.prize.toUpperCase()} - MÔN ${initialStudent.subject.toUpperCase()}`,
    metaText: `SBD: ${initialStudent.sbd} • Ngày sinh: ${initialStudent.dob}`,
    showMeta: true,
    event: DEFAULT_EVENT,
    photo: initialStudent.photo || DEFAULT_STUDENT_PHOTO,
  });

  const selectStudent = (student) => {
    setSelectedStudentId(student.id);
    if (layoutMode === "teacher") setLayoutMode("ribbon");
    setCertData((prev) => ({
      ...prev,
      subjectKey: SUBJECT_THEMES[student.subject] ? student.subject : "Toán",
      role: student.className ? `Học sinh lớp ${student.className}` : `Học sinh đội tuyển ${student.subject}`,
      name: toVietnameseTitleCase(student.name),
      prize: `ĐẠT ${student.prize.toUpperCase()} - MÔN ${student.subject.toUpperCase()}`,
      metaText: [student.sbd ? `SBD: ${student.sbd}` : "", student.dob ? `Ngày sinh: ${student.dob}` : ""]
        .filter(Boolean)
        .join(" • "),
      event: DEFAULT_EVENT,
      photo: student.photo || DEFAULT_STUDENT_PHOTO,
    }));
  };

  const selectTeacherBySubject = (subj) => {
    const teacherName = TEACHERS_BY_SUBJECT[subj] || `Giáo viên môn ${subj}`;
    const summary = summarizePrizesBySubject(students, subj);
    setSelectedStudentId(null);
    setLayoutMode("teacher");
    setCertData((prev) => ({
      ...prev,
      subjectKey: "Giáo viên",
      role: "Giáo viên bồi dưỡng đội tuyển",
      name: teacherName,
      prize: summary.text,
      metaText: `Tổng cộng ${summary.total} học sinh đạt giải cấp Thành phố`,
      event:
        "BỒI DƯỠNG HỌC SINH ĐẠT THÀNH TÍCH CAO\nKỲ THI CHỌN HỌC SINH GIỎI THÀNH PHỐ HẢI PHÒNG CẤP THPT\nNĂM HỌC 2026 - 2027",
      photo: TEACHER_PHOTOS_BY_SUBJECT[subj] || DEFAULT_STUDENT_PHOTO,
    }));
  };

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return students.filter((s) => {
      const matchSub = filterSubject === "ALL" || s.subject === filterSubject;
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.sbd && s.sbd.toLowerCase().includes(q)) ||
        (s.className && s.className.toLowerCase().includes(q));
      return matchSub && matchQ;
    });
  }, [students, filterSubject, searchQuery]);

  const handlePrevNext = (dir) => {
    if (filteredStudents.length === 0) return;
    const idx = filteredStudents.findIndex((s) => s.id === selectedStudentId);
    const nextIdx = idx === -1 ? 0 : (idx + dir + filteredStudents.length) % filteredStudents.length;
    selectStudent(filteredStudents[nextIdx]);
  };

  // Xử lý kéo thả tâm ảnh
  const handlePhotoPointerDown = (e) => {
    e.preventDefault();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: photoPan.x,
      origY: photoPan.y,
    };
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.active) return;
      const dx = (e.clientX - dragRef.current.startX) / previewScale;
      const dy = (e.clientY - dragRef.current.startY) / previewScale;
      setPhotoPan({
        x: Math.max(-220, Math.min(220, dragRef.current.origX + dx)),
        y: Math.max(-220, Math.min(220, dragRef.current.origY + dy)),
      });
    };
    const onUp = () => {
      dragRef.current.active = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [previewScale]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setCertData((prev) => ({ ...prev, photo: dataUrl }));
      if (selectedStudentId != null) {
        setStudents((prev) =>
          prev.map((s) => (s.id === selectedStudentId ? { ...s, photo: dataUrl } : s))
        );
      }
      setPhotoZoom(1);
      setPhotoPan({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setCustomLogo(dataUrl);
      try {
        localStorage.setItem("cl_custom_logo_60", dataUrl);
      } catch {
        // Bỏ qua nếu vượt dung lượng localStorage
      }
    };
    reader.readAsDataURL(file);
  };

  const clearCustomLogo = () => {
    setCustomLogo(null);
    localStorage.removeItem("cl_custom_logo_60");
  };

  // Nhập file Excel (.xlsx, .xls, .csv)
  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const parsed = [];
        let lastTeacher = "";

        rows.forEach((row, idx) => {
          if (!row || row.length < 5) return;
          const stt = parseInt(row[0], 10);
          if (isNaN(stt)) return;

          // Hỗ trợ định dạng QĐ 4366: [STT, SBD, Họ tên, Ngày sinh, Môn, Trường, Giải, GV]
          const sbd = String(row[1] || "").trim();
          const name = toVietnameseTitleCase(row[2] || "");
          const dob = normalizeDob(row[3] || "");
          const subject = normalizeSubjectName(row[4] || "Toán");
          const school = String(row[5] || "THPT Chí Linh").trim();
          const prize = normalizePrizeName(row[6] || "Giải Khuyến khích");
          const teacherCell = String(row[7] || "").trim();
          if (teacherCell) lastTeacher = teacherCell;

          if (name) {
            parsed.push({
              id: idx + 1000,
              sbd,
              name,
              dob,
              subject,
              school,
              prize,
              className: "",
              teacher: lastTeacher || TEACHERS_BY_SUBJECT[subject] || "",
            });
          }
        });

        if (parsed.length > 0) {
          setStudents(parsed);
          setFilterSubject("ALL");
          selectStudent(parsed[0]);
        } else {
          alert("Không tìm thấy dữ liệu học sinh hợp lệ trong file Excel.");
        }
      } catch (err) {
        console.error("Lỗi đọc Excel:", err);
        alert("Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Xuất 1 ảnh PNG Full HD 1920x1080 bằng html-to-image
  const exportSinglePng = async () => {
    const node = document.getElementById("certificate-node");
    if (!node) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(node, {
        width: 1920,
        height: 1080,
        pixelRatio: 1,
        cacheBust: true,
      });
      const link = document.createElement("a");
      const safeName = certData.name.replace(/\s+/g, "_");
      link.download = `VinhDanh_${safeName}_${certData.subjectKey}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Lỗi xuất ảnh:", err);
      alert("Có lỗi khi xuất ảnh PNG. Vui lòng thử lại.");
    } finally {
      setIsExporting(false);
    }
  };

  // Xuất hàng loạt ZIP cho danh sách đang lọc
  const exportBatchZip = async () => {
    if (filteredStudents.length === 0) return;
    const node = document.getElementById("certificate-node");
    if (!node) return;

    const prevCert = { ...certData };
    const prevId = selectedStudentId;
    const prevLayout = layoutMode;

    if (layoutMode === "teacher") setLayoutMode("ribbon");
    setBatchProgress({ current: 0, total: filteredStudents.length });

    try {
      const zip = new JSZip();
      for (let i = 0; i < filteredStudents.length; i++) {
        const st = filteredStudents[i];
        setBatchProgress({ current: i + 1, total: filteredStudents.length });
        selectStudent(st);
        // Đợi React render DOM + SVG xong
        await new Promise((r) => setTimeout(r, 120));
        const dataUrl = await toPng(node, {
          width: 1920,
          height: 1080,
          pixelRatio: 1,
          cacheBust: true,
        });
        const base64 = dataUrl.split(",")[1];
        const safeName = st.name.replace(/\s+/g, "_");
        zip.file(`${String(i + 1).padStart(2, "0")}_${st.subject}_${safeName}.png`, base64, {
          base64: true,
        });
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `VinhDanh_THPT_ChiLinh_${filterSubject === "ALL" ? "TatCa" : filterSubject}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Lỗi xuất ZIP:", err);
      alert("Có lỗi khi xuất file ZIP hàng loạt.");
    } finally {
      setCertData(prevCert);
      setSelectedStudentId(prevId);
      setLayoutMode(prevLayout);
      setBatchProgress(null);
    }
  };

  const currentTheme = SUBJECT_THEMES[certData.subjectKey] || SUBJECT_THEMES["Toán"];
  const subjectList = Object.keys(TEACHERS_BY_SUBJECT);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 md:p-5">
      <div className="max-w-[1680px] mx-auto space-y-5">
        {/* ================= HEADER ================= */}
        <header className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3.5">
            <ChiLinh60YearsLogo customLogo={customLogo} size={56} />
            <div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-amber-400">
                HỆ THỐNG TẠO BẢNG VINH DANH TỰ ĐỘNG - THPT CHÍ LINH
              </h1>
              <p className="text-xs text-slate-400">
                Kỷ niệm 60 năm (1966 - 2026) • Dữ liệu QĐ 4366/QĐ-SGDĐT ({students.length} HS đạt giải TP Hải Phòng 2026–2027)
              </p>
            </div>
          </div>

          {/* 3 Bố cục chuyển đổi 1 click */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-950 p-1 rounded-xl flex flex-wrap items-center gap-1 border border-slate-800">
              <button
                onClick={() => {
                  setLayoutMode("ribbon");
                  if (certData.subjectKey === "Giáo viên" && filteredStudents[0]) {
                    selectStudent(filteredStudents[0]);
                  }
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  layoutMode === "ribbon"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Bố cục 1: Nguyệt Quế & Ruy-băng
              </button>
              <button
                onClick={() => {
                  setLayoutMode("classic");
                  if (certData.subjectKey === "Giáo viên" && filteredStudents[0]) {
                    selectStudent(filteredStudents[0]);
                  }
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  layoutMode === "classic"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> Bố cục 2: Truyền thống
              </button>
              <button
                onClick={() => selectTeacherBySubject(filterSubject === "ALL" ? "Địa lý" : filterSubject)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  layoutMode === "teacher"
                    ? "bg-red-600 text-white shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Bố cục 3: Giáo Viên
              </button>
            </div>
          </div>
        </header>

        {/* ================= MAIN WORKSPACE ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* CỘT ĐIỀU KHIỂN (4 CỘT) */}
          <aside className="xl:col-span-4 space-y-4">
            {/* KHỐI GIÁO VIÊN NHANH (Khi đang ở Bố cục 3) */}
            {layoutMode === "teacher" && (
              <div className="bg-gradient-to-br from-red-950/90 to-slate-900 rounded-2xl p-4 border border-red-700/60 shadow-xl">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2.5">
                  👑 Chọn Giáo Viên Bồi Dưỡng Theo Môn (Tự động đếm giải)
                </h2>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {subjectList.map((subj) => {
                    const teacher = TEACHERS_BY_SUBJECT[subj];
                    const active = certData.name === teacher;
                    return (
                      <button
                        key={subj}
                        onClick={() => selectTeacherBySubject(subj)}
                        className={`text-left p-2 rounded-xl border text-xs transition ${
                          active
                            ? "bg-amber-500 text-slate-950 border-amber-300 font-bold"
                            : "bg-slate-900/80 text-slate-200 border-slate-700 hover:border-amber-500/60"
                        }`}
                      >
                        <div className="truncate font-bold">{teacher}</div>
                        <div className={`text-[10px] ${active ? "text-slate-800" : "text-slate-400"}`}>
                          Môn {subj}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* KHỐI DANH SÁCH HỌC SINH */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  Danh sách HS đạt giải ({filteredStudents.length})
                </h2>
                <label className="cursor-pointer text-[11px] font-bold text-sky-300 hover:text-sky-200 bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-700/60 flex items-center gap-1 transition">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Nhập Excel
                  <input type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2.5">
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-200"
                >
                  <option value="ALL">-- Tất cả 12 Môn ({students.length}) --</option>
                  {subjectList.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj} ({students.filter((s) => s.subject === subj).length})
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm tên, SBD..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-2 py-2 text-xs text-slate-200 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="max-h-44 overflow-y-auto border border-slate-800 rounded-xl divide-y divide-slate-800/80 mb-2.5 bg-slate-950/60">
                {filteredStudents.map((st, idx) => {
                  const active = selectedStudentId === st.id && layoutMode !== "teacher";
                  return (
                    <button
                      key={st.id}
                      onClick={() => selectStudent(st)}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition ${
                        active ? "bg-amber-500 text-slate-950 font-bold" : "hover:bg-slate-800/80 text-slate-200"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="opacity-60 mr-1.5">{idx + 1}.</span>
                        <span>{st.name}</span>
                        {st.sbd && (
                          <span
                            className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] ${
                              active ? "bg-slate-900/20 text-slate-950" : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {st.sbd}
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                          st.prize.includes("Nhất")
                            ? "bg-amber-400 text-slate-950"
                            : st.prize.includes("Nhì")
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                            : st.prize.includes("Ba")
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {st.prize.replace("Giải ", "")} • {st.subject}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePrevNext(-1)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Học sinh trước
                </button>
                <button
                  onClick={() => handlePrevNext(1)}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition border border-slate-700"
                >
                  Học sinh tiếp <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* KHỐI TÙY CHỈNH ẢNH, LOGO, FONT & NỘI DUNG */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3">
              <h2 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                🎨 Tùy chỉnh Chân dung & Nội dung
              </h2>

              {/* Upload ảnh + Logo */}
              <div className="grid grid-cols-2 gap-2.5">
                <label className="cursor-pointer bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-center transition">
                  <ImageIcon className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-200 block">Tải ảnh chân dung</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>

                <div className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-center relative">
                  <label className="cursor-pointer block">
                    <Upload className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-200 block">
                      {customLogo ? "Đổi Logo 60 năm" : "Tải Logo 60 năm"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {customLogo && (
                    <button
                      onClick={clearCustomLogo}
                      className="text-[10px] text-rose-400 hover:underline mt-0.5"
                    >
                      Dùng mặc định
                    </button>
                  )}
                </div>
              </div>

              {/* Pan / Zoom ảnh */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-amber-400" /> Thu phóng ảnh ({photoZoom.toFixed(2)}x)
                  </span>
                  <button
                    onClick={() => {
                      setPhotoZoom(1);
                      setPhotoPan({ x: 0, y: 0 });
                    }}
                    className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" /> Đặt lại
                  </button>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="2.2"
                  step="0.02"
                  value={photoZoom}
                  onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">
                  Mẹo: Kéo trực tiếp ảnh trên khung xem trước để căn giữa khuôn mặt.
                </p>
              </div>

              {/* Chủ đề môn học & Font chữ */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Chủ đề Môn</label>
                  <select
                    value={certData.subjectKey}
                    onChange={(e) => setCertData({ ...certData, subjectKey: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-bold text-slate-200"
                  >
                    {Object.keys(SUBJECT_THEMES).map((k) => (
                      <option key={k} value={k}>
                        {SUBJECT_THEMES[k].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phông chữ Tên</label>
                  <select
                    value={scriptFont}
                    onChange={(e) => setScriptFont(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-bold text-slate-200"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chỉnh sửa trực tiếp */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-400">Họ và Tên</label>
                    <button
                      type="button"
                      onClick={() => setCertData({ ...certData, name: toVietnameseTitleCase(certData.name) })}
                      className="text-[10px] font-bold text-amber-400 hover:text-amber-300"
                      title="Chuẩn hóa viết hoa chữ cái đầu mỗi từ"
                    >
                      Aa Chuẩn hóa tên
                    </button>
                  </div>
                  <input
                    type="text"
                    value={certData.name}
                    onChange={(e) => setCertData({ ...certData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-bold text-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Lớp / Vai trò</label>
                  <input
                    type="text"
                    value={certData.role}
                    onChange={(e) => setCertData({ ...certData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400">Giải thưởng / Thành tích</label>
                  <label className="flex items-center gap-1 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={certData.showMeta}
                      onChange={(e) => setCertData({ ...certData, showMeta: e.target.checked })}
                    />
                    Hiện SBD & Ngày sinh
                  </label>
                </div>
                <input
                  type="text"
                  value={certData.prize}
                  onChange={(e) => setCertData({ ...certData, prize: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-bold text-rose-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nội dung kỳ thi</label>
                <textarea
                  rows={2}
                  value={certData.event}
                  onChange={(e) => setCertData({ ...certData, event: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              {/* Nút Xuất PNG & ZIP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={exportSinglePng}
                  disabled={isExporting || Boolean(batchProgress)}
                  className="py-3 px-3 rounded-xl font-extrabold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-400 shadow-lg flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? "Đang xuất PNG..." : "Tải PNG (1920x1080)"}
                </button>
                <button
                  onClick={exportBatchZip}
                  disabled={isExporting || Boolean(batchProgress) || filteredStudents.length === 0}
                  className="py-3 px-3 rounded-xl font-extrabold text-xs text-white bg-sky-600 hover:bg-sky-500 shadow-lg flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <FolderArchive className="w-4 h-4" />
                  {batchProgress
                    ? `Đang nén ${batchProgress.current}/${batchProgress.total}...`
                    : `Tải ZIP (${filteredStudents.length} HS)`}
                </button>
              </div>
            </div>
          </aside>

          {/* VÙNG PREVIEW 1920x1080 TỰ CO GIÃN (8 CỘT) */}
          <main className="xl:col-span-8 bg-slate-900/70 p-3 md:p-5 rounded-2xl border border-slate-800 shadow-2xl">
            <div ref={previewWrapRef} className="w-full overflow-hidden rounded-xl border border-slate-700/80">
              <div
                style={{
                  width: 1920 * previewScale,
                  height: 1080 * previewScale,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    transform: `scale(${previewScale})`,
                    transformOrigin: "top left",
                    width: 1920,
                    height: 1080,
                  }}
                >
                  <CertificateCanvas
                    certData={certData}
                    theme={currentTheme}
                    layoutMode={layoutMode}
                    scriptFont={scriptFont}
                    customLogo={customLogo}
                    photoZoom={photoZoom}
                    photoPan={photoPan}
                    onPhotoPointerDown={handlePhotoPointerDown}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span>
                Độ phân giải xuất chuẩn: <strong className="text-amber-400">1920 × 1080 px (Full HD 16:9)</strong> • Xuất bằng Inline SVG + html-to-image
              </span>
              <span>Chọn từng học sinh bên trái hoặc chuyển Bố cục Giáo viên để tự động thống kê giải.</span>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
