import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from './Button';

export interface CapturedPhoto {
  file: File;
  previewUrl: string;
}

interface PhotoCaptureProps {
  label: string;
  description?: string;
  photo: CapturedPhoto | null;
  onChange: (photo: CapturedPhoto | null) => void;
}

export const PhotoCapture = ({ label, description, photo, onChange }: PhotoCaptureProps) => {
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(photo?.previewUrl ?? null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUrl(photo?.previewUrl ?? null);
  }, [photo]);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (videoRef.current as any).srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const captured: CapturedPhoto = { file, previewUrl: url };
    setPreviewUrl(url);
    onChange(captured);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onChange(null);
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const closeCamera = () => {
    stopStream();
    setIsCameraOpen(false);
  };

  const openCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Tu navegador no permite usar la cámara desde aquí.');
      setIsCameraOpen(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (error) {
      console.error(error);
      setCameraError('No se pudo acceder a la cámara. Revisa permisos del navegador.');
      setIsCameraOpen(true);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const url = URL.createObjectURL(file);
        const captured: CapturedPhoto = { file, previewUrl: url };
        setPreviewUrl(url);
        onChange(captured);
        closeCamera();
      },
      'image/jpeg',
      0.9
    );
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <p className="text-xs font-medium text-slate-800">{label}</p>
        {description && <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => void openCamera()}
          >
            {previewUrl ? 'Rehacer (cámara)' : 'Tomar foto ahora'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => galleryInputRef.current?.click()}
          >
            Elegir desde galería
          </Button>
          {previewUrl && (
            <Button type="button" size="sm" variant="ghost" onClick={handleRemove}>
              Quitar
            </Button>
          )}
        </div>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label={label}
          onChange={handleFileChange}
        />
      </div>
      <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-dashed border-border bg-slate-100">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
            Sin foto
          </div>
        )}
      </div>
      {isCameraOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl border border-border bg-surface-alt p-3 text-xs text-slate-700 shadow-card">
            <p className="mb-2 font-semibold">Capturar con cámara</p>
            {cameraError ? (
              <p className="mb-3 text-[11px] text-danger">{cameraError}</p>
            ) : (
              <div className="mb-3 overflow-hidden rounded-xl bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="h-56 w-full object-contain"
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" type="button" onClick={closeCamera}>
                Cerrar
              </Button>
              {!cameraError && (
                <Button size="sm" type="button" onClick={capturePhoto}>
                  Tomar foto
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
