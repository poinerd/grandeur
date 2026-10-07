import fs from "node:fs";
import path from "node:path";
import type { Asset } from "./GalleryClient";

/** Folder inside `public` that holds your images and videos. */
const FOLDER = "gallery";

const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".svg"];
const VIDEO_EXT = [".mp4", ".webm", ".mov"];

/**
 * OPTIONAL: write a proper title/description for any file.
 * The key is the exact filename. Files not listed here still show up,
 * with a title made from the filename.
 */
const details: Record<string, { title?: string; description?: string }> = {
  // "brand-system.png": {
  //   title: "Brand system",
  //   description: "Colour, type and icon rules for a payments app.",
  // },
};

/** "brand-system_v2.png" -> "Brand system v2" */
function titleFromFilename(file: string) {
  const name = path
    .parse(file)
    .name.replace(/^\d+[-_.\s]*/, "") // drop leading order numbers like "01-"
    .replace(/[-_]+/g, " ")
    .trim();
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getGalleryAssets(): Asset[] {
  const dir = path.join(process.cwd(), "public", FOLDER);

  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return []; // folder missing: the page shows "Nothing here yet."
  }

  return files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXT.includes(ext) || VIDEO_EXT.includes(ext);
    })
    // Order by filename. Prefix with 01-, 02-... to control the order.
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file): Asset => {
      const ext = path.extname(file).toLowerCase();
      const title = details[file]?.title ?? titleFromFilename(file);
      return {
        type: VIDEO_EXT.includes(ext) ? "video" : "image",
        src: `/${FOLDER}/${file}`,
        alt: title,
        title,
        description: details[file]?.description ?? "",
      };
    });
}