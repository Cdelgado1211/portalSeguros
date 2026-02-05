// Stub para futura compresión de imágenes.
// Aquí se podría integrar una librería ligera (p.ej. browser-image-compression).
// Por ahora, solo devolvemos el mismo archivo.

export const compressImageIfNeeded = async (file: File): Promise<File> => {
  return file;
};

