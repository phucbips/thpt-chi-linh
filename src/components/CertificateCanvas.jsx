import React from "react";
import {
  ChiLinh60YearsLogo,
  LuxuryBackground,
  SubjectWatermark,
  GoldenLaurelWreath,
  GraduationCapSvg,
  TeacherDualRibbons,
} from "./SvgArtwork";
import { EventTitle, LuxuryGoldTitle, RibbonNameBanner, SmartPhotoFrame, fitNameSize } from "./FrameAndType";

// Cụm Logo + tên trường dùng chung
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

  return (
    <div
      id="certificate-node"
      style={{ width: 1920, height: 1080, background: theme.bgGradient }}
      className="relative overflow-hidden select-none shadow-2xl"
    >
      <LuxuryBackground theme={theme} />
      <SubjectWatermark type={isTeacher ? "teacher" : theme.watermarkType} primaryColor={theme.primary} />

      {/* ============ BỐ CỤC 1: NGUYỆT QUẾ + RUY-BĂNG ============ */}
      {layoutMode === "ribbon" && (
        <div className="relative z-20 w-full h-full flex items-center px-24">
          <div className="w-[43%] h-full flex flex-col items-center justify-center pt-6">
            <div className="relative w-[490px] h-[490px] flex items-center justify-center">
              <GoldenLaurelWreath />
              <SmartPhotoFrame {...frameProps} shape={theme.frameShape} size={490} />
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

      {/* ============ BỐ CỤC 2: TRUYỀN THỐNG ============ */}
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
            <div className="relative w-[530px] h-[530px] flex items-center justify-center">
              <GraduationCapSvg />
              <GoldenLaurelWreath />
              <SmartPhotoFrame {...frameProps} shape="circle" size={530} beaded />
            </div>
          </div>
        </div>
      )}

      {/* ============ BỐ CỤC 3: GIÁO VIÊN ============ */}
      {layoutMode === "teacher" && (
        <div className="relative z-20 w-full h-full flex items-center px-24">
          <div className="w-[42%] h-full flex flex-col items-center justify-center pt-4">
            <div className="relative w-[500px] h-[500px] flex items-center justify-center">
              <SmartPhotoFrame {...frameProps} shape="starburst" size={500} />
            </div>
            <TeacherDualRibbons />
          </div>

          <div className="w-[58%] h-full flex flex-col items-center justify-center text-center pl-10 pr-4">
            <SchoolHeader
              customLogo={customLogo}
              org={certData.org}
              school={certData.school}
              orgColor="#991b1b"
              schoolColor="#450a0a"
              logoSize={118}
            />

            <div className="px-16 py-3 rounded-full border-4 border-amber-400 bg-gradient-to-b from-red-950 to-red-900 shadow-2xl mb-4">
              <LuxuryGoldTitle width={620} height={112} fontSize={90} fontFamily={titleFont} letterSpacing={titleSpacing} />
            </div>

            <div className="font-main text-[23px] font-extrabold uppercase text-amber-800 mb-1" style={{ letterSpacing: "0.22em" }}>
              ★ Giáo viên bồi dưỡng đội tuyển ★
            </div>

            <div
              className={`${scriptFont} font-bold text-red-950 mb-4 px-4 whitespace-nowrap`}
              style={{
                fontSize: fitNameSize(certData.name, { maxSize: 84, maxWidth: 900, factor: fontFactor, scale: nameScale }),
                lineHeight: 1.3,
                textShadow: "0 3px 8px rgba(127,29,29,0.18)",
              }}
            >
              {certData.name}
            </div>

            <EventTitle event={certData.event} color="#450a0a" firstSize={28} restSize={22} className="mb-7 px-4" />

            <PrizeBadge
              prize={certData.prize}
              background="linear-gradient(90deg, #7f1d1d 0%, #dc2626 50%, #7f1d1d 100%)"
              isFirst
              icon="👑"
              maxLongSize={23}
            />
          </div>
        </div>
      )}
    </div>
  );
};
