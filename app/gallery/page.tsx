import fs from "fs";
import path from "path";
import GalleryClient from "./GalleryClient";

export default function GalleryPage() {
    const galleryPath = path.join(process.cwd(), "public", "gallery");

    const files = fs
    .readdirSync(galleryPath)
    .filter((file) =>
    /.(jpg|jpeg|png|webp|gif|mp4|webm|mov)$/i.test(file)
    );

    const assets = files.map((file) => ({
    src: `/gallery/${file}`,
    type: /.(mp4|webm|mov)$/i.test(file) ? "video" : "image",
    alt: file,
    }));

    return <GalleryClient assets={assets} />;
}
