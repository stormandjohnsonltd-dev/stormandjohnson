"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { isServiceUnavailable } from "@/lib/readApiError";

export type ImageUploaderHandle = {
  /** Upload staged local files; returns final URL list (existing + new). */
  uploadPending: () => Promise<string[]>;
  hasPending: () => boolean;
};

type ImageUploaderProps = {
  images: string[];
  onChange: (images: string[]) => void;
};

type StagedFile = {
  id: string;
  file: File;
  preview: string;
};

async function uploadViaServer(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: form,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (isServiceUnavailable(res)) throw new Error("Upload cancelled.");
    throw new Error(typeof data?.error === "string" ? data.error : "Image upload failed.");
  }

  if (!data?.url) throw new Error("Upload succeeded but no image URL was returned.");
  return data.url as string;
}

export const ImageUploader = forwardRef<ImageUploaderHandle, ImageUploaderProps>(
  function ImageUploader({ images, onChange }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [staged, setStaged] = useState<StagedFile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
      return () => {
        staged.forEach((item) => URL.revokeObjectURL(item.preview));
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      hasPending: () => staged.length > 0,
      async uploadPending() {
        setError(null);
        if (!staged.length) return images;

        setUploading(true);
        try {
          const uploaded: string[] = [];
          for (const item of staged) {
            const url = await uploadViaServer(item.file);
            uploaded.push(url);
          }

          staged.forEach((item) => URL.revokeObjectURL(item.preview));
          setStaged([]);

          const next = [...images, ...uploaded];
          onChange(next);
          return next;
        } catch (err) {
          if (err instanceof Error && err.message === "Upload cancelled.") return images;
          const msg = err instanceof Error ? err.message : "Image upload failed.";
          setError(msg);
          throw new Error(msg);
        } finally {
          setUploading(false);
        }
      },
    }));

    function onPick(files: FileList | null) {
      if (!files?.length) return;
      setError(null);

      const next: StagedFile[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        next.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          preview: URL.createObjectURL(file),
        });
      }

      if (next.length) setStaged((prev) => [...prev, ...next]);
      if (inputRef.current) inputRef.current.value = "";
    }

    function removeExisting(index: number) {
      onChange(images.filter((_, i) => i !== index));
    }

    function removeStaged(id: string) {
      setStaged((prev) => {
        const target = prev.find((p) => p.id === id);
        if (target) URL.revokeObjectURL(target.preview);
        return prev.filter((p) => p.id !== id);
      });
    }

    return (
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-[13px] font-semibold transition hover:bg-black/[0.03] disabled:opacity-60"
          >
            Select images
          </button>
          <span className="text-[12px] text-black/50">
            Images upload
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onPick(e.target.files)}
          />
        </div>

        {error ? <p className="mt-2 text-[12px] font-semibold text-red-700">{error}</p> : null}

        {images.length > 0 || staged.length > 0 ? (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((src, index) => (
              <div
                key={`saved-${src}-${index}`}
                className="relative overflow-hidden rounded-xl border border-black/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-20 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExisting(index)}
                  className="absolute right-1 top-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white"
                >
                  Remove
                </button>
              </div>
            ))}
            {staged.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-xl border border-dashed border-[var(--brand)]/50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.preview} alt="" className="h-20 w-full object-cover" />
                <div className="absolute left-1 top-1 rounded-md bg-[var(--brand)] px-1.5 py-0.5 text-[10px] font-semibold text-[#0b1020]">
                  Pending
                </div>
                <button
                  type="button"
                  onClick={() => removeStaged(item.id)}
                  className="absolute right-1 top-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);
