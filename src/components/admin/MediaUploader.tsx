'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, GripVertical, Loader2, ImageIcon } from 'lucide-react';

interface Props {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set(['image/webp', 'image/png', 'image/jpeg']);

export default function MediaUploader({
  images,
  onImagesChange,
  maxImages = 20,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- Upload ---------- */

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];

      // Client-side validation
      if (!ALLOWED_TYPES.has(file.type)) {
        alert('Invalid file type. Allowed: webp, png, jpeg.');
        return;
      }
      if (file.size > MAX_SIZE) {
        alert('File too large. Maximum size is 5 MB.');
        return;
      }
      if (images.length >= maxImages) {
        alert(`Maximum ${maxImages} images allowed.`);
        return;
      }

      setUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || 'Upload failed.');
          return;
        }

        onImagesChange([...images, data.url]);
      } catch {
        alert('Upload failed. Please try again.');
      } finally {
        setUploading(false);
        // Reset file input so same file can be re-selected
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [images, maxImages, onImagesChange],
  );

  /* ---------- Delete ---------- */

  const handleDelete = useCallback(
    (index: number) => {
      if (!window.confirm('Remove this image?')) return;
      const next = images.filter((_, i) => i !== index);
      onImagesChange(next);
    },
    [images, onImagesChange],
  );

  /* ---------- Drag & Drop Reorder ---------- */

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverIndex(index);
    },
    [],
  );

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault();
      const fromIndex = Number(e.dataTransfer.getData('text/plain'));
      setDragOverIndex(null);
      setDraggedIndex(null);

      if (fromIndex === dropIndex) return;

      const reordered = [...images];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(dropIndex, 0, moved);
      onImagesChange(reordered);
    },
    [images, onImagesChange],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  /* ---------- Drop zone file drop ---------- */

  const handleDropZoneDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      // Only handle file drops, not reorder drops
      if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect],
  );

  const handleDropZoneDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    },
    [],
  );

  /* ---------- Render ---------- */

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {/* Existing images */}
        {images.map((url, index) => (
          <div
            key={url}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`group relative aspect-square overflow-hidden rounded-xl border transition-all ${
              dragOverIndex === index
                ? 'border-lime-400 bg-lime-400/5'
                : 'border-[#333] bg-[#0a0a0a]'
            } ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Image ${index + 1}`}
              className="h-full w-full object-cover"
            />

            {/* Overlay buttons */}
            <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-2 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
              <button
                type="button"
                className="cursor-grab rounded-md bg-black/60 p-1.5 text-gray-300 transition-colors hover:text-white active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="rounded-md bg-black/60 p-1.5 text-gray-300 transition-colors hover:bg-red-500/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Index badge */}
            <div className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-medium text-gray-300">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Upload slot / drop zone */}
        {images.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDropZoneDrop}
            onDragOver={handleDropZoneDragOver}
            className="relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#333] bg-[#0a0a0a] transition-colors hover:border-lime-400/50 hover:bg-[#111]"
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111] text-gray-500">
                  <Upload className="h-5 w-5" />
                </div>
                <span className="text-center text-xs text-gray-500">
                  Click or drag
                  <br />
                  to upload
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/webp,image/png,image/jpeg"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Info text */}
      {images.length === 0 && !uploading && (
        <div className="flex items-center gap-2 rounded-lg border border-[#222] bg-[#0a0a0a] px-4 py-3">
          <ImageIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">
            No images yet. Upload WebP, PNG, or JPEG files (max 5 MB each).
          </span>
        </div>
      )}
    </div>
  );
}
