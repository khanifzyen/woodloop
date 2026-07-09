/**
 * Camera Abstraction Layer
 *
 * Priority: Capacitor Camera → Web fallback (<input type="file">)
 * Digunakan oleh: Generator (foto limbah), Supplier (foto kayu),
 *                 Aggregator (foto pickup), Profile (upload avatar)
 */

// ===================================================================
// Types
// ===================================================================
export interface PhotoResult {
  /** Base64 data URL atau blob URL */
  dataUrl: string;
  /** Nama file original */
  name: string;
  /** Ukuran file dalam bytes */
  size: number;
  /** Tipe MIME */
  mimeType: string;
  /** File object untuk FormData upload */
  file?: File;
}

export interface CameraOptions {
  quality?: number; // 0–100
  maxWidth?: number;
  maxHeight?: number;
  allowGallery?: boolean;
}

// ===================================================================
// Helpers
// ===================================================================
function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(",");
  const mimeType = header.match(/:(.*?);/)![1];
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new File([array], filename, { type: mimeType });
}

function resizeImage(
  dataUrl: string,
  maxWidth: number,
  maxHeight: number,
  quality: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality / 100));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// ===================================================================
// Capacitor Camera (Native)
// ===================================================================
async function takePhotoNative(options: CameraOptions): Promise<PhotoResult> {
  const { Camera, CameraResultType, CameraSource } = await import(
    "@capacitor/camera"
  );

  const photo = await Camera.getPhoto({
    resultType: CameraResultType.DataUrl,
    source: options.allowGallery ? CameraSource.Prompt : CameraSource.Camera,
    quality: options.quality ?? 80,
    width: options.maxWidth ?? 1920,
    height: options.maxHeight ?? 1920,
    correctOrientation: true,
  });

  const dataUrl = photo.dataUrl!;
  const filename = `photo_${Date.now()}.jpg`;

  return {
    dataUrl,
    name: filename,
    size: Math.round((dataUrl.length * 3) / 4),
    mimeType: "image/jpeg",
    file: dataUrlToFile(dataUrl, filename),
  };
}

// ===================================================================
// Web Fallback
// ===================================================================
async function capturePhotoWeb(options: CameraOptions): Promise<PhotoResult> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    if (options.allowGallery === false) {
      input.setAttribute("capture", "environment");
    }

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        reject(new Error("No file selected"));
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        let dataUrl = reader.result as string;

        if (options.maxWidth || options.maxHeight) {
          dataUrl = await resizeImage(
            dataUrl,
            options.maxWidth ?? 1920,
            options.maxHeight ?? 1920,
            options.quality ?? 90,
          );
        }

        const resizedFile = dataUrlToFile(dataUrl, file.name);
        resolve({
          dataUrl,
          name: file.name,
          size: resizedFile.size,
          mimeType: file.type,
          file: resizedFile,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    };

    input.onerror = () => reject(new Error("Failed to open camera/gallery"));
    input.click();
  });
}

// ===================================================================
// Platform Detection
// ===================================================================
/**
 * Deteksi apakah berjalan di Capacitor native wrapper.
 */
function isCapacitorNative(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__CAPACITOR__ !== undefined
    );
  } catch {
    return false;
  }
}

// ===================================================================
// Main API
// ===================================================================
/**
 * Ambil foto — otomatis pilih Capacitor native atau web fallback.
 */
export async function takePhoto(
  options: CameraOptions = {},
): Promise<PhotoResult> {
  if (isCapacitorNative()) {
    return takePhotoNative(options);
  }
  return capturePhotoWeb(options);
}

/**
 * Ambil foto dari gallery saja (skip kamera).
 */
export async function pickFromGallery(
  options: CameraOptions = {},
): Promise<PhotoResult> {
  return capturePhotoWeb({ ...options, allowGallery: true });
}

/**
 * Konversi PhotoResult ke FormData entry untuk PocketBase upload.
 */
export function photoToFormData(
  photo: PhotoResult,
  fieldName: string = "photos",
): FormData {
  const formData = new FormData();
  if (photo.file) {
    formData.append(fieldName, photo.file, photo.name);
  }
  return formData;
}