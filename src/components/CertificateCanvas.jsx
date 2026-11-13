import React from "react";
import {
  ChiLinh60YearsLogo,
  LuxuryBackground,
  SubjectWatermark,
  SvgGold3DTitle,
  GoldenLaurelWreath,
  GoldenRibbonBanner,
  GraduationCapSvg,
  SvgPhotoFrame,
  TeacherDualRibbons,
} from "./SvgArtwork";

export const CertificateCanvas = ({
  certData,
  theme,
  layoutMode,
  scriptFont,
  customLogo,
  photoZoom,
  photoPan,
  onPhotoPointerDown,
}) => {
  const isTeacher = layoutMode === "teacher";
  const effectiveTheme = theme;

  const isFirstPrize = certData.prize.toLowerCase().includes("nhất");

  return (
    <div
      id="certificate-node"
      style={{
        width: 1920,
        height: 1080,
        background: effectiveTheme.bgGradient,
      }}
      className="relative overflow-hidden select-none shadow-2xl"
    >
      {/* 1. Nền sân khấu đa tầng + dải lụa + khung viền vàng + ánh kim */}
      <LuxuryBackground theme={effectiveTheme} />

      {/* 2. Họa tiết chìm chuyên ngành theo 12 môn học / Giáo viên */}
      <SubjectWatermark
        type={isTeacher ? "teacher" : effectiveTheme.watermarkType}
        primaryColor={effectiveTheme.primary}
      />

      {/* ===================================================================
          BỐ CỤC 1: HIỆN ĐẠI (VÒNG NGUYỆT QUẾ + RUY-BĂNG VÀNG 3D)
         =================================================================== */}
      {layoutMode === "ribbon" && (
        <div className="relative z-20 w-full h-full flex items-center px-24">
          {/* Cột Trái (43%): Ảnh + Vòng Nguyệt Quế + Ruy-băng Tên */}
          <div className="w-[43%] h-full flex flex-col items-center justify-center pt-6">
            <div className="relative w-[490px] h-[490px] flex items-center justify-center">
              <GoldenLaurelWreath />
              <SvgPhotoFrame
                photo={certData.photo}
                shape={effectiveTheme.frameShape}
                size={490}
                zoom={photoZoom}
                panX={photoPan.x}
                panY={photoPan.y}
                onPointerDown={onPhotoPointerDown}
              />
            </div>

            <GoldenRibbonBanner
              name={certData.name}
              fontClass={scriptFont}
              subtitle={certData.role}
            />
          </div>

          {/* Cột Phải (57%): Cụm Logo 60 năm + VINH DANH 3D + Thành tích */}
          <div className="w-[57%] h-full flex flex-col items-center justify-center text-center pl-10 pr-6">
            <div className="flex items-center justify-center gap-6 mb-7">
              <ChiLinh60YearsLogo customLogo={customLogo} size={126} />
              <div className="text-left">
                <div
                  className="text-[22px] font-bold tracking-wider uppercase"
                  style={{ color: effectiveTheme.secondary }}
                >
                  {certData.org}
                </div>
                <div
                  className="text-[38px] font-black tracking-tight uppercase leading-tight"
                  style={{ color: effectiveTheme.primary }}
                >
                  {certData.school}
                </div>
                <div className="h-1 w-56 bg-gradient-to-r from-amber-500 to-transparent mt-2" />
              </div>
            </div>

            {/* Khung Pill VINH DANH Vàng 3D */}
            <div className="relative my-2 px-16 py-4 rounded-full border-4 border-amber-400/80 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl">
              <SvgGold3DTitle text="VINH DANH" width={660} height={115} fontSize={94} />
            </div>

            {/* Dải sao phân cách */}
            <div className="flex items-center justify-center gap-5 my-6">
              <span className="w-36 h-[2.5px] bg-gradient-to-r from-transparent to-amber-600" />
              <span className="text-amber-500 text-3xl tracking-widest">★ ★ ★</span>
              <span className="w-36 h-[2.5px] bg-gradient-to-l from-transparent to-amber-600" />
            </div>

            {/* Tên kỳ thi */}
            <div
              className="font-main font-extrabold text-[29px] leading-relaxed uppercase tracking-wide mb-8 px-4"
              style={{ color: effectiveTheme.primary }}
            >
              {certData.event.split("\n").map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>

            {/* Huy hiệu Giải thưởng */}
            <div
              className={`px-14 py-5 rounded-full text-white font-extrabold text-[34px] tracking-wide shadow-2xl border-4 flex items-center gap-4 ${
                isFirstPrize ? "border-yellow-300" : "border-amber-300/90"
              }`}
              style={{ background: effectiveTheme.badgeBg }}
            >
              <span>{isFirstPrize ? "👑" : "🏆"}</span>
              <span>{certData.prize}</span>
            </div>

            {/* Thông tin bổ sung (SBD / Ngày sinh) */}
            {certData.showMeta && certData.metaText && (
              <div className="mt-5 font-jakarta font-bold text-[22px] px-8 py-2 rounded-full bg-white/90 text-slate-800 border-2 border-amber-300 shadow">
                {certData.metaText}
              </div>
            )}

            <div
              className="mt-7 text-[19px] font-bold tracking-[0.25em] uppercase opacity-70"
              style={{ color: effectiveTheme.primary }}
            >
              — {effectiveTheme.symbol} —
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          BỐ CỤC 2: TRUYỀN THỐNG THPT CHÍ LINH (CHỮ TRÁI - ẢNH PHẢI + MŨ CỬ NHÂN)
         =================================================================== */}
      {layoutMode === "classic" && (
        <div className="relative z-20 w-full h-full flex items-center px-24">
          {/* Cột Trái (58%) */}
          <div className="w-[58%] h-full flex flex-col items-center justify-center text-center pr-10">
            <div className="flex items-center justify-center gap-5 mb-6">
              <ChiLinh60YearsLogo customLogo={customLogo} size={118} />
              <div className="text-left">
                <div
                  className="text-[22px] font-bold uppercase tracking-wider"
                  style={{ color: effectiveTheme.secondary }}
                >
                  {certData.org}
                </div>
                <div
                  className="text-[38px] font-black uppercase tracking-tight leading-tight"
                  style={{ color: effectiveTheme.primary }}
                >
                  {certData.school}
                </div>
              </div>
            </div>

            <h1
              className="font-serif-title text-[104px] font-black uppercase tracking-wider leading-none mb-4"
              style={{
                color: effectiveTheme.primary,
                textShadow: "0 6px 14px rgba(0,0,0,0.12)",
              }}
            >
              VINH DANH
            </h1>

            <div className="flex items-center justify-center gap-5 mb-4">
              <span className="w-28 h-[2px] bg-amber-600/70" />
              <span className="text-amber-600 text-3xl">📖</span>
              <span className="w-28 h-[2px] bg-amber-600/70" />
            </div>

            <div className={`${scriptFont} text-[48px] font-bold text-red-700 mb-1`}>
              • {certData.role} •
            </div>

            <div className={`${scriptFont} text-[88px] font-bold text-slate-900 leading-tight mb-6 px-4`}>
              {certData.name}
            </div>

            <div
              className="px-14 py-4 rounded-full text-white font-extrabold text-[34px] shadow-2xl border-4 border-amber-300 mb-6 flex items-center gap-3"
              style={{ background: effectiveTheme.badgeBg }}
            >
              <span>{isFirstPrize ? "👑" : "🏅"}</span>
              <span>{certData.prize}</span>
            </div>

            {certData.showMeta && certData.metaText && (
              <div className="mb-4 font-jakarta font-bold text-[21px] px-7 py-1.5 rounded-full bg-white/90 text-slate-700 border border-amber-300">
                {certData.metaText}
              </div>
            )}

            <div
              className="font-main font-extrabold text-[27px] leading-snug uppercase"
              style={{ color: effectiveTheme.primary }}
            >
              {certData.event.split("\n").map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>

          {/* Cột Phải (42%): Khung ảnh tròn chấm bi nổi + Mũ cử nhân */}
          <div className="w-[42%] h-full flex items-center justify-center relative">
            <div className="relative w-[530px] h-[530px] flex items-center justify-center">
              <GraduationCapSvg />
              <GoldenLaurelWreath />
              <SvgPhotoFrame
                photo={certData.photo}
                shape="circle"
                size={530}
                zoom={photoZoom}
                panX={photoPan.x}
                panY={photoPan.y}
                beaded={true}
                onPointerDown={onPhotoPointerDown}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          BỐ CỤC 3: VINH DANH GIÁO VIÊN BỒI DƯỠNG (ĐỎ ĐÔ - VÀNG KIM)
         =================================================================== */}
      {layoutMode === "teacher" && (
        <div className="relative z-20 w-full h-full flex items-center px-24">
          {/* Cột Trái (42%): Huy chương răng cưa sao vàng + 2 dải ruy-băng đỏ sọc vàng */}
          <div className="w-[42%] h-full flex flex-col items-center justify-center pt-4">
            <div className="relative w-[500px] h-[500px] flex items-center justify-center">
              <SvgPhotoFrame
                photo={certData.photo}
                shape="starburst"
                size={500}
                zoom={photoZoom}
                panX={photoPan.x}
                panY={photoPan.y}
                onPointerDown={onPhotoPointerDown}
              />
            </div>
            <TeacherDualRibbons />
          </div>

          {/* Cột Phải (58%): Logo + VINH DANH + Tên Thầy/Cô + Tổng hợp thành tích */}
          <div className="w-[58%] h-full flex flex-col items-center justify-center text-center pl-10 pr-4">
            <div className="flex items-center justify-center gap-6 mb-6">
              <ChiLinh60YearsLogo customLogo={customLogo} size={120} />
              <div className="text-left">
                <div className="text-[22px] font-bold uppercase tracking-wider text-red-800">
                  {certData.org}
                </div>
                <div className="text-[38px] font-black uppercase tracking-tight text-red-950 leading-tight">
                  {certData.school}
                </div>
                <div className="h-1 w-56 bg-gradient-to-r from-amber-500 to-transparent mt-2" />
              </div>
            </div>

            <div className="px-16 py-3 rounded-full border-4 border-amber-400 bg-gradient-to-b from-red-950 to-red-900 shadow-2xl mb-4">
              <SvgGold3DTitle text="VINH DANH" width={620} height={108} fontSize={90} />
            </div>

            <div className="text-[24px] font-extrabold uppercase tracking-[0.2em] text-amber-800 mb-2">
              ★ GIÁO VIÊN BỒI DƯỠNG ĐỘI TUYỂN ★
            </div>

            <div className={`${scriptFont} text-[82px] font-bold text-red-950 leading-tight mb-5 px-4`}>
              {certData.name}
            </div>

            <div className="font-main font-extrabold text-[27px] leading-relaxed uppercase text-red-950 mb-7 px-4">
              {certData.event.split("\n").map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>

            <div
              className="px-12 py-5 rounded-full text-white font-extrabold text-[30px] tracking-wide shadow-2xl border-4 border-amber-300 flex items-center gap-3"
              style={{
                background: "linear-gradient(90deg, #7f1d1d 0%, #dc2626 50%, #7f1d1d 100%)",
              }}
            >
              <span>👑</span>
              <span>{certData.prize}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
