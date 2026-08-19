"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface GalleryImage {
  image_url: string;
  alt_text_en?: string;
  alt_text_ar?: string;
}

/** Multi-image gallery uploader with reordering (drag handle via
 * up/down buttons — kept simple and reliable rather than a full DnD
 * library, since the admin's #1 requirement is simplicity). */
export function GalleryUploadField({
  label,
  images,
  onChange,
}: {
  label: string;
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const uploaded: GalleryImage[] = [];
      for (const file of Array.from(files)) {
        const path = `products/gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
        const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
        if (error) {
          console.error(error);
          continue;
        }
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        uploaded.push({ image_url: data.publicUrl });
      }
      onChange([...images, ...uploaded]);
    } finally {
      setUploading(false);
    }
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...images];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={img.image_url + i} className="relative flex h-24 w-24 flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <Image src={img.image_url} alt="" fill sizes="96px" className="object-contain p-1.5" />
            <div className="absolute -top-2 -end-2 flex gap-1">
              <button type="button" onClick={() => remove(i)} className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow">
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="absolute bottom-1 flex gap-1 rounded-full bg-white/90 px-1.5 py-0.5 shadow">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-[10px] text-slate-500 disabled:opacity-30">
                ↑
              </button>
              <GripVertical className="h-3 w-3 text-slate-300" />
              <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="text-[10px] text-slate-500 disabled:opacity-30">
                ↓
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 text-slate-400 hover:border-champagne hover:text-champagne-dark transition-colors"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
          <span className="text-[10px] font-medium">Add</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
