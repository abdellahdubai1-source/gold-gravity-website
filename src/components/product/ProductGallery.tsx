"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  productName,
}: {
  images: { url: string; alt: string }[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-beige shadow-card">
        {current ? (
          <Image
            src={current.url}
            alt={current.alt}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-contain p-8 sm:p-12"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-charcoal/30">{productName}</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-beige transition-colors",
                active === i ? "border-champagne" : "border-transparent hover:border-charcoal/15"
              )}
            >
              <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
