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
 * Tự động phân tích ảnh và tính toán { zoom, pan: { x, y } }
 * để khuôn mặt luôn nằm ở vị trí chuẩn của khung vinh danh (trung tâm, mắt ở khoảng 38-42% chiều cao)
 * 
 * Khung chuẩn SVG có tọa độ tâm là (250, 250), kích thước 500x500
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

        // Ưu tiên 1: Thử dùng Native Shape Detection API (Chrome / Edge hiện đại cực nhanh)
        if (typeof window !== "undefined" && "FaceDetector" in window) {
          try {
            const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
            const faces = await detector.detect(img);
            if (faces && faces.length > 0) {
              const box = faces[0].boundingBox;
              const result = calculateCropFromFace(
                box.x + box.width / 2,
                box.y + box.height / 2,
                box.width,
                box.height,
                naturalW,
                naturalH
              );
              return resolve(result);
            }
          } catch (e) {
            // Fallback sang pico
          }
        }

        // Ưu tiên 2: Sử dụng Pico.js (siêu nhẹ 2KB, cực nhạy)
        const classifier = await loadFaceDetector();
        if (classifier) {
          // Scale ảnh xuống độ phân giải ~360-480px để phát hiện tức thì (< 20ms)
          const targetW = 380;
          const targetH = Math.round((naturalH / naturalW) * targetW);

          const canvas = document.createElement("canvas");
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          ctx.drawImage(img, 0, 0, targetW, targetH);

          const rgba = ctx.getImageData(0, 0, targetW, targetH).data;
          const pixels = pico.rgba_to_grayscale(rgba, targetH, targetW);

          const imageObj = {
            pixels: pixels,
            rows: targetH,
            cols: targetW,
            stride: targetW,
          };

          const params = {
            shiftfactor: 0.1,
            minsize: 30,
            maxsize: Math.min(targetW, targetH),
            scalefactor: 1.1,
          };

          let dets = pico.run_object_detection(imageObj, classifier, params);
          dets = pico.cluster_detections(dets, 0.2);

          // Lọc các detection có độ tin cậy > 4.0
          const validFaces = dets.filter((d) => d[3] > 4.0);

          if (validFaces.length > 0) {
            // Chọn khuôn mặt có điểm cao nhất hoặc lớn nhất
            validFaces.sort((a, b) => b[3] - a[3]);
            const best = validFaces[0];
            const [scaledR, scaledC, scaledS] = best; // r = row (y), c = col (x), s = size

            // Chuyển tọa độ về ảnh gốc ban đầu
            const scaleX = naturalW / targetW;
            const scaleY = naturalH / targetH;
            const faceCenterX = scaledC * scaleX;
            const faceCenterY = scaledR * scaleY;
            const faceSize = scaledS * Math.max(scaleX, scaleY);

            const result = calculateCropFromFace(
              faceCenterX,
              faceCenterY,
              faceSize,
              faceSize,
              naturalW,
              naturalH
            );
            return resolve(result);
          }
        }

        // Fallback mặc định: nếu không phát hiện được mặt (hoặc ảnh placeholder),
        // căn giữa theo tỉ lệ chuẩn ảnh chân dung (khuôn mặt thường ở 40% phía trên)
        return resolve({
          zoom: 1,
          pan: { x: 0, y: naturalH > naturalW ? Math.round((naturalH - naturalW) * 0.15) : 0 },
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
 * Tính toán zoom và pan để đưa khuôn mặt vào vị trí vàng của khung ảnh:
 * - Khung ảnh SVG: kích thước 500x500 (tọa độ tâm 250, 250)
 * - Tỷ lệ khuôn mặt chiếm khoảng 45% - 50% kích thước khung
 * - Trọng tâm mắt/mũi đặt ở ~45% chiều cao khung (cao hơn tâm hình học 1 chút để không bị cụt đầu)
 */
function calculateCropFromFace(faceX, faceY, faceW, faceH, imgW, imgH) {
  // Đường kính khung nhìn mục tiêu
  const targetFrameSize = 500;
  const desiredFaceRatioInFrame = 0.50; // Khuôn mặt chiếm ~50% khung tròn
  const desiredFacePixelSize = targetFrameSize * desiredFaceRatioInFrame;

  // Tỉ lệ scale ảnh
  const faceDimension = Math.max(faceW, faceH, 60);
  let zoom = desiredFacePixelSize / faceDimension;

  // Giới hạn zoom an toàn (không thu nhỏ quá mức để không lộ nền đen)
  const minZoomFit = Math.max(targetFrameSize / imgW, targetFrameSize / imgH);
  zoom = Math.max(minZoomFit * 0.95, Math.min(2.5, zoom));
  zoom = +zoom.toFixed(2);

  // Kích thước ảnh sau khi zoom
  const currentRenderW = imgW * zoom;
  const currentRenderH = imgH * zoom;

  // Tọa độ mục tiêu trong khung SVG (500x500):
  // X = 250 (trung tâm)
  // Y = 230 (hơi cao hơn giữa một chút để trán và tóc không bị cắt)
  const targetXInFrame = 250;
  const targetYInFrame = 232;

  // Tọa độ của tâm mặt trên ảnh sau khi scale
  const scaledFaceX = faceX * zoom;
  const scaledFaceY = faceY * zoom;

  // Tính panX, panY (SVG ảnh được đặt tại imgX = 250 - imgW/2 + panX)
  // Do đó: targetXInFrame = imgX + scaledFaceX
  // <=> targetXInFrame = 250 - currentRenderW / 2 + panX + scaledFaceX
  // <=> panX = targetXInFrame - 250 + currentRenderW / 2 - scaledFaceX
  let panX = Math.round(targetXInFrame - 250 + currentRenderW / 2 - scaledFaceX);
  let panY = Math.round(targetYInFrame - 250 + currentRenderH / 2 - scaledFaceY);

  // Giới hạn độ dịch chuyển không bay ra khỏi khung
  const maxPanX = Math.round(Math.abs(currentRenderW - targetFrameSize) / 2 + 100);
  const maxPanY = Math.round(Math.abs(currentRenderH - targetFrameSize) / 2 + 100);

  panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
  panY = Math.max(-maxPanY, Math.min(maxPanY, panY));

  return {
    zoom,
    pan: { x: panX, y: panY },
  };
}
