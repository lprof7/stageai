import imagekit from '../config/imagekit';

export async function uploadFile(
  buffer: Buffer,
  fileName: string,
  folder: string
): Promise<{ url: string; fileId: string }> {
  const response = await imagekit.upload({
    file: buffer,
    fileName,
    folder,
    useUniqueFileName: true,
  });
  return { url: response.url, fileId: response.fileId };
}

export async function deleteFile(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId);
  } catch (err) {
    console.error('[uploadService] deleteFile error:', err);
  }
}
