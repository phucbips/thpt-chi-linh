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
 * theo BỐ CỤC TỈ LỆ VÀNG BÁN THÂN (0.382 : 0.618):
 * - Không zoom cận mặt đối với ảnh đã chụp gần (giữ nguyên zoom = 1.0 để thấy cổ áo, vai, tay cầm huy hiệu).
 * - Với ảnh chụp bán thân/toàn thân có phần thân vai, lấy trọn cả Gương mặt (ở đường tỉ lệ vàng ~38% phía trên)
 *   + Phần cổ áo, cầu vai, phù hiệu (chiếm ~62% phía dưới khung).
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

        // Ưu tiên 1: Native Shape Detection API (nếu trình duyệt hỗ trợ)
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

        // Ưu tiên 2: Pico.js
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
            if (r < targetH * 0.08 || r > targetH * 0.78) continue;
            if (c < targetW * 0.12 || c > targetW * 0.88) continue;

            const skinRatio = computeSkinRatio(rgba, targetW, targetH, r, c, s);
            if (q < 15.0 && skinRatio < 0.16) continue;

            const centerXBias = 1 - Math.abs(c / targetW - 0.5) * 0.5;
            const totalScore = q * (0.65 + skinRatio * 1.6) * centerXBias;
            scoredCandidates.push({ r, c, s, q, skinRatio, totalScore });
          }

          scoredCandidates.sort((a, b) => b.totalScore - a.totalScore);
          let best = scoredCandidates[0] || null;

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

        // Fallback cuối: giữ nguyên mức phóng 1.0x và lấy vùng tỉ lệ vàng phía trên
        return resolve({
          zoom: 1,
          pan: { x: 0, y: naturalH > naturalW ? Math.round((naturalH / naturalW - 1) * 45) : 0 },
        });
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
 * BỐ CỤC TỈ LỆ VÀNG CHÂN DUNG BÁN THÂN (0.382 : 0.618) TRONG KHUNG 500x500:
 * 1. Không bao giờ zoom quá cận mặt:
 *    - Kích thước khuôn mặt mục tiêu chỉ chiếm ~27% khung (135 SVG units) để nhường không gian
 *      cho mái tóc, cổ áo, hai vai, phù hiệu trường và dáng tay tự nhiên.
 *    - Nếu ảnh gốc đã là ảnh chụp cận/selfie (khuôn mặt >= 135 SVG units ở zoom 1x như Nguyễn Thanh Phúc,
 *      Nguyễn Phan Tuấn Hùng), giữ nguyên zoom = 1.0x (tuyệt đối không phóng to thêm).
 * 2. Đặt vị trí khuôn mặt theo Đường Tỉ Lệ Vàng (0.382 ~ Y = 190..205):
 *    - Nếu phía dưới khuôn mặt có phần thân/vai đầy đặn, đặt tâm mặt ở Y ≈ 190 (38% từ đỉnh khung)
 *      để phần thân vai chiếm trọn 62% bên dưới theo đúng tỉ lệ vàng.
 *    - Nếu là ảnh selfie cận mặt, đặt tâm mặt ở Y ≈ 215 để cân đối cả tóc lẫn cổ áo.
 */
function calculateCropFromFace(faceX, faceY, faceW, faceH, imgW, imgH) {
  const baseScale = 500 / Math.min(imgW, imgH);

  // Kích thước khuôn mặt ở mức zoom = 1.0 trong hệ tọa độ SVG 500x500
  const faceDimensionNatural = Math.max(faceW, faceH, Math.min(imgW, imgH) * 0.045);
  const faceSvgAtZoom1 = faceDimensionNatural * baseScale;

  // Tỉ lệ vàng bán thân: gương mặt chỉ chiếm ~135 SVG units (~27% khung 500px),
  // giúp tổng thể (Đầu + Vai + Ngực trên = ~3.2x mặt) vừa khít khung vinh danh.
  const desiredFaceSvgSize = 135;

  // Nếu ảnh đã đủ gần (faceSvgAtZoom1 >= 135), giữ nguyên zoom = 1.0 để không bị cận mặt
  let zoom = faceSvgAtZoom1 >= desiredFaceSvgSize ? 1.0 : desiredFaceSvgSize / faceSvgAtZoom1;

  // Giới hạn zoom tối đa 3.8x cho các ảnh chụp toàn thân từ rất xa
  zoom = Math.max(1.0, Math.min(3.8, zoom));

  // Kiểm tra khoảng thân/vai thực tế bên dưới khuôn mặt trong ảnh gốc
  const bodyBelowRatio = (imgH - faceY) / faceDimensionNatural;

  // Nếu ảnh có nhiều phần thân/vai bên dưới (bodyBelowRatio >= 1.6) và mặt sau zoom vừa phải,
  // đặt tâm mặt tại đường tỉ lệ vàng phía trên (Y = 190, tức 38% khung) để lấy trọn vai & áo.
  // Nếu ảnh chụp cận mặt (faceSvgAtZoom1 lớn), hạ tâm mặt xuống Y = 212..222 để không thừa đỉnh đầu.
  const faceSvgRendered = faceSvgAtZoom1 * zoom;
  let targetYInFrame = 192;
  if (faceSvgRendered > 155) {
    targetYInFrame = Math.min(222, Math.round(192 + (faceSvgRendered - 155) * 0.25));
  } else if (bodyBelowRatio < 1.35) {
    targetYInFrame = 215;
  }

  const targetXInFrame = 250;

  // Chỉ tăng nhẹ zoom nếu khuôn mặt nằm quá sát mép trái/phải của ảnh ngang
  // (không ép tăng zoom theo mép trên vì mặt ở 30-38% phía trên vốn đã đúng tỉ lệ vàng)
  const safeLeft = Math.max(faceX, imgW * 0.08);
  const safeRight = Math.max(imgW - faceX, imgW * 0.08);
  const minZoomLeft = 195 / (safeLeft * baseScale);
  const minZoomRight = 195 / (safeRight * baseScale);

  zoom = Math.max(zoom, Math.min(3.8, Math.max(1.0, minZoomLeft, minZoomRight)));
  zoom = +zoom.toFixed(2);

  // Kích thước ảnh trên SVG sau khi nhân zoom
  const renderW = imgW * baseScale * zoom;
  const renderH = imgH * baseScale * zoom;

  // Đưa tâm mặt về (targetXInFrame, targetYInFrame)
  let panX = Math.round(targetXInFrame - 250 - (faceX - imgW / 2) * baseScale * zoom);
  let panY = Math.round(targetYInFrame - 250 - (faceY - imgH / 2) * baseScale * zoom);

  // Kẹp panX, panY để 4 cạnh ảnh luôn phủ kín toàn bộ khung 500x500 (không bao giờ hở viền xám)
  const margin = 4;
  const maxPanX = Math.max(0, Math.round(renderW / 2 - (250 - margin)));
  const maxPanY = Math.max(0, Math.round(renderH / 2 - (250 - margin)));

  panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
  panY = Math.max(-maxPanY, Math.min(maxPanY, panY));

  return {
    zoom,
    pan: { x: panX, y: panY },
  };
}
