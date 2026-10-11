export type ProjectMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string };

export interface Project {
  slug: string; // used in the URL: /projects/<slug>
  title: string;
  subtitle: string; // short line shown on the card
  description: string; // longer explanation shown on the project page
  media: ProjectMedia;
  tech: string[];
  liveUrl: string;
  repoUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "shopfront",
    title: "Shopfront",
    subtitle: "An online store for local fabric sellers.",
    description:
      "Shopfront lets small fabric vendors list products, take orders and track deliveries. I built the storefront, the seller dashboard and the payments flow. Replace this text with your own story: the problem, what you built, and what you learned.",
    media: { type: "image", src: "/projects/shopfront.jpg", alt: "Shopfront home page" },
    tech: ["Next.js", "TypeScript", "Postgres", "Paystack"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/your-username/shopfront",
  },
  {
    slug: "trackr",
    title: "Trackr",
    subtitle: "A habit tracker that works offline.",
    description:
      "Trackr stores everything on-device and syncs when you reconnect. Replace this text with your own project details.",
    media: { type: "video", src: "/projects/trackr.mp4", poster: "/projects/trackr-poster.jpg" },
    tech: ["React", "IndexedDB", "PWA"],
    liveUrl: "https://example.com",
  },
];