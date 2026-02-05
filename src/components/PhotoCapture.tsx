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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(photo?.previewUrl ?? null);

  useEffect(() => {
    setPreviewUrl(photo?.previewUrl ?? null);
  }, [photo]);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <p className="text-xs font-medium text-slate-800">{label}</p>
        {description && <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>}
        <div className="mt-2 flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? 'Rehacer foto' : 'Tomar foto'}
          </Button>
          {previewUrl && (
            <Button type="button" size="sm" variant="ghost" onClick={handleRemove}>
              Quitar
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
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
    </div>
  );
};

