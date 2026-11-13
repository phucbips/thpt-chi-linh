import React from "react";
import {
  ChiLinh60YearsLogo,
  LuxuryBackground,
  SubjectWatermark,
  GoldenLaurelWreath,
  GraduationCapSvg,
} from "./SvgArtwork";
import { EventTitle, LuxuryGoldTitle, RibbonNameBanner, SmartPhotoFrame, fitNameSize } from "./FrameAndType";

// Cụm Logo + tên trường dùng chung cho Học sinh
const SchoolHeader = ({ customLogo, org, school, orgColor, schoolColor, logoSize = 124 }) => (
  <div className="flex items-center justify-center gap-6 mb-6">
    <ChiLinh60YearsLogo customLogo={customLogo} size={logoSize} />
    <div className="text-left">
      <div className="font-main text-[21px] font-bold uppercase" style={{ color: orgColor, letterSpacing: "0.12em" }}>
        {org}
      </div>
      <div
        className="font-montserrat text-[40px] font-black uppercase leading-tight"
        style={{ color: schoolColor, letterSpacing: "0.01em" }}
      >
        {school}
      </div>
      <div className="h-1 w-60 bg-gradient-to-r from-amber-500 via-amber-300 to-transparent mt-2 rounded-full" />
    </div>
  </div>
);

// Huy hiệu giải thưởng 1 dòng, tự co cỡ
const PrizeBadge = ({ prize, background, isFirst, icon, maxLongSize = 24 }) => {
  const len = prize.length;
  const sizeClass = len > 38 ? `px-9 py-4` : len > 30 ? "px-11 py-4" : "px-14 py-5";
  const fontSize = len > 45 ? maxLongSize - 1 : len > 38 ? maxLongSize : len > 30 ? 27 : 32;
  return (
    <div
      className={`rounded-full text-white font-main font-extrabold shadow-2xl border-4 flex items-center gap-3.5 whitespace-nowrap ${sizeClass} ${
        isFirst ? "border-yellow-300" : "border-amber-300/90"
      }`}
      style={{
        background,
        fontSize,
        letterSpacing: "0.03em",
        textShadow: "0 2px 4px rgba(0,0,0,0.35)",
      }}
    >
      <span>{icon}</span>
      <span>{prize}</span>
    </div>
  );
};

// ============================================================================
// NGHỆ THUẬT SVG RIÊNG CHO MẪU GIÁO VIÊN HOÀNG GIA (ROYAL BLUE & GOLD)
// ============================================================================
const TeacherRoyalBackdrop = () => {
  const rosetteAngles = Array.from({ length: 28 }, (_, i) => i * (360 / 28));
  const rayAngles = Array.from({ length: 36 }, (_, i) => i * 10);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1920 1080">
      <defs>
        <radialGradient id="tr-bg" cx="50%" cy="48%" r="70%">
          <stop offset="0%" stopColor="#fffdf9" />
          <stop offset="52%" stopColor="#f8f6f0" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </radialGradient>

        <radialGradient id="tr-center-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="tr-navy-deep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#040d26" />
          <stop offset="45%" stopColor="#0a2158" />
          <stop offset="100%" stopColor="#173b8a" />
        </linearGradient>

        <linearGradient id="tr-navy-mid" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#081b4b" />
          <stop offset="55%" stopColor="#153e96" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        <linearGradient id="tr-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#85581A" />
          <stop offset="22%" stopColor="#fef08a" />
          <stop offset="48%" stopColor="#d4af37" />
          <stop offset="76%" stopColor="#fffbeb" />
          <stop offset="100%" stopColor="#9a6b19" />
        </linearGradient>

        <linearGradient id="tr-gold-horiz" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9a6b19" />
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#ca8a04" />
          <stop offset="75%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#9a6b19" />
        </linearGradient>

        <radialGradient id="tr-flower-petal" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f5f0e6" />
          <stop offset="100%" stopColor="#d6cbb5" />
        </radialGradient>

        <radialGradient id="tr-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="35%" stopColor="#fde047" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Nền lụa trắng ngà ấm sang trọng */}
      <rect width="1920" height="1080" fill="url(#tr-bg)" />

      {/* Hào quang vàng kim tỏa sáng phía sau khung ảnh trung tâm */}
      <circle cx="960" cy="515" r="420" fill="url(#tr-center-halo)" />
      <g transform="translate(960, 515)" opacity="0.16">
        {rayAngles.map((deg) => (
          <polygon
            key={deg}
            points="0,0 -14,-390 14,-390"
            fill="url(#tr-gold)"
            transform={`rotate(${deg})`}
          />
        ))}
      </g>

      {/* Vòng tròn hoa văn kỷ hà & la bàn tri thức bao quanh tâm điểm (lấp khoảng trống 2 bên) */}
      <g transform="translate(960, 515)" opacity="0.22" stroke="url(#tr-gold)" fill="none">
        <circle cx="0" cy="0" r="295" strokeWidth="2" strokeDasharray="6 6" />
        <circle cx="0" cy="0" r="345" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="395" strokeWidth="1.2" strokeDasharray="12 8" />
      </g>

      {/* Watermark Bản đồ Tri thức & Kinh tuyến ở trung tâm */}
      <g opacity="0.075" stroke="#1e3a8a" strokeWidth="1.6" fill="none">
        <ellipse cx="960" cy="525" rx="620" ry="290" />
        <ellipse cx="960" cy="525" rx="460" ry="290" />
        <ellipse cx="960" cy="525" rx="280" ry="290" />
        <ellipse cx="960" cy="525" rx="110" ry="290" />
        <line x1="340" y1="525" x2="1580" y2="525" />
        <line x1="390" y1="420" x2="1530" y2="420" />
        <line x1="390" y1="630" x2="1530" y2="630" />
      </g>
      <g opacity="0.065" fill="#1e3a8a">
        <path d="M430,400 Q510,340 595,390 T700,450 Q665,540 590,565 T455,485 Z" />
        <path d="M570,580 Q630,570 665,640 T630,760 Q570,735 555,655 Z" />
        <path d="M880,350 Q1040,315 1210,360 T1450,430 Q1485,525 1390,570 T1160,550 Q1030,585 930,525 T880,350 Z" />
        <path d="M1330,610 Q1430,585 1490,645 T1440,740 Q1355,730 1330,610 Z" />
      </g>

      {/* Họa tiết cánh chim Lạc & Hoa văn đối xứng hai bên khung ảnh (X=470 và X=1450) giúp bố cục đầy đặn */}
      <g transform="translate(485, 515)" opacity="0.55">
        <path
          d="M60,-150 C-15,-120 -65,-65 -65,0 C-65,65 -15,120 60,150 C10,105 -22,55 -22,0 C-22,-55 10,-105 60,-150 Z"
          fill="url(#tr-gold)"
        />
        <path
          d="M25,-195 C-65,-150 -120,-80 -120,0 C-120,80 -65,150 25,195 C-35,140 -78,75 -78,0 C-78,-75 -35,-140 25,-195 Z"
          fill="url(#tr-gold)"
          opacity="0.65"
        />
        <circle cx="-145" cy="0" r="8" fill="url(#tr-gold)" />
        <polygon points="-145,-28 -140,-6 -118,0 -140,6 -145,28 -150,6 -172,0 -150,-6" fill="url(#tr-gold)" />
      </g>
      <g transform="translate(1435, 515) scale(-1, 1)" opacity="0.55">
        <path
          d="M60,-150 C-15,-120 -65,-65 -65,0 C-65,65 -15,120 60,150 C10,105 -22,55 -22,0 C-22,-55 10,-105 60,-150 Z"
          fill="url(#tr-gold)"
        />
        <path
          d="M25,-195 C-65,-150 -120,-80 -120,0 C-120,80 -65,150 25,195 C-35,140 -78,75 -78,0 C-78,-75 -35,-140 25,-195 Z"
          fill="url(#tr-gold)"
          opacity="0.65"
        />
        <circle cx="-145" cy="0" r="8" fill="url(#tr-gold)" />
        <polygon points="-145,-28 -140,-6 -118,0 -140,6 -145,28 -150,6 -172,0 -150,-6" fill="url(#tr-gold)" />
      </g>

      {/* Khung viền vàng kim kép bên trong */}
      <rect x="42" y="32" width="1836" height="1016" rx="14" fill="none" stroke="url(#tr-gold)" strokeWidth="4" />
      <rect x="54" y="44" width="1812" height="992" rx="10" fill="none" stroke="url(#tr-gold)" strokeWidth="1.4" strokeDasharray="8 5" opacity="0.75" />

      {/* Hoa văn góc cổ điển Phải-Trên */}
      <g transform="translate(1862, 46)" fill="url(#tr-gold)">
        <path d="M0,0 L-150,0 L-150,7 L-32,7 L-7,32 L-7,150 L0,150 Z" />
        <path d="M-18,18 C-65,18 -88,42 -110,75 C-75,60 -52,60 -26,86 C-18,58 -18,40 -18,18 Z" opacity="0.9" />
        <circle cx="-54" cy="54" r="7" />
        <circle cx="-94" cy="24" r="4.5" />
        <circle cx="-24" cy="94" r="4.5" />
      </g>

      {/* DẢI LỤA XANH HOÀNG GIA & VÀNG KIM BÊN TRÁI + GÓC TRÁI DƯỚI */}
      <path d="M0,0 L355,0 C210,165 145,380 215,640 C275,850 470,985 740,1080 L0,1080 Z" fill="url(#tr-navy-deep)" />
      <path d="M0,0 L265,0 C145,190 105,410 175,665 C235,875 410,995 620,1080 L0,1080 Z" fill="url(#tr-navy-mid)" opacity="0.88" />
      <path d="M0,430 C95,610 245,845 520,1080 L0,1080 Z" fill="#040d26" opacity="0.75" />

      {/* Đường viền vàng kim uốn lượn bên trái */}
      <path
        d="M355,0 C210,165 145,380 215,640 C275,850 470,985 740,1080 L705,1080 C445,980 250,840 192,630 C122,375 188,160 330,0 Z"
        fill="url(#tr-gold)"
      />
      <path
        d="M265,0 C145,190 105,410 175,665 C235,875 410,995 620,1080"
        fill="none"
        stroke="url(#tr-gold)"
        strokeWidth="6"
      />
      <path
        d="M0,430 C95,610 245,845 520,1080"
        fill="none"
        stroke="url(#tr-gold)"
        strokeWidth="8"
      />

      {/* DẢI LỤA XANH HOÀNG GIA & VÀNG KIM GÓC PHẢI DƯỚI */}
      <path d="M1920,540 C1810,770 1595,960 1180,1080 L1920,1080 Z" fill="url(#tr-navy-deep)" />
      <path d="M1920,650 C1805,845 1625,982 1300,1080 L1920,1080 Z" fill="url(#tr-navy-mid)" opacity="0.9" />
      <path
        d="M1920,540 C1810,770 1595,960 1180,1080 L1215,1080 C1615,965 1825,782 1920,568 Z"
        fill="url(#tr-gold)"
      />
      <path
        d="M1920,650 C1805,845 1625,982 1300,1080"
        fill="none"
        stroke="url(#tr-gold)"
        strokeWidth="6"
      />

      {/* HUY HIỆU ROSETTE XANH LAM - VÀNG KIM BÊN TRÁI (Tọa độ 138, 335) */}
      <g transform="translate(138, 335)">
        <path d="M-24,70 L-68,215 L-28,195 L-4,225 L12,80 Z" fill="url(#tr-navy-mid)" stroke="url(#tr-gold)" strokeWidth="4" />
        <path d="M24,70 L72,210 L32,192 L10,222 L-8,80 Z" fill="url(#tr-navy-deep)" stroke="url(#tr-gold)" strokeWidth="4" />
        {rosetteAngles.map((deg, idx) => (
          <ellipse
            key={idx}
            cx="0"
            cy="-94"
            rx="13"
            ry="24"
            fill="url(#tr-gold)"
            stroke="#784c0c"
            strokeWidth="1"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="86" fill="url(#tr-gold)" />
        <circle cx="0" cy="0" r="75" fill="url(#tr-navy-mid)" stroke="#fef08a" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="64" fill="none" stroke="url(#tr-gold)" strokeWidth="1.5" strokeDasharray="4 4" />
        <polygon
          points="0,-40 10,-12 40,-12 16,6 25,35 0,18 -25,35 -16,6 -40,-12 -10,-12"
          fill="url(#tr-gold)"
          opacity="0.95"
        />
      </g>

      {/* CỤM HOA BẠCH TRÀ & LÁ VÀNG GÓC TRÁI DƯỚI */}
      <g transform="translate(142, 915)">
        <path d="M-90,-45 Q-135,-125 -55,-165 Q-15,-105 -55,-35 Z" fill="url(#tr-gold)" stroke="#784c0c" strokeWidth="1.5" />
        <path d="M-30,-80 Q-40,-175 35,-190 Q45,-115 -10,-65 Z" fill="url(#tr-gold)" stroke="#784c0c" strokeWidth="1.5" />
        <path d="M65,25 Q155,-15 185,55 Q110,95 55,45 Z" fill="url(#tr-gold)" stroke="#784c0c" strokeWidth="1.5" />
        <path d="M25,75 Q115,75 145,135 Q70,155 15,95 Z" fill="url(#tr-gold)" stroke="#784c0c" strokeWidth="1.5" />
        {Array.from({ length: 10 }, (_, i) => i * 36).map((deg, idx) => (
          <ellipse
            key={idx}
            cx="0"
            cy="-48"
            rx="27"
            ry="50"
            fill="url(#tr-flower-petal)"
            stroke="#cbbba0"
            strokeWidth="1"
            transform={`rotate(${deg})`}
          />
        ))}
        {Array.from({ length: 8 }, (_, i) => i * 45 + 22).map((deg, idx) => (
          <ellipse
            key={idx}
            cx="0"
            cy="-31"
            rx="20"
            ry="35"
            fill="url(#tr-flower-petal)"
            stroke="#d6cbb5"
            strokeWidth="1"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="21" fill="url(#tr-gold)" />
        <circle cx="0" cy="0" r="11" fill="#92400e" />
      </g>

      {/* CỤM HOA BẠCH TRÀ & LÁ VÀNG GÓC PHẢI DƯỚI */}
      <g transform="translate(1778, 915) scale(-1, 1)">
        <path d="M-90,-45 Q-135,-125 -55,-165 Q-15,-105 -55,-35 Z" fill="url(#tr-gold)" stroke="#784c0c" strokeWidth="1.5" />
        <path d="M-30,-80 Q-40,-175 35,-190 Q45,-115 -10,-65 Z" fill="url(#tr-gold)" stroke="#784c0c" strokeWidth="1.5" />
        <path d="M65,25 Q155,-15 185,55 Q110,95 55,45 Z" fill="url(#tr-gold)" stroke="#784c0c" strokeWidth="1.5" />
        <path d="M25,75 Q115,75 145,135 Q70,155 15,95 Z" fill="url(#tr-gold)" stroke="#784c0c" strokeWidth="1.5" />
        {Array.from({ length: 10 }, (_, i) => i * 36).map((deg, idx) => (
          <ellipse
            key={idx}
            cx="0"
            cy="-48"
            rx="27"
            ry="50"
            fill="url(#tr-flower-petal)"
            stroke="#cbbba0"
            strokeWidth="1"
            transform={`rotate(${deg})`}
          />
        ))}
        {Array.from({ length: 8 }, (_, i) => i * 45 + 22).map((deg, idx) => (
          <ellipse
            key={idx}
            cx="0"
            cy="-31"
            rx="20"
            ry="35"
            fill="url(#tr-flower-petal)"
            stroke="#d6cbb5"
            strokeWidth="1"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="21" fill="url(#tr-gold)" />
        <circle cx="0" cy="0" r="11" fill="#92400e" />
      </g>

      {/* BIỂU TƯỢNG CUỐN SÁCH VÀNG TRI THỨC & HOA VĂN ĐỐI XỨNG Ở ĐÁY TRUNG TÂM */}
      <g transform="translate(960, 1026)">
        <path
          d="M-125,6 C-165,6 -195,-18 -170,-34 C-150,-45 -132,-20 -152,-12 C-185,2 -225,12 -275,8"
          fill="none"
          stroke="url(#tr-gold)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M125,6 C165,6 195,-18 170,-34 C150,-45 132,-20 152,-12 C185,2 225,12 275,8"
          fill="none"
          stroke="url(#tr-gold)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path d="M0,8 Q-55,-14 -115,0 L-102,-32 Q-48,-44 0,-20 Z" fill="url(#tr-gold)" stroke="#92400e" strokeWidth="1.2" />
        <path d="M0,8 Q55,-14 115,0 L102,-32 Q48,-44 0,-20 Z" fill="url(#tr-gold)" stroke="#92400e" strokeWidth="1.2" />
        <path d="M0,-20 Q-45,-48 -95,-36 L-86,-52 Q-42,-62 0,-34 Z" fill="#fef08a" stroke="#b48327" strokeWidth="1" />
        <path d="M0,-20 Q45,-48 95,-36 L86,-52 Q42,-62 0,-34 Z" fill="#fef08a" stroke="#b48327" strokeWidth="1" />
        <line x1="-420" y1="12" x2="420" y2="12" stroke="url(#tr-gold-horiz)" strokeWidth="2.5" />
      </g>

      {/* Đốm sáng lấp lánh trên viền vàng */}
      {[
        [152, 195],
        [82, 615],
        [295, 890],
        [1765, 790],
        [1590, 955],
      ].map(([cx, cy], idx) => (
        <g key={idx} transform={`translate(${cx}, ${cy})`}>
          <circle cx="0" cy="0" r="28" fill="url(#tr-glow)" />
          <polygon points="0,-22 4,-4 22,0 4,4 0,22 -4,4 -22,0 -4,-4" fill="#ffffff" />
        </g>
      ))}
    </svg>
  );
};

// Nhánh bông lúa vàng hai bên chữ VINH DANH
const SideWheatBranch = ({ flip = false }) => (
  <svg
    width="115"
    height="92"
    viewBox="0 0 105 96"
    className="overflow-visible"
    style={{ transform: flip ? "scaleX(-1)" : undefined }}
  >
    <defs>
      <linearGradient id="wheat-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>
    <path d="M92,86 C52,74 26,46 18,8" fill="none" stroke="url(#wheat-gold)" strokeWidth="3.4" strokeLinecap="round" />
    {[
      [78, 80, -25],
      [62, 70, -35],
      [48, 58, -45],
      [36, 44, -55],
      [26, 28, -65],
      [20, 12, -75],
    ].map(([x, y, rot], idx) => (
      <g key={idx} transform={`translate(${x}, ${y}) rotate(${rot})`}>
        <ellipse cx="-10" cy="-6" rx="11.5" ry="5.2" fill="url(#wheat-gold)" />
        <ellipse cx="8" cy="6" rx="11.5" ry="5.2" fill="url(#wheat-gold)" />
      </g>
    ))}
  </svg>
);

// Vòng Nguyệt Quế Kép & Dải Ruy-băng Vàng Ôm Khung Ảnh Tròn Lớn Trung Tâm Giáo Viên
const TeacherCenterWreath = () => {
  const leftAngles = Array.from({ length: 15 }, (_, i) => 160 + i * 6.4);
  const rightAngles = Array.from({ length: 15 }, (_, i) => 20 - i * 6.4);

  return (
    <svg
      viewBox="0 0 620 520"
      className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible drop-shadow-2xl"
    >
      <defs>
        <linearGradient id="tcw-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#854d0e" />
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="52%" stopColor="#d4af37" />
          <stop offset="80%" stopColor="#fffbeb" />
          <stop offset="100%" stopColor="#9a6b19" />
        </linearGradient>
        <linearGradient id="tcw-ribbon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#854d0e" />
          <stop offset="18%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#ca8a04" />
          <stop offset="82%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>

      {/* Nhánh nguyệt quế trái ôm khung tròn lớn */}
      {leftAngles.map((deg, idx) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 310 + 240 * Math.cos(rad);
        const cy = 248 - 240 * Math.sin(rad);
        return (
          <g key={`l-${idx}`} transform={`translate(${cx}, ${cy}) rotate(${90 - deg})`}>
            <path d="M0,0 C-14,-16 -12,-38 0,-50 C12,-38 14,-16 0,0 Z" fill="url(#tcw-gold)" transform="rotate(-28)" />
            <path d="M0,0 C-12,-14 -10,-32 0,-42 C10,-32 12,-14 0,0 Z" fill="url(#tcw-gold)" transform="translate(14, 4) rotate(24)" />
          </g>
        );
      })}

      {/* Nhánh nguyệt quế phải ôm khung tròn lớn */}
      {rightAngles.map((deg, idx) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 310 + 240 * Math.cos(rad);
        const cy = 248 - 240 * Math.sin(rad);
        return (
          <g key={`r-${idx}`} transform={`translate(${cx}, ${cy}) rotate(${-90 - deg})`}>
            <path d="M0,0 C-14,-16 -12,-38 0,-50 C12,-38 14,-16 0,0 Z" fill="url(#tcw-gold)" transform="rotate(28)" />
            <path d="M0,0 C-12,-14 -10,-32 0,-42 C10,-32 12,-14 0,0 Z" fill="url(#tcw-gold)" transform="translate(-14, 4) rotate(-24)" />
          </g>
        );
      })}

      {/* Dải ruy-băng vàng kim uốn vòm lên ở giữa (tạo vòm trang trọng ngay trên chữ CÔ GIÁO / THẦY GIÁO) */}
      <path
        d="M52,462 L138,432 L148,482 L68,502 L88,472 Z"
        fill="url(#tcw-ribbon)"
        stroke="#78350f"
        strokeWidth="1.4"
      />
      <path
        d="M568,462 L482,432 L472,482 L552,502 L532,472 Z"
        fill="url(#tcw-ribbon)"
        stroke="#78350f"
        strokeWidth="1.4"
      />
      <path
        d="M118,452 Q310,398 502,452 L490,496 Q310,442 130,496 Z"
        fill="url(#tcw-ribbon)"
        stroke="#fef08a"
        strokeWidth="2.4"
      />
    </svg>
  );
};

// Tách danh xưng ("THẦY GIÁO" / "CÔ GIÁO"), tên in hoa và môn giảng dạy cho bố cục Giáo viên
function parseTeacherDisplay(certData) {
  const rawName = String(certData.name || "").trim();
  let honorific = "GIÁO VIÊN";
  let cleanName = rawName;

  if (/^cô\s+/i.test(rawName)) {
    honorific = "CÔ GIÁO";
    cleanName = rawName.replace(/^cô\s+/i, "").trim();
  } else if (/^thầy\s+/i.test(rawName)) {
    honorific = "THẦY GIÁO";
    cleanName = rawName.replace(/^thầy\s+/i, "").trim();
  }

  const rawPrize = String(certData.prize || "").trim();
  let subjectName = "";
  let achievementPart = rawPrize;

  const dashMatch = rawPrize.split(/\s*[—–-]\s*MÔN\s+/i);
  if (dashMatch.length >= 2) {
    subjectName = dashMatch[1].trim();
    achievementPart = dashMatch[0].replace(/^ĐẠT:\s*/i, "").trim();
  }

  achievementPart = achievementPart.replace(/GIẢI\s+KK\b/gi, "GIẢI KHUYẾN KHÍCH");

  const subjectLine = subjectName ? `GIẢNG DẠY MÔN ${subjectName.toUpperCase()}` : certData.role.toUpperCase();
  const teamLine = subjectName
    ? `ĐỘI TUYỂN MÔN ${subjectName.toUpperCase()} — ${achievementPart.toUpperCase()}`
    : rawPrize.toUpperCase();

  return {
    honorific,
    displayName: cleanName.toUpperCase(),
    subjectLine,
    teamLine,
  };
}

export const CertificateCanvas = ({
  certData,
  theme,
  layoutMode,
  scriptFont,
  fontFactor = 1,
  nameScale = 1,
  titleFont = "'Cinzel', serif",
  titleSpacing = 8,
  customLogo,
  photoZoom,
  photoPan,
  isCropMode,
  onEnterCrop,
  onStartPan,
  onDropImage,
  onZoomDelta,
}) => {
  const isTeacher = layoutMode === "teacher";
  const isFirstPrize = certData.prize.toLowerCase().includes("nhất");

  const frameProps = {
    photo: certData.photo,
    zoom: photoZoom,
    panX: photoPan.x,
    panY: photoPan.y,
    isEditing: isCropMode,
    onEnterEdit: onEnterCrop,
    onStartPan,
    onDropImage,
    onZoomDelta,
  };

  const bigNameSize = fitNameSize(certData.name, { maxSize: 92, maxWidth: 940, factor: fontFactor, scale: nameScale });
  const teacherInfo = isTeacher ? parseTeacherDisplay(certData) : null;

  return (
    <div
      id="certificate-node"
      style={{ width: 1920, height: 1080, background: isTeacher ? "#f8fafc" : theme.bgGradient }}
      className="relative overflow-hidden select-none shadow-2xl"
    >
      {!isTeacher && (
        <>
          <LuxuryBackground theme={theme} />
          <SubjectWatermark type={theme.watermarkType} primaryColor={theme.primary} />
        </>
      )}

      {/* ============ BỐ CỤC 1: NGUYỆT QUẾ + RUY-BĂNG (HỌC SINH) ============ */}
      {layoutMode === "ribbon" && (
        <div className="relative z-20 w-full h-full flex items-center px-20">
          <div className="w-[44%] h-full flex flex-col items-center justify-center pt-2">
            <div className="relative w-[570px] h-[570px] flex items-center justify-center">
              <GoldenLaurelWreath />
              <SmartPhotoFrame {...frameProps} shape={theme.frameShape} size={570} />
            </div>
            <RibbonNameBanner
              name={certData.name}
              fontClass={scriptFont}
              fontFactor={fontFactor}
              nameScale={nameScale}
              subtitle={certData.role}
            />
          </div>

          <div className="w-[57%] h-full flex flex-col items-center justify-center text-center pl-10 pr-6">
            <SchoolHeader
              customLogo={customLogo}
              org={certData.org}
              school={certData.school}
              orgColor={theme.secondary}
              schoolColor={theme.primary}
            />

            <div className="relative my-2 px-16 py-4 rounded-full border-4 border-amber-400/80 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl">
              <LuxuryGoldTitle width={660} height={118} fontSize={94} fontFamily={titleFont} letterSpacing={titleSpacing} />
            </div>

            <div className="flex items-center justify-center gap-5 my-6">
              <span className="w-36 h-[2.5px] bg-gradient-to-r from-transparent to-amber-600" />
              <span className="text-amber-500 text-3xl tracking-widest">★ ★ ★</span>
              <span className="w-36 h-[2.5px] bg-gradient-to-l from-transparent to-amber-600" />
            </div>

            <EventTitle event={certData.event} color={theme.primary} className="mb-8 px-4" />

            <PrizeBadge
              prize={certData.prize}
              background={theme.badgeBg}
              isFirst={isFirstPrize}
              icon={isFirstPrize ? "👑" : "🏆"}
            />

            {certData.showMeta && certData.metaText && (
              <div className="mt-6 font-jakarta font-bold text-[22px] px-8 py-2 rounded-full bg-white/90 text-slate-800 border-2 border-amber-300 shadow">
                {certData.metaText}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ BỐ CỤC 2: TRUYỀN THỐNG (HỌC SINH) ============ */}
      {layoutMode === "classic" && (
        <div className="relative z-20 w-full h-full flex items-center px-24">
          <div className="w-[58%] h-full flex flex-col items-center justify-center text-center pr-10">
            <SchoolHeader
              customLogo={customLogo}
              org={certData.org}
              school={certData.school}
              orgColor={theme.secondary}
              schoolColor={theme.primary}
              logoSize={116}
            />

            <LuxuryGoldTitle width={900} height={140} fontSize={112} fontFamily={titleFont} letterSpacing={titleSpacing + 2} />

            <div className="flex items-center justify-center gap-5 my-3">
              <span className="w-28 h-[2px] bg-amber-600/70" />
              <span className="text-amber-600 text-3xl">📖</span>
              <span className="w-28 h-[2px] bg-amber-600/70" />
            </div>

            <div className={`${scriptFont} text-[46px] font-bold text-red-700 mb-1`}>• {certData.role} •</div>

            <div
              className={`${scriptFont} font-bold text-slate-900 mb-6 px-4 whitespace-nowrap`}
              style={{ fontSize: bigNameSize, lineHeight: 1.3, textShadow: "0 3px 8px rgba(0,0,0,0.12)" }}
            >
              {certData.name}
            </div>

            <div className="mb-6">
              <PrizeBadge
                prize={certData.prize}
                background={theme.badgeBg}
                isFirst={isFirstPrize}
                icon={isFirstPrize ? "👑" : "🏅"}
              />
            </div>

            {certData.showMeta && certData.metaText && (
              <div className="mb-4 font-jakarta font-bold text-[21px] px-7 py-1.5 rounded-full bg-white/90 text-slate-700 border border-amber-300">
                {certData.metaText}
              </div>
            )}

            <EventTitle event={certData.event} color={theme.primary} firstSize={27} restSize={21} />
          </div>

          <div className="w-[42%] h-full flex items-center justify-center relative">
            <div className="relative w-[580px] h-[580px] flex items-center justify-center">
              <GraduationCapSvg />
              <GoldenLaurelWreath />
              <SmartPhotoFrame {...frameProps} shape="circle" size={580} beaded />
            </div>
          </div>
        </div>
      )}

      {/* ============ BỐ CỤC 3: MẪU RIÊNG GIÁO VIÊN ĐỐI XỨNG HOÀNG GIA (ROYAL BLUE & GOLD) ============ */}
      {layoutMode === "teacher" && teacherInfo && (
        <>
          <TeacherRoyalBackdrop />

          {/* Logo 60 năm THPT Chí Linh đặt trang trọng bên trái cụm tiêu đề */}
          <div className="absolute left-[325px] top-[40px] z-30">
            <ChiLinh60YearsLogo customLogo={customLogo} size={156} />
          </div>

          <div className="relative z-20 w-full h-full flex flex-col items-center pt-[32px] pb-[52px] px-24 text-center">
            {/* Tên trường + Chữ VINH DANH kẹp giữa đôi bông lúa vàng */}
            <div
              className="font-cinzel font-black text-[46px] uppercase tracking-wider leading-none"
              style={{
                color: "#0a2259",
                textShadow: "0 2px 0 #ffffff, 0 4px 12px rgba(10,34,89,0.18)",
              }}
            >
              {certData.school}
            </div>

            <div className="flex items-center justify-center gap-2 -mt-1">
              <SideWheatBranch />
              <LuxuryGoldTitle
                width={600}
                height={92}
                fontSize={86}
                fontFamily={titleFont}
                letterSpacing={titleSpacing}
              />
              <SideWheatBranch flip />
            </div>

            {/* Đường hoa văn kim cương dưới chữ VINH DANH */}
            <div className="flex items-center justify-center gap-3 -mt-2 mb-1.5">
              <span className="w-56 h-[2.5px] bg-gradient-to-r from-transparent via-amber-500 to-amber-700" />
              <span className="text-amber-600 text-xl leading-none">❖</span>
              <span className="w-56 h-[2.5px] bg-gradient-to-l from-transparent via-amber-500 to-amber-700" />
            </div>

            {/* Tiêu đề sự kiện bồi dưỡng HSG */}
            <div className="max-w-[1440px] mb-0.5">
              {String(certData.event || "")
                .split("\n")
                .filter(Boolean)
                .map((line, idx) => (
                  <div
                    key={idx}
                    className="font-main uppercase font-black"
                    style={{
                      fontSize: idx === 0 ? 32 : idx === 1 ? 26 : 24,
                      color: idx === 0 ? "#081b4b" : "#153e96",
                      letterSpacing: idx === 0 ? "0.02em" : "0.08em",
                      lineHeight: 1.28,
                    }}
                  >
                    {line}
                  </div>
                ))}
            </div>

            {/* Khung ảnh tròn trung tâm CỠ LỚN (440px) + Vòng nguyệt quế kép & Ruy-băng vòm vàng */}
            <div className="relative w-[600px] h-[476px] flex items-center justify-center -mt-2">
              <div className="-mt-4">
                <SmartPhotoFrame {...frameProps} shape="circle" size={440} beaded />
              </div>
              <TeacherCenterWreath />
            </div>

            {/* Danh xưng + Họ tên Giáo viên CỠ LỚN + Môn giảng dạy + Bảng thành tích đội tuyển */}
            <div className="-mt-6 flex flex-col items-center z-30">
              <div
                className="font-main font-black text-[33px] uppercase tracking-widest leading-tight"
                style={{
                  color: "#0a2259",
                  textShadow: "0 2px 0 #ffffff",
                }}
              >
                {teacherInfo.honorific}
              </div>

              <div
                className="font-playfair font-black uppercase tracking-wide leading-tight px-6 mt-0.5"
                style={{
                  fontSize:
                    Math.min(68, Math.max(48, Math.round(1120 / Math.max(10, teacherInfo.displayName.length * 0.58)))) *
                    nameScale,
                  color: "#092058",
                  textShadow: "0 2.5px 0 #ffffff, 0 5px 14px rgba(9,32,88,0.22)",
                }}
              >
                {teacherInfo.displayName}
              </div>

              {/* Hoa văn ngăn cách dưới tên giáo viên */}
              <div className="flex items-center justify-center gap-3 my-1">
                <span className="w-44 h-[2.5px] bg-gradient-to-r from-transparent to-amber-500" />
                <span className="text-amber-500 text-xl leading-none">✦ ❖ ✦</span>
                <span className="w-44 h-[2.5px] bg-gradient-to-l from-transparent to-amber-500" />
              </div>

              <div
                className="font-main font-black text-[30px] uppercase tracking-wider leading-tight"
                style={{ color: "#0f172a" }}
              >
                {teacherInfo.subjectLine}
              </div>

              <div
                className="mt-2 px-10 py-1.5 rounded-full border-2 border-amber-400/90 shadow-lg flex items-center gap-3"
                style={{
                  background: "linear-gradient(90deg, #061539 0%, #0f3485 50%, #061539 100%)",
                }}
              >
                <span className="text-amber-300 text-2xl">★</span>
                <span className="font-main font-extrabold text-[26px] uppercase tracking-wider text-amber-100">
                  {teacherInfo.teamLine}
                </span>
                <span className="text-amber-300 text-2xl">★</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
