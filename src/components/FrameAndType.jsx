import React, { useEffect, useId, useRef, useState } from "react";

// ============================================================================
// TIỆN ÍCH: Tự động co cỡ chữ tên theo độ dài + hệ số riêng của từng phông
// ============================================================================
export function fitNameSize(name, { maxSize, maxWidth, factor = 1, scale = 1 }) {
  const len = Math.max(6, String(name || "").length);
  // Chữ viết tay trung bình rộng ~0.44em mỗi ký tự
  const fit = maxWidth / (len * 0.44);
  return Math.round(Math.min(maxSize, fit) * factor * scale);
}

const safeId = (id) => id.replace(/[^a-zA-Z0-9_-]/g, "");

// ============================================================================
// 1. CHỮ "VINH DANH" VÀNG KIM NỔI KHỐI 3D (5 LỚP SVG)
//    Bóng đổ mềm → khối đùn 3D → mặt vàng kim → viền vát sáng → ánh phản quang
// ============================================================================
export const LuxuryGoldTitle = ({
  text = "VINH DANH",
  width = 680,
  height = 130,
  fontSize = 96,
  fontFamily = "'Cinzel', serif",
  letterSpacing = 8,
}) => {
  const uid = safeId(useId());
  const baseY = height * 0.76;
  const common = {
    x: "50%",
    y: baseY,
    textAnchor: "middle",
    fontFamily,
    fontWeight: 900,
    fontSize,
    letterSpacing,
  };
  const depth = 7;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <defs>
        {/* Mặt chữ: vàng kim nhiều tầng như kim loại đánh bóng */}
        <linearGradient id={`face-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffdf0" />
          <stop offset="18%" stopColor="#fde68a" />
          <stop offset="42%" stopColor="#f5c542" />
          <stop offset="50%" stopColor="#b7791f" />
          <stop offset="62%" stopColor="#e9b949" />
          <stop offset="82%" stopColor="#fff3b0" />
          <stop offset="100%" stopColor="#c58b1c" />
        </linearGradient>
        {/* Khối đùn 3D: nâu đồng tối */}
        <linearGradient id={`depth-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c4a03" />
          <stop offset="100%" stopColor="#3b2103" />
        </linearGradient>
        {/* Viền vát */}
        <linearGradient id={`edge-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="50%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
        {/* Ánh phản quang nửa trên */}
        <linearGradient id={`gloss-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="46%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* L1: Bóng đổ mềm */}
      <text {...common} fill="#000" opacity="0.28" transform={`translate(0, ${depth + 8})`}>
        {text}
      </text>
      {/* L2: Khối đùn 3D */}
      {Array.from({ length: depth }).map((_, i) => (
        <text key={i} {...common} fill={`url(#depth-${uid})`} transform={`translate(0, ${depth - i})`}>
          {text}
        </text>
      ))}
      {/* L3: Mặt vàng kim + viền vát */}
      <text {...common} fill={`url(#face-${uid})`} stroke={`url(#edge-${uid})`} strokeWidth="1.6" paintOrder="stroke">
        {text}
      </text>
      {/* L4: Ánh phản quang */}
      <text {...common} fill={`url(#gloss-${uid})`}>
        {text}
      </text>
    </svg>
  );
};

// ============================================================================
// 2. TIÊU ĐỀ KỲ THI CÓ PHÂN CẤP (dòng 1 to đậm, các dòng sau nhỏ & giãn chữ)
// ============================================================================
export const EventTitle = ({ event, color, firstSize = 30, restSize = 23, className = "" }) => {
  const lines = String(event || "").split("\n").filter(Boolean);
  return (
    <div className={`font-main uppercase ${className}`} style={{ color }}>
      {lines.map((line, idx) => (
        <div
          key={idx}
          style={{
            fontSize: idx === 0 ? firstSize : restSize,
            fontWeight: idx === 0 ? 800 : 700,
            letterSpacing: idx === 0 ? "0.01em" : "0.06em",
            lineHeight: 1.45,
            opacity: idx === 0 ? 1 : 0.88,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// 3. RUY-BĂNG VÀNG CHỨA TÊN (tự co cỡ chữ, không bao giờ bị cắt "...")
// ============================================================================
export const RibbonNameBanner = ({ name, fontClass, fontFactor = 1, nameScale = 1, subtitle }) => {
  const size = fitNameSize(name, { maxSize: 60, maxWidth: 520, factor: fontFactor, scale: nameScale });
  return (
    <div className="relative z-30 -mt-10 flex flex-col items-center">
      <div className="relative w-[700px] h-[140px] flex items-center justify-center">
        <svg viewBox="0 0 420 90" className="w-full h-full drop-shadow-2xl" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="rb-main" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b48327" />
              <stop offset="15%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="85%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#9a6b19" />
            </linearGradient>
            <linearGradient id="rb-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#785212" />
              <stop offset="100%" stopColor="#4d3308" />
            </linearGradient>
          </defs>
          <path d="M 8,32 L 55,32 L 55,82 L 8,82 L 26,57 Z" fill="url(#rb-main)" stroke="#85581A" strokeWidth="1" />
          <path d="M 412,32 L 365,32 L 365,82 L 412,82 L 394,57 Z" fill="url(#rb-main)" stroke="#85581A" strokeWidth="1" />
          <polygon points="35,68 55,82 55,68" fill="url(#rb-dark)" />
          <polygon points="385,68 365,82 365,68" fill="url(#rb-dark)" />
          <path d="M 35,14 Q 210,26 385,14 L 385,68 Q 210,80 35,68 Z" fill="url(#rb-main)" stroke="#fef08a" strokeWidth="2" />
          <path d="M 40,19 Q 210,31 380,19" stroke="#9a6b19" strokeWidth="1" strokeDasharray="3,3" fill="none" />
          <path d="M 40,63 Q 210,75 380,63" stroke="#9a6b19" strokeWidth="1" strokeDasharray="3,3" fill="none" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center px-20">
          <span
            className={`${fontClass} whitespace-nowrap`}
            style={{
              fontSize: size,
              lineHeight: 1.35,
              paddingTop: size * 0.08,
              color: "#3b1d02",
              fontWeight: 700,
              // Hiệu ứng khắc chìm trên nền vàng: viền sáng phía dưới
              textShadow: "0 1.5px 0 rgba(255,250,220,0.75), 0 -1px 0 rgba(90,50,0,0.25)",
            }}
          >
            {name}
          </span>
        </div>
      </div>
      {subtitle && (
        <div className="mt-2 px-8 py-2 rounded-full bg-white/90 border-2 border-amber-400 shadow-md">
          <span className="font-jakarta font-extrabold text-[24px] text-[#5c3a08] tracking-wide">{subtitle}</span>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 4. KHUNG ẢNH THÔNG MINH KIỂU CANVA (FRAME)
//    • Kéo thả ảnh (từ máy tính hoặc từ Thư viện) thả vào là tự khớp hình khung
//    • Đúp chuột → chế độ căn chỉnh: kéo để dịch, lăn chuột để zoom, thấy phần ảnh bị ẩn mờ bên ngoài
//    • Enter / Esc / click ra ngoài → hoàn tất
// ============================================================================
const STAR_POINTS =
  "250,8 292,42 346,24 366,76 420,82 418,136 462,172 440,222 468,268 428,308 434,362 380,380 364,432 308,426 270,468 220,446 172,468 134,426 78,432 62,380 8,362 14,308 -26,268 2,222 -20,172 24,136 22,82 76,76 96,24 150,42 192,8 221,30";
const HEX_POINTS = "250,12 456,131 456,369 250,488 44,369 44,131";

export const SmartPhotoFrame = ({
  photo,
  shape = "circle",
  size = 480,
  zoom = 1,
  panX = 0,
  panY = 0,
  beaded = false,
  isEditing = false,
  onStartPan,
  onEnterEdit,
  onDropImage,
  onZoomDelta,
}) => {
  const uid = safeId(useId());
  const wrapRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  // Lăn chuột để zoom (chỉ khi đang ở chế độ căn chỉnh) – cần listener non-passive
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (!isEditing) return;
      e.preventDefault();
      onZoomDelta?.(e.deltaY < 0 ? 0.05 : -0.05);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isEditing, onZoomDelta]);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => onDropImage?.(ev.target.result);
      reader.readAsDataURL(file);
      return;
    }
    const src =
      e.dataTransfer.getData("application/x-vinhdanh-photo") ||
      e.dataTransfer.getData("text/uri-list") ||
      e.dataTransfer.getData("text/plain");
    if (src) onDropImage?.(src.trim());
  };

  const imgW = 500 * zoom;
  const imgH = 500 * zoom;
  const imgX = 250 - imgW / 2 + panX;
  const imgY = 250 - imgH / 2 + panY;

  const clipShape =
    shape === "hexagon" ? (
      <polygon points={HEX_POINTS} />
    ) : shape === "starburst" ? (
      <polygon points={STAR_POINTS} />
    ) : (
      <circle cx="250" cy="250" r="222" />
    );

  return (
    <div
      ref={wrapRef}
      data-photo-frame="true"
      onPointerDown={(e) => {
        if (isEditing) onStartPan?.(e);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onEnterEdit?.();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        if (!dragOver) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      style={{ width: size, height: size, cursor: isEditing ? "move" : "pointer", touchAction: "none" }}
      className="relative select-none z-10"
    >
      <svg viewBox="-30 -10 560 520" className="w-full h-full drop-shadow-2xl" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`fg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b48327" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#ca8a04" />
            <stop offset="75%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <clipPath id={`clip-${uid}`}>{clipShape}</clipPath>
        </defs>

        {/* Viền vàng kim ngoài */}
        {shape === "hexagon" && <polygon points="250,-4 470,123 470,377 250,504 30,377 30,123" fill={`url(#fg-${uid})`} />}
        {shape === "starburst" && (
          <polygon points={STAR_POINTS} transform="translate(250,250) scale(1.06) translate(-250,-250)" fill={`url(#fg-${uid})`} />
        )}
        {shape === "circle" && <circle cx="250" cy="250" r="244" fill={`url(#fg-${uid})`} />}

        {beaded &&
          shape === "circle" &&
          Array.from({ length: 24 }).map((_, idx) => {
            const ang = (idx * 15 * Math.PI) / 180;
            return <circle key={idx} cx={250 + 234 * Math.cos(ang)} cy={250 + 234 * Math.sin(ang)} r="4.5" fill="#fffbeb" opacity="0.85" />;
          })}

        {/* Viền trắng trong */}
        {shape === "hexagon" && <polygon points="250,4 463,127 463,373 250,496 37,373 37,127" fill="#ffffff" />}
        {shape === "starburst" && (
          <polygon points={STAR_POINTS} transform="translate(250,250) scale(1.02) translate(-250,-250)" fill="#ffffff" />
        )}
        {shape === "circle" && <circle cx="250" cy="250" r="228" fill="#ffffff" />}

        {/* CHẾ ĐỘ CĂN CHỈNH: hiện mờ phần ảnh nằm ngoài khung (như Canva) */}
        {isEditing && (
          <g pointerEvents="none">
            <image href={photo} x={imgX} y={imgY} width={imgW} height={imgH} preserveAspectRatio="xMidYMid slice" opacity="0.35" />
            <rect x={imgX} y={imgY} width={imgW} height={imgH} fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="10 6" />
          </g>
        )}

        {/* Ảnh chính được cắt theo hình khung */}
        <g clipPath={`url(#clip-${uid})`}>
          <rect x="-30" y="-10" width="560" height="520" fill="#e2e8f0" />
          <image href={photo} x={imgX} y={imgY} width={imgW} height={imgH} preserveAspectRatio="xMidYMid slice" />

          {/* Lưới 1/3 hỗ trợ căn mặt khi đang chỉnh */}
          {isEditing && (
            <g stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" pointerEvents="none">
              <line x1="183" y1="0" x2="183" y2="500" />
              <line x1="317" y1="0" x2="317" y2="500" />
              <line x1="0" y1="183" x2="500" y2="183" />
              <line x1="0" y1="317" x2="500" y2="317" />
            </g>
          )}

          {/* Hiệu ứng khi đang kéo ảnh vào khung */}
          {dragOver && (
            <g pointerEvents="none">
              <rect x="-30" y="-10" width="560" height="520" fill="#0ea5e9" opacity="0.45" />
              <text x="250" y="262" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight="800" fontSize="34" fill="#ffffff">
                Thả ảnh vào khung
              </text>
            </g>
          )}
        </g>

        {/* Viền xanh báo khung đang được chọn */}
        {(isEditing || dragOver) && (
          <g fill="none" stroke="#0ea5e9" strokeWidth="5" pointerEvents="none">
            {clipShape}
          </g>
        )}
      </svg>
    </div>
  );
};
