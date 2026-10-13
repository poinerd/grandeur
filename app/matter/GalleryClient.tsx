"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import ProjectViewer, { type Asset } from "./ProjectViewer";

// Re-exported so existing imports of Asset from "./GalleryClient" keep working
export type { Asset };

type GalleryClientProps = {
  assets: Asset[];
};

const spring = { type: "spring", stiffness: 260, damping: 32 } as const;

export default function GalleryClient({ assets }: GalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closeViewer = useCallback(() => {
    setActiveIndex(null);
    triggerRef.current?.focus();
  }, []);

  return (
    <div className="text-[#41413d]">
      {/* Masonry grid: columns let every piece keep its natural proportions */}

      <section className="columns-1 gap-3 px-5 pb-20 sm:columns-2 sm:px-9 lg:columns-3">
        {assets.map((asset, index) => (
          <GridItem
            key={asset.src}
            asset={asset}
            index={index}
            isActive={activeIndex === index}
            onOpen={(el) => {
              triggerRef.current = el;
              setActiveIndex(index);
            }}
          />
        ))}
      </section>

      {assets.length === 0 && (
        <p className="px-5 pb-20 text-sm text-[#77776f] sm:px-9">
          Nothing here yet.
        </p>
      )}

      {/* Fullscreen viewer (shared with the board) */}
      <ProjectViewer
        assets={assets}
        index={activeIndex}
        onClose={closeViewer}
        onIndexChange={setActiveIndex}
        layoutIdFor={(asset) => `asset-${asset.src}`}
      />
    </div>
  );
}

/* ---------- Grid tile ---------- */

type GridItemProps = {
  asset: Asset;
  index: number;
  isActive: boolean;
  onOpen: (el: HTMLButtonElement) => void;
};

function GridItem({ asset, isActive, onOpen }: GridItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Videos preview silently on hover instead of showing a static play icon
  const play = () => videoRef.current?.play().catch(() => {});
  const pause = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      onMouseEnter={asset.type === "video" ? play : undefined}
      onMouseLeave={asset.type === "video" ? pause : undefined}
      aria-label={`Open ${asset.title}`}
      className="group relative mb-3 block w-full cursor-zoom-in break-inside-avoid text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f15a24]"
    >
      <motion.div
        layoutId={`asset-${asset.src}`}
        transition={spring}
        className="relative overflow-hidden rounded-[2px] bg-[#e9e8e1]"
        // hide the original while its twin is fullscreen
        style={{ opacity: isActive ? 0 : 1 }}
      >
        {asset.type === "image" ? (
          <img
            src={asset.src}
            alt={asset.alt}
            loading="lazy"
            className="block h-auto w-full"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={asset.src}
              poster={asset.poster}
              muted
              loop
              playsInline
              preload="metadata"
              className="block h-auto w-full"
            />
            <span className="pointer-events-none absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[10px] text-[#41413d] transition-opacity duration-200 group-hover:opacity-0">
              ▶
            </span>
          </>
        )}

        {/* Title reveals on hover, tied to the pointer's action */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-10 text-sm text-white transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
          {asset.title}
        </span>
      </motion.div>
    </button>
  );
}