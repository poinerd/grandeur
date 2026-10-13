"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type Asset = {
  type: "image" | "video";
  src: string;
  alt: string;
  title: string;
  description: string;
  poster?: string;
};

const spring = { type: "spring", stiffness: 260, damping: 32 } as const;

type ProjectViewerProps = {
  assets: Asset[];
  /** Index of the asset being viewed, or null when closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  /**
   * When provided, the media flies from/to the matching element with the same
   * layoutId (the list grid does this). Leave it out where there is no
   * matching element (the board), and the media fades and scales in instead.
   */
  layoutIdFor?: (asset: Asset) => string;
  /** Stacking class. Raise it where other fixed layers sit on top (the board). */
  zClass?: string;
};

export default function ProjectViewer({
  assets,
  index,
  onClose,
  onIndexChange,
  layoutIdFor,
  zClass = "z-50",
}: ProjectViewerProps) {
  const asset = index !== null ? assets[index] : null;
  const count = assets.length;

  useEffect(() => {
    if (index === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
      if (e.key === "ArrowRight") onIndexChange((index + 1) % count);
    };

    // Restore whatever was there before, so a page that already locked
    // scrolling (the board) stays locked after the viewer closes.
    const prevOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, count, onClose, onIndexChange]);

  const layoutId = asset ? layoutIdFor?.(asset) : undefined;

  return (
    <AnimatePresence>
      {asset && index !== null && (
        <motion.div
          className={`fixed inset-0 ${zClass} flex flex-col items-center justify-center p-4 sm:p-8`}
          role="dialog"
          aria-modal="true"
          aria-label={asset.title}
          onClick={onClose}
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
            onClick={onClose}
            aria-label="Close viewer"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full text-3xl text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#f15a24]"
          >
            ×
          </button>

          {/* Previous */}
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange((index - 1 + count) % count);
              }}
              aria-label="Previous"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 px-3 py-5 text-3xl text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#f15a24] sm:left-5"
            >
              ‹
            </button>
          )}

          {/* Media. With a layoutId it flies from its spot in the grid */}
          <motion.div
            key={layoutId ? undefined : asset.src}
            {...(layoutId
              ? { layoutId, transition: spring }
              : {
                  initial: { opacity: 0, scale: 0.96 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.3, ease: "easeOut" as const },
                })}
            onClick={(e) => e.stopPropagation()}
            className="overflow-hidden rounded-[2px] bg-black/20 shadow-2xl"
          >
            {asset.type === "image" ? (
              <img
                src={asset.src}
                alt={asset.alt}
                className="block max-h-[68vh] max-w-[88vw] object-contain"
              />
            ) : (
              <video
                key={asset.src}
                src={asset.src}
                poster={asset.poster}
                controls
                autoPlay
                playsInline
                className="block max-h-[68vh] max-w-[88vw] object-contain"
              />
            )}
          </motion.div>

          {/* Description: rises in once the media has landed */}
          <motion.div
            key={asset.src}
            className="mt-6 max-w-xl text-center"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.18, duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-2xl tracking-[-0.02em] text-white sm:text-3xl">
              {asset.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              {asset.description}
            </p>
          </motion.div>

          {/* Next */}
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange((index + 1) % count);
              }}
              aria-label="Next"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 px-3 py-5 text-3xl text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#f15a24] sm:right-5"
            >
              ›
            </button>
          )}

          {/* Position */}
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/50">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}