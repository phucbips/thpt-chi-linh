import pico from "./pico";

let cascadeClassifier = null;
let cascadeLoadingPromise = null;

/**
 * Tải mô hình cascade nhận diện khuôn mặt (chạy 100% offline trên trình duyệt)
 */
export async function loadFaceDetector() {
  if (cascadeClassifier) return cascadeClassifier;
  if (cascadeLoadingPromise) return cascadeLoadingPromise;

  cascadeLoadingPromise = (async () => {
    try {
      const res = await fetch("/facefinder");
      if (!res.ok) throw new Error("Không thể tải /facefinder");
      const buffer = await res.arrayBuffer();
      const bytes = new Int8Array(buffer);
      cascadeClassifier = pico.unpack_cascade(bytes);
      return cascadeClassifier;
    } catch (err) {
      console.warn("Lỗi tải facefinder:", err);
      return null;
    }
  })();

  return cascadeLoadingPromise;
}

/**
 * Chuyển mảng dữ liệu RGBA sang mảng độ sáng Grayscale 8-bit cho Pico.js
 */
function rgbaToGrayscale(rgba, nrows, ncols) {
  const gray = new Uint8Array(nrows * ncols);
  for (let i = 0, j = 0; i < gray.length; i++, j += 4) {
    gray[i] = (77 * rgba[j] + 150 * rgba[j + 1] + 29 * rgba[j + 2]) >> 8;
  }
  return gray;
}

/**
 * Kiểm tra xem một pixel RGB có thuộc dải màu da người hay không
 */
function isSkinPixel(r, g, b) {
  if (r < 60 || g < 35 || b < 20) return false;
  if (r <= g || g < b * 0.75) return false;
  if (r - Math.min(g, b) < 10) return false;

  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return cb >= 72 && cb <= 142 && cr >= 128 && cr <= 185;
}

/**
 * Tính tỷ lệ điểm ảnh màu da bên trong vùng trung tâm của khung ứng viên (r, c, s)
 */
function computeSkinRatio(rgba, width, height, centerR, centerC, size) {
  const half = size * 0.36;
  const y0 = Math.max(0, Math.floor(centerR - half));
  const y1 = Math.min(height - 1, Math.ceil(centerR + half));
  const x0 = Math.max(0, Math.floor(centerC - half));
  const x1 = Math.min(width - 1, Math.ceil(centerC + half));

  let total = 0;
  let skin = 0;
  for (let y = y0; y <= y1; y += 2) {
    for (let x = x0; x <= x1; x += 2) {
      const idx = (y * width + x) * 4;
      total++;
      if (isSkinPixel(rgba[idx], rgba[idx + 1], rgba[idx + 2])) {
        skin++;
      }
    }
  }
  return total > 0 ? skin / total : 0;
}

/**
 * Dò khuôn mặt với góc xoay nhẹ (hỗ trợ các ảnh học sinh nghiêng đầu tạo dáng)
 */
function detectOnRotatedCanvas(img, targetW, targetH, classifier, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  const rotCanvas = document.createElement("canvas");
  rotCanvas.width = targetW;
  rotCanvas.height = targetH;
  const rctx = rotCanvas.getContext("2d", { willReadFrequently: true });

  rctx.translate(targetW / 2, targetH / 2);
  rctx.rotate(rad);
  rctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);

  const rgba = rctx.getImageData(0, 0, targetW, targetH).data;
  const pixels = rgbaToGrayscale(rgba, targetH, targetW);
  const dets = pico.cluster_detections(
    pico.run_cascade(
      { pixels, nrows: targetH, ncols: targetW, ldim: targetW },
      classifier,
      { shiftfactor: 0.08, minsize: 24, maxsize: Math.min(targetW, targetH), scalefactor: 1.09 }
    ),
    0.2
  );

  let best = null;
  for (const d of dets) {
    const [r, c, s, q] = d;
    if (q < 8.0) continue;
    const skinRatio = computeSkinRatio(rgba, targetW, targetH, r, c, s);
    if (skinRatio < 0.2) continue;
    const score = q * (0.6 + skinRatio * 1.8);
    if (!best || score > best.score) {
      // Chuyển tọa độ từ ảnh xoay ngược về ảnh gốc
      const dx = c - targetW / 2;
      const dy = r - targetH / 2;
      const origC = targetW / 2 + dx * Math.cos(-rad) - dy * Math.sin(-rad);
      const origR = targetH / 2 + dx * Math.sin(-rad) + dy * Math.cos(-rad);
      best = { r: origR, c: origC, s, q, score };
    }
  }
  return best;
}

/**
 * Bộ dò tìm khuôn mặt theo cụm màu da (Skin-Cluster Subject Detector)
 * Dùng khi học sinh nghiêng đầu nhiều hoặc đeo kính/phụ kiện che khuất
 */
function detectFaceBySkinCluster(rgba, width, height) {
  const gridCols = 60;
  const gridRows = Math.max(40, Math.round((height / width) * gridCols));
  const cellW = width / gridCols;
  const cellH = height / gridRows;

  const maxRow = Math.floor(gridRows * 0.78);
  const skinGrid = Array.from({ length: maxRow }, () => new Float32Array(gridCols));

  for (let gy = 2; gy < maxRow; gy++) {
    const py = Math.min(height - 1, Math.floor((gy + 0.5) * cellH));
    for (let gx = 4; gx < gridCols - 4; gx++) {
      const px = Math.min(width - 1, Math.floor((gx + 0.5) * cellW));
      const idx = (py * width + px) * 4;
      if (isSkinPixel(rgba[idx], rgba[idx + 1], rgba[idx + 2])) {
        skinGrid[gy][gx] = 1;
      }
    }
  }

  let bestScore = 0;
  let bestBox = null;

  const minWin = Math.max(4, Math.round(gridCols * 0.08));
  const maxWin = Math.round(gridCols * 0.42);

  for (let win = minWin; win <= maxWin; win += 2) {
    for (let gy = 2; gy + win < maxRow; gy++) {
      for (let gx = 4; gx + win < gridCols - 4; gx++) {
        let count = 0;
        for (let dy = 0; dy < win; dy++) {
          const row = skinGrid[gy + dy];
          for (let dx = 0; dx < win; dx++) {
            count += row[gx + dx];
          }
        }
        const area = win * win;
        const density = count / area;
        if (density < 0.35) continue;

        const centerXNorm = (gx + win / 2) / gridCols;
        const centerYNorm = (gy + win / 2) / gridRows;

        const distFromCenterX = Math.abs(centerXNorm - 0.5);
        const verticalWeight = centerYNorm >= 0.1 && centerYNorm <= 0.58 ? 1.25 : 0.75;
        const horizontalWeight = Math.max(0.4, 1.15 - distFromCenterX * 1.2);
        const sizeNorm = win / gridCols;
        const sizeWeight = sizeNorm >= 0.1 && sizeNorm <= 0.35 ? 1.2 : 0.9;

        const score = density * Math.sqrt(sizeNorm) * verticalWeight * horizontalWeight * sizeWeight;
        if (score > bestScore) {
          bestScore = score;
          bestBox = {
            cx: (gx + win / 2) * cellW,
            cy: (gy + win / 2) * cellH,
            size: win * Math.max(cellW, cellH),
          };
        }
      }
    }
  }

  return bestBox;
}

/**
 * Tự động phân tích ảnh và tính toán { zoom, pan: { x, y } }
 * để tập trung vào chủ thể (zoom vừa vặn gương mặt + vai trên vào chính giữa khung vinh danh)
 */
export async function autoDetectFaceAndCrop(imageSrc) {
  return new Promise((resolve) => {
    if (!imageSrc) {
      return resolve({ zoom: 1, pan: { x: 0, y: 0 } });
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      try {
        const naturalW = img.naturalWidth || img.width;
        const naturalH = img.naturalHeight || img.height;

        if (naturalW === 0 || naturalH === 0) {
          return resolve({ zoom: 1, pan: { x: 0, y: 0 } });
        }

        // Vẽ ảnh ra canvas phân tích (rộng 480px để phát hiện chuẩn cả ảnh chân dung gần lẫn ảnh toàn thân đứng xa)
        const targetW = 480;
        const targetH = Math.max(1, Math.round((naturalH / naturalW) * targetW));
        const scaleX = naturalW / targetW;
        const scaleY = naturalH / targetH;

        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const rgba = ctx.getImageData(0, 0, targetW, targetH).data;

        // Ưu tiên 1: Native Shape Detection API (nếu trình duyệt bật hỗ trợ)
        if (typeof window !== "undefined" && "FaceDetector" in window) {
          try {
            const detector = new window.FaceDetector({ fastMode: false, maxDetectedFaces: 5 });
            const faces = await detector.detect(img);
            if (faces && faces.length > 0) {
              const bestFace = [...faces].sort(
                (a, b) => b.boundingBox.width * b.boundingBox.height - a.boundingBox.width * a.boundingBox.height
              )[0];
              const box = bestFace.boundingBox;
              return resolve(
                calculateCropFromFace(
                  box.x + box.width / 2,
                  box.y + box.height / 2,
                  box.width,
                  box.height,
                  naturalW,
                  naturalH
                )
              );
            }
          } catch (e) {
            // Chuyển sang Pico.js
          }
        }

        // Ưu tiên 2: Pico.js (chính xác và chạy trên mọi trình duyệt)
        const classifier = await loadFaceDetector();
        if (classifier) {
          const pixels = rgbaToGrayscale(rgba, targetH, targetW);
          const imageObj = {
            pixels,
            nrows: targetH,
            ncols: targetW,
            ldim: targetW,
          };

          const params = {
            shiftfactor: 0.07,
            minsize: 22,
            maxsize: Math.min(targetW, targetH),
            scalefactor: 1.08,
          };

          let dets = pico.run_cascade(imageObj, classifier, params);
          dets = pico.cluster_detections(dets, 0.2);

          const scoredCandidates = [];
          for (const d of dets) {
            const [r, c, s, q] = d;
            if (q < 3.0) continue;
            // Loại bỏ các vùng quá sát mép trên/dưới hoặc quá sát rìa ngoài
            if (r < targetH * 0.08 || r > targetH * 0.78) continue;
            if (c < targetW * 0.12 || c > targetW * 0.88) continue;

            const skinRatio = computeSkinRatio(rgba, targetW, targetH, r, c, s);
            // Nếu điểm cascade < 15 thì bắt buộc phải có màu da thật để loại bỏ hoàn toàn cây cối, hoa văn
            if (q < 15.0 && skinRatio < 0.16) continue;

            const centerXBias = 1 - Math.abs(c / targetW - 0.5) * 0.5;
            const totalScore = q * (0.65 + skinRatio * 1.6) * centerXBias;
            scoredCandidates.push({ r, c, s, q, skinRatio, totalScore });
          }

          scoredCandidates.sort((a, b) => b.totalScore - a.totalScore);
          let best = scoredCandidates[0] || null;

          // Nếu chưa thấy mặt rõ (q < 15), thử quét nghiêng ±18 độ cho các ảnh học sinh nghiêng đầu
          if (!best || best.q < 15) {
            const rotLeft = detectOnRotatedCanvas(img, targetW, targetH, classifier, -18);
            const rotRight = detectOnRotatedCanvas(img, targetW, targetH, classifier, 18);
            for (const cand of [rotLeft, rotRight]) {
              if (cand && (!best || cand.score > best.totalScore)) {
                best = { ...cand, totalScore: cand.score };
              }
            }
          }

          if (best) {
            const faceCenterX = best.c * scaleX;
            const faceCenterY = best.r * scaleY;
            const faceSize = best.s * Math.max(scaleX, scaleY);

            return resolve(
              calculateCropFromFace(faceCenterX, faceCenterY, faceSize, faceSize, naturalW, naturalH)
            );
          }
        }

        // Ưu tiên 3: Dò cụm màu da vùng đầu chủ thể
        const skinCluster = detectFaceBySkinCluster(rgba, targetW, targetH);
        if (skinCluster) {
          const faceCenterX = skinCluster.cx * scaleX;
          const faceCenterY = skinCluster.cy * scaleY;
          const faceSize = skinCluster.size * Math.max(scaleX, scaleY);
          return resolve(
            calculateCropFromFace(faceCenterX, faceCenterY, faceSize, faceSize, naturalW, naturalH)
          );
        }

        // Fallback cuối: zoom nhẹ vào phần trên-giữa của bức ảnh chân dung
        const defaultFaceY = naturalH > naturalW ? naturalH * 0.30 : naturalH * 0.42;
        const defaultFaceSize = Math.min(naturalW, naturalH) * 0.34;
        return resolve(
          calculateCropFromFace(naturalW * 0.5, defaultFaceY, defaultFaceSize, defaultFaceSize, naturalW, naturalH)
        );
      } catch (err) {
        console.warn("Lỗi auto crop:", err);
        return resolve({ zoom: 1, pan: { x: 0, y: 0 } });
      }
    };

    img.onerror = () => {
      resolve({ zoom: 1, pan: { x: 0, y: 0 } });
    };

    img.src = imageSrc;
  });
}

/**
 * Tính toán zoom và pan trong hệ tọa độ chuẩn SVG 500x500 của SmartPhotoFrame:
 * - Trong SmartPhotoFrame, ảnh (imgW x imgH) ở mức zoom = 1 có cạnh ngắn nhất = 500 SVG units
 *   (tức baseScale = 500 / Math.min(imgW, imgH)).
 * - Khuôn mặt được zoom sao cho chiếm ~43% đường kính khung (~215 SVG units),
 *   giúp lấy trọn gương mặt + phần vai trên thật cân đối.
 * - Tâm khuôn mặt đặt tại X = 250 (chính giữa ngang), Y = 232 (hơi cao hơn tâm một chút để không cụt tóc).
 */
function calculateCropFromFace(faceX, faceY, faceW, faceH, imgW, imgH) {
  const baseScale = 500 / Math.min(imgW, imgH);

  // Kích thước khuôn mặt quy đổi sang đơn vị SVG ở mức zoom = 1
  const faceDimensionNatural = Math.max(faceW, faceH, Math.min(imgW, imgH) * 0.045);
  const faceSvgAtZoom1 = faceDimensionNatural * baseScale;

  // Kích thước khuôn mặt lý tưởng trong khung 500x500 (~210 SVG units)
  const desiredFaceSvgSize = 210;
  let zoom = desiredFaceSvgSize / faceSvgAtZoom1;

  // Hỗ trợ zoom từ 1.0x (ảnh chụp cận mặt) đến 5.0x (ảnh chụp toàn thân đứng xa trên sân khấu)
  zoom = Math.max(1.0, Math.min(5.0, zoom));

  // Tọa độ mục tiêu của tâm khuôn mặt trong khung SVG 500x500
  const targetXInFrame = 250;
  const targetYInFrame = 232;

  // Đảm bảo zoom đủ lớn để khi đặt mặt vào (targetXInFrame, targetYInFrame) không bị lộ mép ảnh vào khung
  const margin = 6;
  const safeLeft = Math.max(faceX, imgW * 0.06);
  const safeRight = Math.max(imgW - faceX, imgW * 0.06);
  const safeTop = Math.max(faceY, imgH * 0.06);
  const safeBottom = Math.max(imgH - faceY, imgH * 0.06);

  const minZoomLeft = (targetXInFrame - margin) / (safeLeft * baseScale);
  const minZoomRight = (500 - margin - targetXInFrame) / (safeRight * baseScale);
  const minZoomTop = (targetYInFrame - margin) / (safeTop * baseScale);
  const minZoomBottom = (500 - margin - targetYInFrame) / (safeBottom * baseScale);

  const minZoomForCoverage = Math.min(
    5.0,
    Math.max(1.0, minZoomLeft, minZoomRight, minZoomTop, minZoomBottom)
  );
  zoom = Math.max(zoom, minZoomForCoverage);
  zoom = +zoom.toFixed(2);

  // Kích thước ảnh trên SVG sau khi nhân zoom
  const renderW = imgW * baseScale * zoom;
  const renderH = imgH * baseScale * zoom;

  // Trong SmartPhotoFrame:
  // svgX = 250 + (faceX - imgW / 2) * baseScale * zoom + panX = targetXInFrame
  // svgY = 250 + (faceY - imgH / 2) * baseScale * zoom + panY = targetYInFrame
  let panX = Math.round(targetXInFrame - 250 - (faceX - imgW / 2) * baseScale * zoom);
  let panY = Math.round(targetYInFrame - 250 - (faceY - imgH / 2) * baseScale * zoom);

  // Kẹp panX, panY để 4 cạnh ảnh luôn phủ kín toàn bộ khung 500x500 (không bao giờ hở viền xám)
  const maxPanX = Math.max(0, Math.round(renderW / 2 - (250 - margin)));
  const maxPanY = Math.max(0, Math.round(renderH / 2 - (250 - margin)));

  panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
  panY = Math.max(-maxPanY, Math.min(maxPanY, panY));

  return {
    zoom,
    pan: { x: panX, y: panY },
  };
}
