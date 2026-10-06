"use client";
import Header from "../components/Header"

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type Asset = {
  type: "image" | "video";
  src: string;
  alt: string;
  title: string;
  description: string;
  poster?: string; 
};

type GalleryClientProps = {
  assets: Asset[];
};

const spring = { type: "spring", stiffness: 260, damping: 32 } as const;

export default function GalleryClient({ assets }: GalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const activeAsset = activeIndex !== null ? assets[activeIndex] : null;

  const closeViewer = useCallback(() => {
    setActiveIndex(null);
    triggerRef.current?.focus();
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + assets.length) % assets.length
    );
  }, [assets.length]);

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % assets.length));
  }, [assets.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowLeft") showPrevious();
      if (e.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";

    };
  }, [activeIndex, closeViewer, showPrevious, showNext]);

  return (
    <main className="min-h-screen bg-[#f5f4ef] text-[#41413d]">
      {/* Header */}
      <Header/>

      {/* Introduction */}
      <section className="px-5 pb-12 pt-10 sm:px-9">
        <h1
          className="text-4xl tracking-[-0.04em] sm:text-6xl"
          // style={{ fontFamily: "Tiempos, Georgia, serif" }}
        >
          Gallery
        </h1>
        <p className="mt-3 text-sm text-[#77776f]">
          Project shots, illustrations, designs and stuff
        </p>
      </section>

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

      {/* Fullscreen viewer */}
      <AnimatePresence>
        {activeAsset && activeIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={activeAsset.title}
            onClick={closeViewer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Blurred, dimmed page behind */}
            <div className="absolute inset-0 -z-10 bg-[#171715]/55 backdrop-blur-2xl backdrop-saturate-150" />

            {/* Close */}
            <button
              type="button"
              onClick={closeViewer}
              aria-label="Close viewer"
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full text-3xl text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#f15a24]"
            >
              ×
            </button>

            {/* Previous */}
            {assets.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevious();
                }}
                aria-label="Previous"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 px-3 py-5 text-3xl text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#f15a24] sm:left-5"
              >
                ‹
              </button>
            )}

            {/* Media. layoutId makes it fly from its spot in the grid */}
            <motion.div
              layoutId={`asset-${activeAsset.src}`}
              transition={spring}
              onClick={(e) => e.stopPropagation()}
              className="overflow-hidden rounded-[2px] bg-black/20 shadow-2xl"
            >
              {activeAsset.type === "image" ? (
                <img
                  src={activeAsset.src}
                  alt={activeAsset.alt}
                  className="block max-h-[68vh] max-w-[88vw] object-contain"
                />
              ) : (
                <video
                  key={activeAsset.src}
                  src={activeAsset.src}
                  poster={activeAsset.poster}
                  controls
                  autoPlay
                  playsInline
                  className="block max-h-[68vh] max-w-[88vw] object-contain"
                />
              )}
            </motion.div>

            {/* Description: rises in once the media has landed */}
            <motion.div
              key={activeAsset.src}
              className="mt-6 max-w-xl text-center"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.18, duration: 0.4, ease: "easeOut" }}
            >
              <h2
                className="text-2xl tracking-[-0.02em] text-white sm:text-3xl"
                style={{ fontFamily: "Tiempos, Georgia, serif" }}
              >
                {activeAsset.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {activeAsset.description}
              </p>
            </motion.div>

            {/* Next */}
            {assets.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Next"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 px-3 py-5 text-3xl text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#f15a24] sm:right-5"
              >
                ›
              </button>
            )}

            {/* Position */}
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/50">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(assets.length).padStart(2, "0")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
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
