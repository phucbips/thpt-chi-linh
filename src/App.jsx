import React, { useState, useMemo, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import {
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FolderArchive,
  GraduationCap,
  Image as ImageIcon,
  RotateCcw,
  ScanFace,
  Search,
  Sparkles,
  Upload,
  UserCheck,
  ZoomIn,
} from "lucide-react";
import { autoDetectFaceAndCrop } from "./utils/faceDetection";
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
import { FONT_OPTIONS, SUBJECT_THEMES, TITLE_FONT_OPTIONS } from "./data/themes";
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
  "KỲ THI CHỌN HỌC SINH GIỎI THÀNH PHỐ HẢI PHÒNG CẤP THPT\nNĂM HỌC 2026 - 2027";

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

  // Chế độ căn chỉnh ảnh trong khung (kiểu Canva) + bộ nhớ căn chỉnh riêng cho từng người
  const [isCropMode, setIsCropMode] = useState(false);
  const cropMapRef = useRef({});
  const currentKeyRef = useRef(`hs-${INITIAL_STUDENTS[5].id}`);
  const [libraryUploads, setLibraryUploads] = useState([]);

  // Tinh chỉnh chữ
  const [titleFont, setTitleFont] = useState(TITLE_FONT_OPTIONS[0].id);
  const [nameScale, setNameScale] = useState(1);

  // Tự động nhận diện khuôn mặt
  const [autoFaceAlign, setAutoFaceAlign] = useState(true);
  const [isDetectingFace, setIsDetectingFace] = useState(false);
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
    metaText: initialStudent.dob ? `Ngày sinh: ${initialStudent.dob}` : "",
    showMeta: false,
    event: DEFAULT_EVENT,
    photo: initialStudent.photo || DEFAULT_STUDENT_PHOTO,
  });

  // Nạp lại vị trí căn chỉnh ảnh đã lưu cho từng người (hoặc tự động nhận diện nếu chưa lưu)
  const loadCropFor = async (key, photoSrc) => {
    currentKeyRef.current = key;
    const saved = cropMapRef.current[key];
    if (saved) {
      setPhotoZoom(saved.zoom);
      setPhotoPan(saved.pan);
      setIsCropMode(false);
      return;
    }

    if (autoFaceAlign && photoSrc && !photoSrc.startsWith("data:image/svg")) {
      setIsDetectingFace(true);
      try {
        const detected = await autoDetectFaceAndCrop(photoSrc);
        cropMapRef.current[key] = detected;
        setPhotoZoom(detected.zoom);
        setPhotoPan(detected.pan);
      } catch (e) {
        setPhotoZoom(1);
        setPhotoPan({ x: 0, y: 0 });
      } finally {
        setIsDetectingFace(false);
      }
    } else {
      setPhotoZoom(1);
      setPhotoPan({ x: 0, y: 0 });
    }
    setIsCropMode(false);
  };

  const selectStudent = (student) => {
    setSelectedStudentId(student.id);
    const photo = student.photo || DEFAULT_STUDENT_PHOTO;
    loadCropFor(`hs-${student.id}`, photo);
    if (layoutMode === "teacher") setLayoutMode("ribbon");
    setCertData((prev) => ({
      ...prev,
      subjectKey: SUBJECT_THEMES[student.subject] ? student.subject : "Toán",
      role: student.className ? `Học sinh lớp ${student.className}` : `Học sinh đội tuyển ${student.subject}`,
      name: toVietnameseTitleCase(student.name),
      prize: `ĐẠT ${student.prize.toUpperCase()} - MÔN ${student.subject.toUpperCase()}`,
      metaText: student.dob ? `Ngày sinh: ${student.dob}` : "",
      event: DEFAULT_EVENT,
      photo,
    }));
  };

  const selectTeacherBySubject = (subj) => {
    const teacherName = TEACHERS_BY_SUBJECT[subj] || `Giáo viên môn ${subj}`;
    const summary = summarizePrizesBySubject(students, subj);
    const photo = TEACHER_PHOTOS_BY_SUBJECT[subj] || DEFAULT_STUDENT_PHOTO;
    setSelectedStudentId(null);
    loadCropFor(`gv-${subj}`, photo);
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
      photo,
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

  // ===================== KHUNG ẢNH KIỂU CANVA =====================
  // Lưu vị trí căn chỉnh mỗi khi thay đổi
  useEffect(() => {
    cropMapRef.current[currentKeyRef.current] = { zoom: photoZoom, pan: photoPan };
  }, [photoZoom, photoPan]);

  const clampPan = (v, zoom) => {
    const lim = 120 + 250 * zoom;
    return Math.max(-lim, Math.min(lim, v));
  };

  // Bắt đầu kéo ảnh (chỉ khi đang ở chế độ căn chỉnh)
  const handleStartPan = (e) => {
    e.preventDefault();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: photoPan.x,
      origY: photoPan.y,
    };
  };

  const handleZoomDelta = React.useCallback((d) => {
    setPhotoZoom((z) => Math.max(0.5, Math.min(3, +(z + d).toFixed(2))));
  }, []);

  // Thả ảnh vào khung → tự khớp hình khung + tự động nhận diện mặt vào tâm
  const applyPhoto = async (src) => {
    setCertData((prev) => ({ ...prev, photo: src }));
    if (selectedStudentId != null && layoutMode !== "teacher") {
      setStudents((prev) => prev.map((s) => (s.id === selectedStudentId ? { ...s, photo: src } : s)));
    }

    if (autoFaceAlign && src && !src.startsWith("data:image/svg")) {
      setIsDetectingFace(true);
      try {
        const detected = await autoDetectFaceAndCrop(src);
        cropMapRef.current[currentKeyRef.current] = detected;
        setPhotoZoom(detected.zoom);
        setPhotoPan(detected.pan);
      } catch (e) {
        setPhotoZoom(1);
        setPhotoPan({ x: 0, y: 0 });
      } finally {
        setIsDetectingFace(false);
      }
    } else {
      setPhotoZoom(1);
      setPhotoPan({ x: 0, y: 0 });
    }
  };

  // Nút bấm thủ công "Căn tâm mặt tự động"
  const triggerAutoFaceDetect = async () => {
    if (!certData.photo || certData.photo.startsWith("data:image/svg")) return;
    setIsDetectingFace(true);
    try {
      const detected = await autoDetectFaceAndCrop(certData.photo);
      cropMapRef.current[currentKeyRef.current] = detected;
      setPhotoZoom(detected.zoom);
      setPhotoPan(detected.pan);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsDetectingFace(false);
    }
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.active) return;
      // 1 px trên màn hình = (1/scale) px canvas; khung SVG 560 đơn vị ≈ kích thước khung px
      const dx = (e.clientX - dragRef.current.startX) / previewScale;
      const dy = (e.clientY - dragRef.current.startY) / previewScale;
      setPhotoPan((prev) => ({
        x: clampPan(dragRef.current.origX + dx, photoZoom),
        y: clampPan(dragRef.current.origY + dy, photoZoom),
      }));
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
  }, [previewScale, photoZoom]);

  // Enter / Esc / click ra ngoài khung → thoát chế độ căn chỉnh
  useEffect(() => {
    if (!isCropMode) return;
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === "Escape") setIsCropMode(false);
    };
    const onDown = (e) => {
      if (e.target.closest?.("[data-photo-frame]") || e.target.closest?.("[data-crop-toolbar]")) return;
      setIsCropMode(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [isCropMode]);

  const handleLibraryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setLibraryUploads((prev) => [{ src: ev.target.result, label: file.name }, ...prev]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => applyPhoto(ev.target.result);
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
    setIsCropMode(false);
    try {
      // Đảm bảo thoát chế độ căn chỉnh và phông chữ đã tải đầy đủ trước khi chụp
      await new Promise((r) => setTimeout(r, 80));
      await document.fonts.ready;
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
    const prevKey = currentKeyRef.current;

    const prevCropMap = { ...cropMapRef.current };
    if (layoutMode === "teacher") setLayoutMode("ribbon");
    setIsCropMode(false);
    setBatchProgress({ current: 0, total: filteredStudents.length });

    try {
      await document.fonts.ready;
      const zip = new JSZip();
      for (let i = 0; i < filteredStudents.length; i++) {
        const st = filteredStudents[i];
        setBatchProgress({ current: i + 1, total: filteredStudents.length });
        selectStudent(st);

        // Nếu bật Auto Face Align và chưa có tọa độ crop, tự tính toán tức thì
        const key = `hs-${st.id}`;
        if (autoFaceAlign && !cropMapRef.current[key] && st.photo && !st.photo.startsWith("data:image/svg")) {
          try {
            const detected = await autoDetectFaceAndCrop(st.photo);
            cropMapRef.current[key] = detected;
            setPhotoZoom(detected.zoom);
            setPhotoPan(detected.pan);
          } catch (e) {}
        }

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
      cropMapRef.current = prevCropMap;
      loadCropFor(prevKey, prevCert.photo);
      setBatchProgress(null);
    }
  };

  const currentTheme = SUBJECT_THEMES[certData.subjectKey] || SUBJECT_THEMES["Toán"];
  const subjectList = Object.keys(TEACHERS_BY_SUBJECT);
  const currentFont = FONT_OPTIONS.find((f) => f.id === scriptFont) || FONT_OPTIONS[0];
  const currentTitleFont = TITLE_FONT_OPTIONS.find((f) => f.id === titleFont) || TITLE_FONT_OPTIONS[0];

  // Thư viện ảnh: ảnh tải thêm + giáo viên + học sinh (theo bộ lọc)
  const photoLibrary = useMemo(() => {
    const list = [...libraryUploads];
    Object.entries(TEACHER_PHOTOS_BY_SUBJECT).forEach(([subj, src]) => {
      if (src && src.startsWith("/") && (filterSubject === "ALL" || filterSubject === subj)) {
        list.push({ src, label: `${TEACHERS_BY_SUBJECT[subj]} (GV ${subj})` });
      }
    });
    filteredStudents.forEach((s) => {
      if (s.photo) list.push({ src: s.photo, label: toVietnameseTitleCase(s.name) });
    });
    return list;
  }, [libraryUploads, filteredStudents, filterSubject]);

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

              {/* THƯ VIỆN ẢNH – kéo thả vào khung như Canva */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-sky-400" /> Thư viện ảnh ({photoLibrary.length})
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-amber-300 hover:text-amber-200" title="Tự động nhận diện khuôn mặt và đưa vào tâm khung">
                      <input
                        type="checkbox"
                        checked={autoFaceAlign}
                        onChange={(e) => setAutoFaceAlign(e.target.checked)}
                        className="rounded accent-amber-400"
                      />
                      <span>Tự căn tâm mặt AI</span>
                    </label>
                    <label className="cursor-pointer text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1">
                      <Upload className="w-3 h-3" /> Thêm ảnh
                      <input type="file" accept="image/*" multiple onChange={handleLibraryUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {photoLibrary.map((p, idx) => (
                    <img
                      key={`${p.src.slice(-24)}-${idx}`}
                      src={p.src}
                      alt={p.label}
                      title={`${p.label} — kéo thả vào khung (hoặc bấm để dùng)`}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("application/x-vinhdanh-photo", p.src);
                        e.dataTransfer.setData("text/plain", p.src);
                        e.dataTransfer.effectAllowed = "copy";
                      }}
                      onClick={() => applyPhoto(p.src)}
                      className={`w-full aspect-square object-cover rounded-lg border-2 cursor-grab active:cursor-grabbing hover:scale-105 transition ${
                        certData.photo === p.src ? "border-amber-400" : "border-slate-700 hover:border-sky-400"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  🖱️ <b className="text-slate-300">Kéo thả</b> ảnh (từ đây hoặc từ máy tính) vào khung •{" "}
                  <b className="text-slate-300">Đúp chuột</b> vào ảnh để căn chỉnh (kéo dịch, lăn chuột phóng to) •{" "}
                  <b className="text-slate-300">Enter</b> / click ra ngoài để xong.
                </p>
              </div>

              {/* TINH CHỈNH CHỮ */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phông chữ "VINH DANH"</label>
                  <select
                    value={titleFont}
                    onChange={(e) => setTitleFont(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-bold text-slate-200"
                  >
                    {TITLE_FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Cỡ chữ tên ({Math.round(nameScale * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.02"
                    value={nameScale}
                    onChange={(e) => setNameScale(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer mt-2"
                  />
                </div>
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
                    Hiện Ngày sinh
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
            {/* Thanh công cụ căn chỉnh ảnh (không nằm trong ảnh xuất) */}
            <div
              data-crop-toolbar="true"
              className={`mb-3 rounded-xl px-3 py-2 flex flex-wrap items-center gap-3 text-xs border transition ${
                isCropMode ? "bg-sky-950/80 border-sky-600 text-sky-100" : "bg-slate-950/60 border-slate-800 text-slate-400"
              }`}
            >
              {isCropMode ? (
                <>
                  <span className="font-bold flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-sky-300" /> Đang căn chỉnh ảnh
                  </span>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.02"
                    value={photoZoom}
                    onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                    className="w-48 accent-sky-400 cursor-pointer"
                  />
                  <span className="font-mono w-12">{photoZoom.toFixed(2)}x</span>
                  <button
                    onClick={() => {
                      setPhotoZoom(1);
                      setPhotoPan({ x: 0, y: 0 });
                    }}
                    className="flex items-center gap-1 font-semibold text-sky-300 hover:text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Đặt lại
                  </button>
                  <button
                    onClick={triggerAutoFaceDetect}
                    disabled={isDetectingFace}
                    className="flex items-center gap-1.5 font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-600/60"
                  >
                    <ScanFace className="w-3.5 h-3.5" /> {isDetectingFace ? "Đang nhận diện..." : "Tự căn lại mặt"}
                  </button>
                  <button
                    onClick={() => setIsCropMode(false)}
                    className="ml-auto bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold px-4 py-1.5 rounded-lg"
                  >
                    ✓ Xong (Enter)
                  </button>
                </>
              ) : (
                <>
                  <span>
                    💡 <b className="text-slate-200">Đúp chuột vào ảnh</b> để căn chỉnh •{" "}
                    <b className="text-slate-200">Kéo thả ảnh</b> vào khung để thay ảnh
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={triggerAutoFaceDetect}
                      disabled={isDetectingFace}
                      className="bg-amber-950/60 hover:bg-amber-900/60 border border-amber-600/60 text-amber-300 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                      title="Tự động nhận diện khuôn mặt và đưa vào giữa khung"
                    >
                      <ScanFace className="w-3.5 h-3.5" /> {isDetectingFace ? "Đang quét mặt..." : "Tự căn tâm mặt"}
                    </button>
                    <button
                      onClick={() => setIsCropMode(true)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg"
                    >
                      ✂️ Căn chỉnh thủ công
                    </button>
                  </div>
                </>
              )}
            </div>
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
                    fontFactor={currentFont.factor || 1}
                    nameScale={nameScale}
                    titleFont={currentTitleFont.id}
                    titleSpacing={currentTitleFont.spacing}
                    customLogo={customLogo}
                    photoZoom={photoZoom}
                    photoPan={photoPan}
                    isCropMode={isCropMode}
                    onEnterCrop={() => setIsCropMode(true)}
                    onStartPan={handleStartPan}
                    onDropImage={applyPhoto}
                    onZoomDelta={handleZoomDelta}
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
