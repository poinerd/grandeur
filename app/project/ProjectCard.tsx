import Link from "next/link";
import type { Project } from "@/data/projects";
import ProjectMedia from "./ProjectMedia";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-neutral-800 dark:bg-neutral-900 dark:focus-visible:outline-white"
    >
      <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none">
          <ProjectMedia media={project.media} />
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{project.subtitle}</p>
      </div>
    </Link>
  );
}
