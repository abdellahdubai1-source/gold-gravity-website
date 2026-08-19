import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

async function listMedia() {
  const supabase = createClient();
  const folders = ["library", "products", "products/gallery"];
  const files: { name: string; url: string }[] = [];
  for (const folder of folders) {
    const { data } = await supabase.storage.from("media").list(folder, {
      limit: 60,
      sortBy: { column: "created_at", order: "desc" },
    });
    for (const item of data ?? []) {
      if (!item.name || item.name.startsWith(".")) continue;
      const path = `${folder}/${item.name}`;
      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      files.push({ name: item.name, url: pub.publicUrl });
    }
  }
  return files;
}

export default async function AdminMediaPage() {
  let files: { name: string; url: string }[] = [];
  try {
    files = await listMedia();
  } catch {
    files = [];
  }

  return (
    <div>
      <AdminPageHeader
        title="Media"
        description="Images uploaded from the Products, Brands and Categories editors appear here."
        action={<MediaUploader />}
      />

      {files.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <ImageIcon className="h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No uploaded media yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {files.map((f) => (
            <a
              key={f.url}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <Image src={f.url} alt={f.name} fill sizes="200px" className="object-contain p-2" />
              <div className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {f.name}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
