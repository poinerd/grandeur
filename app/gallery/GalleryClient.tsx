"use client";

import { useEffect, useState } from "react";

type Asset = {
type: "image" | "video";
src: string;
alt: string;
};

type GalleryClientProps = {
assets: Asset[];
};

export default function GalleryClient({ assets }: GalleryClientProps) {
const [activeIndex, setActiveIndex] = useState<number | null>(null);

const activeAsset =
activeIndex !== null ? assets[activeIndex] : null;

const closeViewer = () => {
setActiveIndex(null);
};

const showPrevious = () => {
setActiveIndex((current) =>
current === null
? null
: (current - 1 + assets.length) % assets.length
);
};

const showNext = () => {
setActiveIndex((current) =>
current === null
? null
: (current + 1) % assets.length
);
};

useEffect(() => {
if (activeIndex === null) return;

```
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") closeViewer();
  if (event.key === "ArrowLeft") showPrevious();
  if (event.key === "ArrowRight") showNext();
};

document.addEventListener("keydown", handleKeyDown);
document.body.style.overflow = "hidden";

return () => {
  document.removeEventListener("keydown", handleKeyDown);
  document.body.style.overflow = "";
};
```

}, [activeIndex]);

return ( <main className="min-h-screen bg-[#f5f4ef] text-[#41413d]">
{/* Header */} <header className="flex items-center justify-between px-5 py-6 sm:px-9"> <a
       href="/"
       className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full"
       aria-label="Back home"
     > <img
         src="/assets/me.png"
         alt="Emmanuel"
         className="h-full w-full object-cover"
       /> </a>

```
    <a
      href="/"
      className="text-sm text-[#555550] transition-colors hover:text-[#f15a24]"
    >
      ← Back home
    </a>
  </header>

  {/* Introduction */}
  <section className="px-5 pb-12 pt-10 sm:px-9">
    <h1
      className="text-5xl tracking-[-0.04em] sm:text-6xl"
      style={{ fontFamily: "Tiempos, Georgia, serif" }}
    >
      Gallery
    </h1>

    <p className="mt-3 text-sm text-[#77776f]">
       Project shots, illustrations, designs and stuff
    </p>
  </section>

  {/* Gallery */}
  <section className="flex flex-col gap-3 px-5 pb-20 sm:px-9">
    {assets.map((asset, index) => (
      <button
        key={asset.src}
        type="button"
        onClick={() => setActiveIndex(index)}
        aria-label={`Open ${asset.alt}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden bg-[#e9e8e1] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f15a24]"
      >
        {asset.type === "image" ? (
          <img
            src={asset.src}
            alt={asset.alt}
            loading="lazy"
            className="block h-auto w-full object-contain transition-opacity duration-300 group-hover:opacity-90"
          />
        ) : (
          <div className="relative">
            <video
              src={asset.src}
              muted
              playsInline
              preload="metadata"
              className="block h-auto max-h-[75vh] w-full object-contain"
            />

            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-xl text-[#41413d]">
                ▶
              </span>
            </span>
          </div>
        )}
      </button>
    ))}
  </section>

  {/* Fullscreen viewer */}
  {activeAsset && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171715] p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
      onClick={closeViewer}
    >
      {/* Close */}
      <button
        type="button"
        onClick={closeViewer}
        aria-label="Close viewer"
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full text-3xl text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        ×
      </button>

      {/* Previous */}
      {assets.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            showPrevious();
          }}
          aria-label="Previous asset"
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 px-3 py-5 text-3xl text-white/70 hover:text-white sm:left-5"
        >
          ‹
        </button>
      )}

      {/* Media */}
      <div
        className="flex h-full w-full items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        {activeAsset.type === "image" ? (
          <img
            key={activeAsset.src}
            src={activeAsset.src}
            alt={activeAsset.alt}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <video
            key={activeAsset.src}
            src={activeAsset.src}
            controls
            autoPlay
            playsInline
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>

      {/* Next */}
      {assets.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            showNext();
          }}
          aria-label="Next asset"
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 px-3 py-5 text-3xl text-white/70 hover:text-white sm:right-5"
        >
          ›
        </button>
      )}

      {/* Position */}
      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/60">
        {String(activeIndex! + 1).padStart(2, "0")} /{" "}
        {String(assets.length).padStart(2, "0")}
      </span>
    </div>
  )}

  {/* Empty gallery */}
  {assets.length === 0 && (
    <p className="px-5 pb-20 text-sm text-[#77776f] sm:px-9">
      Nothing here yet.
    </p>
  )}
</main>


);
}
