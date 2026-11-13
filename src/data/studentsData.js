export const TEACHERS_BY_SUBJECT = {
  "Công nghệ CN": "Thầy Đoàn Thế Mạnh",
  "Công nghệ NN": "Cô Hoàng Thị Hiền",
  "Địa lý": "Cô Nguyễn Thị Hiền",
  "GDKT&PL": "Cô Nguyễn Thị Thu Hằng",
  "Hóa học": "Cô Nguyễn Thị Tâm",
  "Lịch sử": "Cô Lê Thị Kim Huế",
  "Ngữ văn": "Cô Bùi Thị Hạnh Châm",
  "Sinh học": "Cô Lê Thị Lan Anh",
  "Tiếng Anh": "Cô Hoàng Thị Lụa",
  "Tin học": "Cô Vương Thị Thúy Nga",
  "Toán": "Cô Dương Thị Thúy",
  "Vật lý": "Cô Bùi Thị Huyền",
};

export function normalizeSubjectName(raw) {
  const s = String(raw || "").trim().toLowerCase();
  if (s === "cncn" || s.includes("công nghiệp")) return "Công nghệ CN";
  if (s === "cnnn" || s.includes("nông nghiệp")) return "Công nghệ NN";
  if (s.includes("địa")) return "Địa lý";
  if (s.includes("gdkt") || s.includes("pháp luật")) return "GDKT&PL";
  if (s.includes("hóa") || s.includes("hoá")) return "Hóa học";
  if (s.includes("sử")) return "Lịch sử";
  if (s.includes("văn")) return "Ngữ văn";
  if (s.includes("sinh")) return "Sinh học";
  if (s.includes("anh")) return "Tiếng Anh";
  if (s.includes("tin")) return "Tin học";
  if (s.includes("toán")) return "Toán";
  if (s.includes("lý") || s.includes("lí")) return "Vật lý";
  return raw || "Toán";
}

export function normalizePrizeName(raw) {
  const s = String(raw || "").trim().toLowerCase();
  if (s.includes("nhất")) return "Giải Nhất";
  if (s.includes("nhì")) return "Giải Nhì";
  if (s.includes("ba")) return "Giải Ba";
  if (s.includes("kk") || s.includes("khuyến")) return "Giải Khuyến khích";
  return raw || "Giải Khuyến khích";
}

export function normalizeDob(raw) {
  const s = String(raw || "").trim();
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }
  return s;
}

// Dữ liệu chuẩn 56 học sinh đạt giải theo QĐ số 4366/QĐ-SGDĐT ngày 11/11/2026
// Kỳ thi chọn học sinh giỏi thành phố Hải Phòng cấp THPT năm học 2026 - 2027
export const INITIAL_STUDENTS = [
  { id: 1, sbd: "53194", name: "Bùi Thanh Nga", dob: "28/05/2009", subject: "Công nghệ CN", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Thầy Đoàn Thế Mạnh" },
  { id: 2, sbd: "53207", name: "Bùi Hoàng Anh", dob: "21/01/2009", subject: "Công nghệ CN", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Thầy Đoàn Thế Mạnh" },
  { id: 3, sbd: "53188", name: "Vũ Thị Yến Ngọc", dob: "25/10/2009", subject: "Công nghệ CN", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Thầy Đoàn Thế Mạnh" },

  { id: 4, sbd: "52989", name: "Mạc Quang Vinh", dob: "25/03/2010", subject: "Công nghệ NN", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Hoàng Thị Hiền" },
  { id: 5, sbd: "52955", name: "Lương Thị Quỳnh Trang", dob: "21/09/2010", subject: "Công nghệ NN", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Hoàng Thị Hiền" },

  { id: 6, sbd: "52895", name: "Hoàng Thương Thương", dob: "24/08/2009", subject: "Địa lý", school: "THPT Chí Linh", prize: "Giải Nhất", className: "", teacher: "Cô Nguyễn Thị Hiền" },
  { id: 7, sbd: "52922", name: "Nguyễn Như Ngọc", dob: "29/10/2009", subject: "Địa lý", school: "THPT Chí Linh", prize: "Giải Nhất", className: "", teacher: "Cô Nguyễn Thị Hiền" },
  { id: 8, sbd: "52909", name: "Nguyễn Thị Mai Lan", dob: "03/11/2009", subject: "Địa lý", school: "THPT Chí Linh", prize: "Giải Nhất", className: "", teacher: "Cô Nguyễn Thị Hiền" },
  { id: 9, sbd: "52896", name: "Nguyễn Thị Lan", dob: "01/02/2009", subject: "Địa lý", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Nguyễn Thị Hiền" },
  { id: 10, sbd: "52936", name: "Nguyễn Minh Châu", dob: "03/08/2009", subject: "Địa lý", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Nguyễn Thị Hiền" },
  { id: 11, sbd: "52890", name: "Nguyễn Ngọc Lan", dob: "09/04/2010", subject: "Địa lý", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Nguyễn Thị Hiền" },
  { id: 12, sbd: "52921", name: "Nguyễn Thảo Vân", dob: "09/11/2009", subject: "Địa lý", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Nguyễn Thị Hiền" },
  { id: 13, sbd: "52881", name: "Vũ Minh Phương", dob: "03/11/2009", subject: "Địa lý", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Nguyễn Thị Hiền" },

  { id: 14, sbd: "53091", name: "Nguyễn Thị Phương Hảo", dob: "30/09/2009", subject: "GDKT&PL", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Nguyễn Thị Thu Hằng" },
  { id: 15, sbd: "53147", name: "Nguyễn Thị Minh Trang", dob: "11/02/2009", subject: "GDKT&PL", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Nguyễn Thị Thu Hằng" },
  { id: 16, sbd: "53119", name: "Dương Thu Hằng", dob: "17/09/2009", subject: "GDKT&PL", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Nguyễn Thị Thu Hằng" },
  { id: 17, sbd: "53102", name: "Trần Thị Huyền Đạt", dob: "06/04/2009", subject: "GDKT&PL", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Nguyễn Thị Thu Hằng" },
  { id: 18, sbd: "53126", name: "Trần Thu Quỳnh", dob: "03/08/2010", subject: "GDKT&PL", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Nguyễn Thị Thu Hằng" },

  { id: 19, sbd: "52639", name: "Lê Quốc Đại", dob: "02/05/2010", subject: "Hóa học", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Nguyễn Thị Tâm" },
  { id: 20, sbd: "52626", name: "Lưu Quế Chi", dob: "30/09/2010", subject: "Hóa học", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Nguyễn Thị Tâm" },
  { id: 21, sbd: "52665", name: "Nguyễn Phan Anh", dob: "21/03/2009", subject: "Hóa học", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Nguyễn Thị Tâm" },
  { id: 22, sbd: "52661", name: "Hoàng Châu Anh", dob: "25/11/2009", subject: "Hóa học", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Nguyễn Thị Tâm" },
  { id: 23, sbd: "52629", name: "Đỗ Thị Hải Yến", dob: "23/01/2009", subject: "Hóa học", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Nguyễn Thị Tâm" },
  { id: 24, sbd: "52663", name: "Phạm Ngọc Mai", dob: "08/01/2009", subject: "Hóa học", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Nguyễn Thị Tâm" },

  { id: 25, sbd: "52818", name: "Lý Văn Dũng", dob: "30/07/2010", subject: "Lịch sử", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Lê Thị Kim Huế" },
  { id: 26, sbd: "52850", name: "Nguyễn Thị Huyền", dob: "27/11/2009", subject: "Lịch sử", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Lê Thị Kim Huế" },
  { id: 27, sbd: "52837", name: "Vũ Thùy Trang", dob: "08/02/2009", subject: "Lịch sử", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Lê Thị Kim Huế" },
  { id: 28, sbd: "52838", name: "Nguyễn Trần Hà Linh", dob: "16/06/2009", subject: "Lịch sử", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Lê Thị Kim Huế" },
  { id: 29, sbd: "52803", name: "Dương Đức Vũ", dob: "31/12/2009", subject: "Lịch sử", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Lê Thị Kim Huế" },
  { id: 30, sbd: "52864", name: "Nguyễn Quỳnh Anh", dob: "23/08/2009", subject: "Lịch sử", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Lê Thị Kim Huế" },
  { id: 31, sbd: "52821", name: "Nguyễn Vũ Minh Anh", dob: "09/11/2009", subject: "Lịch sử", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Lê Thị Kim Huế" },

  { id: 32, sbd: "52782", name: "Đinh Thị Thu Hà", dob: "08/05/2009", subject: "Ngữ văn", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Bùi Thị Hạnh Châm" },
  { id: 33, sbd: "52777", name: "Trần Công Anh", dob: "14/01/2009", subject: "Ngữ văn", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Bùi Thị Hạnh Châm" },

  { id: 34, sbd: "52695", name: "Đồng Thế Bảo", dob: "05/06/2009", subject: "Sinh học", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Lê Thị Lan Anh" },
  { id: 35, sbd: "52700", name: "Đặng Thanh Bình", dob: "27/06/2009", subject: "Sinh học", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Lê Thị Lan Anh" },
  { id: 36, sbd: "52724", name: "Nguyễn Thị Thu Thủy", dob: "09/12/2009", subject: "Sinh học", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Lê Thị Lan Anh" },
  { id: 37, sbd: "52686", name: "Nguyễn Minh Đức", dob: "12/11/2009", subject: "Sinh học", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Lê Thị Lan Anh" },
  { id: 38, sbd: "52709", name: "Hoàng Thị Ngọc Mai", dob: "31/08/2009", subject: "Sinh học", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Lê Thị Lan Anh" },

  { id: 39, sbd: "53052", name: "Cao Lâm Sơn", dob: "18/12/2010", subject: "Tiếng Anh", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Hoàng Thị Lụa" },
  { id: 40, sbd: "53079", name: "Trần Thiện An", dob: "20/02/2009", subject: "Tiếng Anh", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Hoàng Thị Lụa" },
  { id: 41, sbd: "53047", name: "Nguyễn Anh Tuấn", dob: "20/02/2009", subject: "Tiếng Anh", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Hoàng Thị Lụa" },
  { id: 42, sbd: "53080", name: "Nguyễn Thị Minh An", dob: "24/07/2009", subject: "Tiếng Anh", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Hoàng Thị Lụa" },

  { id: 43, sbd: "53008", name: "Nguyễn Thanh Phúc", dob: "01/05/2009", subject: "Tin học", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Vương Thị Thúy Nga" },
  { id: 44, sbd: "53017", name: "Nguyễn Phan Tuấn Hùng", dob: "07/12/2009", subject: "Tin học", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Vương Thị Thúy Nga" },
  { id: 45, sbd: "53001", name: "Lê Nguyễn Hải Linh", dob: "06/06/2009", subject: "Tin học", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Vương Thị Thúy Nga" },
  { id: 46, sbd: "53024", name: "Bùi Đức Anh", dob: "07/06/2009", subject: "Tin học", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Vương Thị Thúy Nga" },

  { id: 47, sbd: "52520", name: "Nguyễn Phương Anh", dob: "31/07/2009", subject: "Toán", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Dương Thị Thúy" },
  { id: 48, sbd: "52500", name: "Nguyễn Hải Nam", dob: "25/02/2009", subject: "Toán", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Dương Thị Thúy" },
  { id: 49, sbd: "52544", name: "Nguyễn Thảo Dung", dob: "11/12/2009", subject: "Toán", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Dương Thị Thúy" },
  { id: 50, sbd: "52527", name: "Nguyễn Đình Phương", dob: "28/12/2009", subject: "Toán", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Dương Thị Thúy" },
  { id: 51, sbd: "52498", name: "Mạc Dương Quỳnh Anh", dob: "04/02/2009", subject: "Toán", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Dương Thị Thúy" },
  { id: 52, sbd: "52511", name: "Lê Phương Anh", dob: "02/05/2009", subject: "Toán", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Dương Thị Thúy" },

  { id: 53, sbd: "52580", name: "Đoàn Bảo Ngọc", dob: "21/02/2009", subject: "Vật lý", school: "THPT Chí Linh", prize: "Giải Nhì", className: "", teacher: "Cô Bùi Thị Huyền" },
  { id: 54, sbd: "52594", name: "Đỗ Quang Tùng", dob: "18/12/2009", subject: "Vật lý", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Bùi Thị Huyền" },
  { id: 55, sbd: "52600", name: "Đinh Tùng Dương", dob: "16/08/2009", subject: "Vật lý", school: "THPT Chí Linh", prize: "Giải Ba", className: "", teacher: "Cô Bùi Thị Huyền" },
  { id: 56, sbd: "52552", name: "Nguyễn Tiến Đạt", dob: "05/12/2009", subject: "Vật lý", school: "THPT Chí Linh", prize: "Giải Khuyến khích", className: "", teacher: "Cô Bùi Thị Huyền" },
];

export function summarizePrizesBySubject(students, subjectKey) {
  const list = students.filter((s) => s.subject === subjectKey);
  const counts = { nhat: 0, nhi: 0, ba: 0, kk: 0 };
  list.forEach((s) => {
    const p = s.prize.toLowerCase();
    if (p.includes("nhất")) counts.nhat++;
    else if (p.includes("nhì")) counts.nhi++;
    else if (p.includes("ba")) counts.ba++;
    else counts.kk++;
  });

  const parts = [];
  if (counts.nhat > 0) parts.push(`${counts.nhat} GIẢI NHẤT`);
  if (counts.nhi > 0) parts.push(`${counts.nhi} GIẢI NHÌ`);
  if (counts.ba > 0) parts.push(`${counts.ba} GIẢI BA`);
  if (counts.kk > 0) parts.push(`${counts.kk} GIẢI KK`);

  const summary = parts.length > 0 ? parts.join(", ") : "ĐỘI TUYỂN DỰ THI";
  return {
    total: list.length,
    counts,
    text: `ĐẠT: ${summary} — MÔN ${subjectKey.toUpperCase()}`,
  };
}
