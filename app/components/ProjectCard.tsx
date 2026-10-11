import Image from "next/image";
import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";

export default function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-4 text-xl font-semibold">{project.title}</h3>
      <p className="mt-1 text-neutral-600">{project.summary}</p>
    </Link>
  );
}