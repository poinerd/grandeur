import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";
import { getGalleryAssets } from "./gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Project shots, illustrations, designs and stuff",
};

export default function GalleryPage() {
  return <GalleryClient assets={getGalleryAssets()} />;
}
