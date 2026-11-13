import React from "react";

// ============================================================================
// 1. LOGO KỶ NIỆM 60 NĂM THPT CHÍ LINH (1966 - 2026)
// ============================================================================
export const ChiLinh60YearsLogo = ({ customLogo, size = 128 }) => {
  if (customLogo) {
    return (
      <img
        src={customLogo}
        alt="Logo THPT Chí Linh"
        style={{ width: size, height: size }}
        className="rounded-full object-contain bg-white shadow-lg border-4 border-amber-400 p-1 flex-shrink-0"
      />
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" className="drop-shadow-lg flex-shrink-0">
      <defs>
        <linearGradient id="cl-blueRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="cl-num60Grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <path id="cl-topArc" d="M 24,110 A 86,86 0 1,1 196,110" />
        <path id="cl-bottomArc" d="M 196,110 A 86,86 0 1,1 24,110" />
      </defs>
      <circle cx="110" cy="110" r="106" fill="url(#cl-blueRing)" stroke="#fbbf24" strokeWidth="4" />
      <circle cx="110" cy="110" r="76" fill="#ffffff" stroke="#38bdf8" strokeWidth="2.5" />
      <text fill="#ffffff" fontSize="11.5" fontWeight="800" letterSpacing="0.8">
        <textPath href="#cl-topArc" startOffset="50%" textAnchor="middle">
          HÀNH TRÌNH TRI THỨC &amp; SÁNG TẠO
        </textPath>
      </text>
      <text fill="#fde047" fontSize="13.5" fontWeight="900" letterSpacing="1.4">
        <textPath href="#cl-bottomArc" startOffset="50%" textAnchor="middle">
          ★ KỶ NIỆM 60 NĂM ★
        </textPath>
      </text>
      <path
        d="M88,65 C62,65 50,92 50,115 C50,136 65,150 84,150 C102,150 114,137 114,120 C114,104 102,94 86,94 C77,94 70,98 67,103 C70,86 80,76 96,74 Z"
        fill="url(#cl-num60Grad)"
      />
      <circle cx="83" cy="122" r="14" fill="#ffffff" />
      <circle cx="140" cy="112" r="36" fill="#ffffff" stroke="#ea580c" strokeWidth="6" />
      <circle cx="140" cy="112" r="30" fill="none" stroke="#1e3a8a" strokeWidth="4" />
      <path d="M122,98 L145,98 L140,104 L126,104 L126,125 L120,125 Z" fill="#dc2626" />
      <rect x="130" y="106" width="22" height="16" rx="2" fill="#eff6ff" stroke="#1e3a8a" strokeWidth="1.5" />
      <circle cx="136" cy="114" r="3" fill="#dc2626" />
      <text x="140" y="135" fontSize="8" fontWeight="900" fill="#1e3a8a" textAnchor="middle">
        1966
      </text>
      <text x="110" y="168" fontSize="13" fontWeight="900" fill="#0c4a6e" textAnchor="middle">
        1966 - 2026
      </text>
    </svg>
  );
};

// ============================================================================
// 2. NỀN VINH DANH ĐA TẦNG (LUXURY STAGE + SILK RIBBONS + GUILLOCHÉ + BOKEH)
// ============================================================================
export const LuxuryBackground = ({ theme }) => {
  const { primary, secondary, accent, spotlight } = theme;
  return (
    <svg
      viewBox="0 0 1920 1080"
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="lux-spotlight" cx="30%" cy="48%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor={spotlight} />
          <stop offset="100%" stopColor={primary} stopOpacity="0.08" />
        </radialGradient>
        <linearGradient id="lux-goldLine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b48327" />
          <stop offset="30%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#d4af37" />
          <stop offset="80%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#9a6b19" />
        </linearGradient>
        <linearGradient id="lux-silkTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <radialGradient id="lux-sparkle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#fde047" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Spotlight trung tâm */}
      <rect width="1920" height="1080" fill="url(#lux-spotlight)" />

      {/* Đường sóng lụa tinh tế chạy ngang nền */}
      <g opacity="0.16" fill="none">
        <path d="M-120,820 C480,540 1080,1120 2040,620" stroke={primary} strokeWidth="3" />
        <path d="M-120,855 C480,575 1080,1155 2040,655" stroke={accent} strokeWidth="2.5" />
        <path d="M-120,890 C480,610 1080,1190 2040,690" stroke={secondary} strokeWidth="2" />
        <path d="M-120,210 C680,460 1240,-60 2040,290" stroke={primary} strokeWidth="2.5" />
        <path d="M-120,245 C680,495 1240,-25 2040,325" stroke={accent} strokeWidth="1.8" />
      </g>

      {/* Dải lụa góc trên trái */}
      <path d="M0,0 L460,0 C300,78 100,260 0,460 Z" fill="url(#lux-silkTop)" />
      <path d="M0,400 C115,215 265,75 420,0 L480,0 C305,95 135,255 0,475 Z" fill="url(#lux-goldLine)" />
      <path d="M0,0 L310,0 C180,60 65,170 0,310 Z" fill={secondary} opacity="0.7" />

      {/* Dải lụa góc dưới phải */}
      <path d="M1920,1080 L1410,1080 C1595,1000 1795,820 1920,570 Z" fill="url(#lux-silkTop)" />
      <path d="M1920,645 C1805,845 1640,995 1465,1080 L1405,1080 C1595,985 1780,815 1920,565 Z" fill="url(#lux-goldLine)" />

      {/* Khung viền kép mạ vàng sang trọng */}
      <rect x="28" y="28" width="1864" height="1024" rx="14" fill="none" stroke="url(#lux-goldLine)" strokeWidth="4" opacity="0.85" />
      <rect x="42" y="42" width="1836" height="996" rx="10" fill="none" stroke="url(#lux-goldLine)" strokeWidth="1.5" strokeDasharray="10 6" opacity="0.65" />

      {/* Hoa văn góc phải trên & trái dưới */}
      <g stroke="url(#lux-goldLine)" strokeWidth="2.5" fill="none" opacity="0.75">
        <path d="M1800,56 L1864,56 L1864,120" />
        <path d="M1818,74 L1846,74 L1846,102" />
        <circle cx="1854" cy="66" r="4" fill="#fde047" />
        <path d="M56,960 L56,1024 L120,1024" />
        <path d="M74,978 L74,1006 L102,1006" />
        <circle cx="66" cy="1014" r="4" fill="#fde047" />
      </g>

      {/* Hạt ánh kim (Gold Sparkles) tạo chiều sâu sân khấu */}
      <g>
        <circle cx="240" cy="260" r="24" fill="url(#lux-sparkle)" />
        <circle cx="680" cy="160" r="18" fill="url(#lux-sparkle)" />
        <circle cx="1580" cy="210" r="28" fill="url(#lux-sparkle)" />
        <circle cx="1740" cy="430" r="20" fill="url(#lux-sparkle)" />
        <circle cx="1290" cy="910" r="26" fill="url(#lux-sparkle)" />
        <circle cx="290" cy="920" r="22" fill="url(#lux-sparkle)" />
        <circle cx="880" cy="940" r="16" fill="url(#lux-sparkle)" />
      </g>
    </svg>
  );
};

// ============================================================================
// 3. WATERMARK CHUYÊN NGÀNH CHO ĐỦ 12 MÔN HỌC + GIÁO VIÊN
// ============================================================================
export const SubjectWatermark = ({ type, primaryColor }) => {
  return (
    <svg
      viewBox="0 0 1920 1080"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-[0.08]"
      fill="none"
    >
      <g transform="translate(1380, 560)" stroke={primaryColor} fill="none">
        {type === "math" && (
          <g strokeWidth="6">
            <polygon points="240,20 440,130 440,350 240,460 40,350 40,130" />
            <circle cx="240" cy="240" r="160" strokeDasharray="14 10" />
            <text x="155" y="305" fontSize="200" fontWeight="900" fill={primaryColor} stroke="none">
              π
            </text>
          </g>
        )}
        {type === "physics" && (
          <g strokeWidth="6">
            <ellipse cx="240" cy="240" rx="200" ry="74" transform="rotate(30 240 240)" />
            <ellipse cx="240" cy="240" rx="200" ry="74" transform="rotate(90 240 240)" />
            <ellipse cx="240" cy="240" rx="200" ry="74" transform="rotate(150 240 240)" />
            <circle cx="240" cy="240" r="32" fill={primaryColor} />
          </g>
        )}
        {type === "chemistry" && (
          <g strokeWidth="7">
            <polygon points="240,50 380,130 380,290 240,370 100,290 100,130" />
            <circle cx="240" cy="210" r="95" strokeDasharray="24 12" />
            <line x1="380" y1="130" x2="460" y2="85" />
            <line x1="100" y1="290" x2="25" y2="335" />
          </g>
        )}
        {type === "biology" && (
          <g strokeWidth="7">
            <path d="M120,40 C280,120 200,240 360,320 C200,400 280,460 120,480" />
            <path d="M360,40 C200,120 280,240 120,320 C280,400 200,460 360,480" />
            <line x1="160" y1="95" x2="320" y2="95" />
            <line x1="185" y1="165" x2="295" y2="165" />
            <line x1="185" y1="255" x2="295" y2="255" />
            <line x1="155" y1="335" x2="325" y2="335" />
            <line x1="160" y1="415" x2="320" y2="415" />
          </g>
        )}
        {type === "it" && (
          <g strokeWidth="6">
            <rect x="90" y="90" width="300" height="300" rx="28" />
            <rect x="165" y="165" width="150" height="150" rx="16" />
            <line x1="150" y1="20" x2="150" y2="90" />
            <line x1="240" y1="20" x2="240" y2="90" />
            <line x1="330" y1="20" x2="330" y2="90" />
            <line x1="150" y1="390" x2="150" y2="460" />
            <line x1="240" y1="390" x2="240" y2="460" />
            <line x1="330" y1="390" x2="330" y2="460" />
            <text x="180" y="255" fontSize="64" fontWeight="900" fill={primaryColor} stroke="none">
              &lt;/&gt;
            </text>
          </g>
        )}
        {type === "literature" && (
          <g strokeWidth="6">
            <path d="M60,360 C120,320 190,320 240,360 C290,320 360,320 420,360 L420,120 C360,80 290,80 240,120 C190,80 120,80 60,120 Z" />
            <line x1="240" y1="120" x2="240" y2="360" />
            <path d="M310,40 C370,70 400,150 320,250 C290,220 285,120 310,40 Z" fill={primaryColor} opacity="0.4" />
          </g>
        )}
        {type === "history" && (
          <g strokeWidth="6">
            <circle cx="240" cy="240" r="210" />
            <circle cx="240" cy="240" r="160" strokeDasharray="10 10" />
            <circle cx="240" cy="240" r="105" />
            <polygon points="240,155 262,215 325,215 275,252 292,312 240,275 188,312 205,252 155,215 218,215" fill={primaryColor} />
          </g>
        )}
        {type === "geography" && (
          <g strokeWidth="6">
            <circle cx="240" cy="240" r="190" />
            <ellipse cx="240" cy="240" rx="95" ry="190" />
            <ellipse cx="240" cy="240" rx="190" ry="95" />
            <line x1="50" y1="240" x2="430" y2="240" />
            <line x1="240" y1="50" x2="240" y2="430" />
          </g>
        )}
        {type === "english" && (
          <g strokeWidth="6">
            <circle cx="240" cy="240" r="190" />
            <path d="M80,160 Q240,210 400,160" />
            <path d="M80,320 Q240,270 400,320" />
            <text x="125" y="268" fontSize="110" fontWeight="900" fill={primaryColor} stroke="none">
              ENG
            </text>
          </g>
        )}
        {type === "law" && (
          <g strokeWidth="7">
            <line x1="240" y1="60" x2="240" y2="400" />
            <line x1="140" y1="400" x2="340" y2="400" />
            <line x1="90" y1="130" x2="390" y2="130" />
            <path d="M90,130 L50,250 L130,250 Z" />
            <path d="M390,130 L350,250 L430,250 Z" />
            <path d="M45,250 Q90,300 135,250 Z" fill={primaryColor} opacity="0.4" />
            <path d="M345,250 Q390,300 435,250 Z" fill={primaryColor} opacity="0.4" />
          </g>
        )}
        {type === "tech_ind" && (
          <g strokeWidth="7">
            <circle cx="240" cy="240" r="120" />
            <circle cx="240" cy="240" r="55" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <rect
                key={deg}
                x="220"
                y="65"
                width="40"
                height="50"
                rx="6"
                transform={`rotate(${deg} 240 240)`}
              />
            ))}
          </g>
        )}
        {type === "tech_agri" && (
          <g strokeWidth="7">
            <path d="M240,420 L240,120" />
            <path d="M240,320 C140,310 110,220 180,180 C220,210 235,260 240,320 Z" fill={primaryColor} opacity="0.35" />
            <path d="M240,260 C340,250 370,160 300,120 C260,150 245,200 240,260 Z" fill={primaryColor} opacity="0.35" />
            <circle cx="240" cy="95" r="35" />
          </g>
        )}
        {type === "teacher" && (
          <g strokeWidth="6">
            <polygon points="240,45 288,165 415,175 318,260 348,385 240,318 132,385 162,260 65,175 192,165" />
            <circle cx="240" cy="240" r="205" strokeDasharray="12 10" />
          </g>
        )}
      </g>
    </svg>
  );
};

// ============================================================================
// 4. CHỮ "VINH DANH" VÀNG KIM 3D BẰNG INLINE SVG (KHÔNG BAO GIỜ MẤT KHI XUẤT PNG)
// ============================================================================
export const SvgGold3DTitle = ({ text = "VINH DANH", width = 680, height = 130, fontSize = 96 }) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
    <defs>
      <linearGradient id="svg-goldText" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="28%" stopColor="#fde047" />
        <stop offset="52%" stopColor="#d4af37" />
        <stop offset="78%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#fef08a" />
      </linearGradient>
    </defs>
    {/* Lớp bóng nổi khối 3D */}
    <text
      x="50%"
      y="76%"
      textAnchor="middle"
      fontFamily="'Cinzel', 'Playfair Display', serif"
      fontWeight="900"
      fontSize={fontSize}
      letterSpacing="6"
      fill="#451a03"
      opacity="0.7"
      transform="translate(0, 6)"
    >
      {text}
    </text>
    {/* Lớp chữ vàng kim */}
    <text
      x="50%"
      y="76%"
      textAnchor="middle"
      fontFamily="'Cinzel', 'Playfair Display', serif"
      fontWeight="900"
      fontSize={fontSize}
      letterSpacing="6"
      fill="url(#svg-goldText)"
      stroke="#78350f"
      strokeWidth="1.5"
    >
      {text}
    </text>
  </svg>
);

// ============================================================================
// 5. VÒNG NGUYỆT QUẾ VÀNG 3D SANG TRỌNG (LIỀN MẠCH, ÔM TRỌN KHUNG ẢNH)
// ============================================================================
export const GoldenLaurelWreath = () => {
  // Tạo các cặp lá dọc theo cung tròn từ dưới lên đỉnh
  const angles = [115, 132, 149, 166, 183, 200, 217, 234, 250];
  const r = 178;

  const renderBranch = (mirror = false) =>
    angles.map((deg, idx) => {
      const rad = (deg * Math.PI) / 180;
      const x = 220 + (mirror ? -1 : 1) * r * Math.cos(rad);
      const y = 220 + r * Math.sin(rad);
      const tangentDeg = mirror ? -(deg - 90) : deg - 90;
      const scale = 1.08 - idx * 0.045;
      return (
        <g key={`${mirror ? "r" : "l"}-${idx}`} transform={`translate(${x}, ${y}) rotate(${tangentDeg}) scale(${scale})`}>
          {/* Lá ngoài */}
          <path
            d="M0,0 C-14,-10 -22,-30 -4,-44 C8,-28 10,-12 0,0 Z"
            fill="url(#goldLeafBright)"
            stroke="#854d0e"
            strokeWidth="0.9"
            transform="rotate(-22)"
          />
          <path d="M-2,-4 L-5,-32" stroke="#fef9c3" strokeWidth="1" opacity="0.7" transform="rotate(-22)" />
          {/* Lá trong */}
          <path
            d="M0,0 C14,-10 20,-28 4,-42 C-8,-26 -10,-12 0,0 Z"
            fill="url(#goldLeafDeep)"
            stroke="#78350f"
            strokeWidth="0.9"
            transform="rotate(24)"
          />
          <path d="M2,-4 L5,-30" stroke="#fef08a" strokeWidth="1" opacity="0.65" transform="rotate(24)" />
          {/* Hạt vàng nhỏ */}
          <circle cx="0" cy="-3" r="2.8" fill="#fef08a" />
        </g>
      );
    });

  return (
    <svg
      viewBox="0 0 440 440"
      className="absolute -inset-16 w-[calc(100%+128px)] h-[calc(100%+128px)] pointer-events-none z-20 drop-shadow-[0_10px_18px_rgba(120,53,15,0.35)]"
    >
      <defs>
        <linearGradient id="goldLeafBright" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="35%" stopColor="#fde047" />
          <stop offset="75%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
        <linearGradient id="goldLeafDeep" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
      </defs>

      {/* Thân cành cong nối liền các lá */}
      <path
        d="M 212,386 A 178,178 0 0,1 148,58"
        fill="none"
        stroke="url(#goldLeafDeep)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M 228,386 A 178,178 0 0,0 292,58"
        fill="none"
        stroke="url(#goldLeafDeep)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Hai nhánh lá nguyệt quế */}
      {renderBranch(false)}
      {renderBranch(true)}

      {/* Ngôi sao vàng trên đỉnh */}
      <polygon
        points="220,24 225,38 240,38 228,47 233,61 220,52 207,61 212,47 200,38 215,38"
        fill="url(#goldLeafBright)"
        stroke="#92400e"
        strokeWidth="1.2"
      />

      {/* Nút thắt ruy-băng vàng ở đáy */}
      <path
        d="M188,388 Q220,374 252,388"
        stroke="url(#goldLeafBright)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="220" cy="384" r="8" fill="url(#goldLeafBright)" stroke="#854d0e" strokeWidth="1.5" />
    </svg>
  );
};

// ============================================================================
// 6. RUY-BĂNG VÀNG 3D CHỨA TÊN HỌC SINH
// ============================================================================
export const GoldenRibbonBanner = ({ name, fontClass, subtitle }) => (
  <div className="relative z-30 -mt-10 flex flex-col items-center">
    <div className="relative w-[680px] h-[136px] flex items-center justify-center">
      <svg viewBox="0 0 420 90" className="w-full h-full drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="ribbonMain" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b48327" />
            <stop offset="15%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="85%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#9a6b19" />
          </linearGradient>
          <linearGradient id="ribbonDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#785212" />
            <stop offset="100%" stopColor="#4d3308" />
          </linearGradient>
        </defs>
        <path d="M 8,32 L 55,32 L 55,82 L 8,82 L 26,57 Z" fill="url(#ribbonMain)" stroke="#85581A" strokeWidth="1" />
        <path d="M 412,32 L 365,32 L 365,82 L 412,82 L 394,57 Z" fill="url(#ribbonMain)" stroke="#85581A" strokeWidth="1" />
        <polygon points="35,68 55,82 55,68" fill="url(#ribbonDark)" />
        <polygon points="385,68 365,82 365,68" fill="url(#ribbonDark)" />
        <path d="M 35,14 Q 210,26 385,14 L 385,68 Q 210,80 35,68 Z" fill="url(#ribbonMain)" stroke="#fef08a" strokeWidth="2" />
        <path d="M 40,19 Q 210,31 380,19" stroke="#9a6b19" strokeWidth="1" strokeDasharray="3,3" fill="none" />
        <path d="M 40,63 Q 210,75 380,63" stroke="#9a6b19" strokeWidth="1" strokeDasharray="3,3" fill="none" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center px-16 pt-1">
        <span className={`${fontClass} text-[54px] font-bold text-[#3e1f04] truncate leading-none`}>
          {name}
        </span>
      </div>
    </div>
    {subtitle && (
      <div className="mt-2 px-8 py-2 rounded-full bg-white/90 border-2 border-amber-400 shadow-md">
        <span className="font-jakarta font-extrabold text-[24px] text-[#5c3a08] tracking-wide">
          {subtitle}
        </span>
      </div>
    )}
  </div>
);

// ============================================================================
// 7. MŨ CỬ NHÂN 3D SVG (BỐ CỤC 2 - TRUYỀN THỐNG)
// ============================================================================
export const GraduationCapSvg = () => (
  <svg viewBox="0 0 180 120" className="absolute -top-16 -right-8 w-56 h-36 z-30 transform rotate-12 drop-shadow-2xl pointer-events-none">
    <polygon points="90,12 172,48 90,84 8,48" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
    <path d="M46,65 L46,96 C46,108 134,108 134,96 L134,65 Z" fill="#0f172a" />
    <path d="M90,48 L154,66 L158,108" stroke="#eab308" strokeWidth="4" fill="none" />
    <circle cx="90" cy="48" r="5" fill="#fde047" />
    <polygon points="153,104 163,104 165,120 151,120" fill="#eab308" />
  </svg>
);

// ============================================================================
// 8. KHUNG ẢNH SVG CHUẨN XÁC (PAN + ZOOM + CLIPPATH KHÔNG BỊ LỖI KHI EXPORT)
// ============================================================================
export const SvgPhotoFrame = ({
  photo,
  shape = "circle",
  size = 480,
  zoom = 1,
  panX = 0,
  panY = 0,
  beaded = false,
  onPointerDown,
}) => {
  const clipId = React.useId();
  const gradId = React.useId();

  const starPoints =
    "250,8 292,42 346,24 366,76 420,82 418,136 462,172 440,222 468,268 428,308 434,362 380,380 364,432 308,426 270,468 220,446 172,468 134,426 78,432 62,380 8,362 14,308 -26,268 2,222 -20,172 24,136 22,82 76,76 96,24 150,42 192,8 221,30";
  const hexPoints = "250,12 456,131 456,369 250,488 44,369 44,131";

  const imgW = 500 * zoom;
  const imgH = 500 * zoom;
  const imgX = 250 - imgW / 2 + panX;
  const imgY = 250 - imgH / 2 + panY;

  return (
    <div
      onPointerDown={onPointerDown}
      style={{ width: size, height: size }}
      className="relative cursor-grab active:cursor-grabbing select-none z-10"
      title="Kéo để căn chỉnh vị trí khuôn mặt"
    >
      <svg viewBox="-30 -10 560 520" className="w-full h-full drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b48327" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#ca8a04" />
            <stop offset="75%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          <clipPath id={clipId}>
            {shape === "hexagon" && <polygon points={hexPoints} />}
            {shape === "starburst" && <polygon points={starPoints} />}
            {shape === "circle" && <circle cx="250" cy="250" r="222" />}
          </clipPath>
        </defs>

        {/* Viền ngoài vàng kim */}
        {shape === "hexagon" && (
          <polygon points="250,-4 470,123 470,377 250,504 30,377 30,123" fill={`url(#${gradId})`} />
        )}
        {shape === "starburst" && (
          <polygon
            points={starPoints}
            transform="translate(250,250) scale(1.06) translate(-250,-250)"
            fill={`url(#${gradId})`}
          />
        )}
        {shape === "circle" && <circle cx="250" cy="250" r="244" fill={`url(#${gradId})`} />}

        {/* Họa tiết chấm bi nổi (Layout 2 Truyền thống) */}
        {beaded &&
          shape === "circle" &&
          Array.from({ length: 24 }).map((_, idx) => {
            const ang = (idx * 15 * Math.PI) / 180;
            return (
              <circle
                key={idx}
                cx={250 + 234 * Math.cos(ang)}
                cy={250 + 234 * Math.sin(ang)}
                r="4.5"
                fill="#fffbeb"
                opacity="0.85"
              />
            );
          })}

        {/* Viền trắng bên trong */}
        {shape === "hexagon" && <polygon points="250,4 463,127 463,373 250,496 37,373 37,127" fill="#ffffff" />}
        {shape === "starburst" && (
          <polygon
            points={starPoints}
            transform="translate(250,250) scale(1.02) translate(-250,-250)"
            fill="#ffffff"
          />
        )}
        {shape === "circle" && <circle cx="250" cy="250" r="228" fill="#ffffff" />}

        {/* Ảnh chân dung đã cắt bằng clipPath + hỗ trợ Pan/Zoom */}
        <g clipPath={`url(#${clipId})`}>
          <rect x="-30" y="-10" width="560" height="520" fill="#e2e8f0" />
          <image
            href={photo}
            x={imgX}
            y={imgY}
            width={imgW}
            height={imgH}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </svg>
    </div>
  );
};

// ============================================================================
// 9. HAI DẢI RUY-BĂNG ĐỎ SỌC VÀNG CHO MẪU GIÁO VIÊN (BỐ CỤC 3)
// ============================================================================
export const TeacherDualRibbons = () => (
  <svg viewBox="0 0 360 180" className="w-[340px] h-[170px] -mt-20 relative z-0 drop-shadow-2xl pointer-events-none">
    <defs>
      <linearGradient id="redRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7f1d1d" />
        <stop offset="45%" stopColor="#b91c1c" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    {/* Dải trái lớn & cân đối */}
    <polygon points="95,0 172,0 140,170 92,135 44,170" fill="url(#redRibbon)" stroke="#fde047" strokeWidth="3" />
    <line x1="112" y1="0" x2="72" y2="150" stroke="#fde047" strokeWidth="4" />
    <line x1="154" y1="0" x2="114" y2="150" stroke="#fde047" strokeWidth="4" />
    {/* Dải phải lớn & cân đối */}
    <polygon points="188,0 265,0 316,170 268,135 220,170" fill="url(#redRibbon)" stroke="#fde047" strokeWidth="3" />
    <line x1="206" y1="0" x2="246" y2="150" stroke="#fde047" strokeWidth="4" />
    <line x1="248" y1="0" x2="288" y2="150" stroke="#fde047" strokeWidth="4" />
  </svg>
);
