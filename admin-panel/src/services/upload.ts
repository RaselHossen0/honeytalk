/**
 * Image upload service for AWS S3.
 * Replace with actual presigned URL flow when backend is ready.
 *
 * Typical S3 flow:
 * 1. POST /api/upload/presign -> { uploadUrl, publicUrl }
 * 2. PUT file to uploadUrl (presigned S3 URL)
 * 3. Return publicUrl for storage in DB
 */

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export function isAcceptedImageType(type: string, acceptAllImages = false): boolean {
  if (acceptAllImages && type.startsWith('image/')) return true;
  return ACCEPTED_TYPES.includes(type);
}

export async function uploadImageToS3(file: File): Promise<string> {
  // TODO: Implement real S3 upload via presigned URL
  await new Promise((r) => setTimeout(r, 500)); // Simulate network
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const ACCEPTED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/mp4'];

export function isAcceptedAudioType(type: string): boolean {
  return ACCEPTED_AUDIO_TYPES.includes(type) || type.startsWith('audio/');
}

export async function uploadAudioToS3(file: File): Promise<string> {
  // TODO: Implement real S3 upload for audio (presigned URL)
  await new Promise((r) => setTimeout(r, 500)); // Simulate network
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
