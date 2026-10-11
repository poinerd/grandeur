"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Project } from "@/data/projects";

interface Props {
  media: Project["media"];
  /** Card mode: video plays on hover. Detail mode: video shows controls. */
  variant?: "card" | "detail";
  priority?: boolean;
}

export default function ProjectMedia({ media, variant = "card", priority = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (media.type === "image") {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
      />
    );
  }

  if (variant === "detail") {
    return (
      <video
        src={media.src}
        poster={media.poster}
        controls
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={media.src}
      poster={media.poster}
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-cover"
      // Play on hover so a grid of videos doesn't all run at once
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => videoRef.current?.pause()}
    />
  );
}
