import Image from "next/image";
import Link from "next/link";
import type { ProjectMeta } from "@/app/lib/projects";

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Case study coming soon"
      role="img"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export default function ProjectCard({ project }: { project: ProjectMeta }) {
  const content = (
    <>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className={`object-cover transition-transform duration-300 ${
            project.caseStudyReady ? "group-hover:scale-105" : ""
          }`}
        />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <p
          className={`text-[16px] leading-[1.35] font-medium tracking-[-0.02em] text-[#41413d]  sm:text-[18px] transition-colors ${
            project.caseStudyReady ? "group-hover:text-[#f15a24]" : ""
          }`}
        >
          {project.title}
        </p>
        {!project.caseStudyReady && (
          <span className="text-[#666660]">
            <LockIcon />
          </span>
        )}
      </div>

      <p className="mt-1 text-[#666660]">{project.summary}</p>
    </>
  );

  // Ready: the whole card is a link
  if (project.caseStudyReady) {
    return (
      <Link href={`/work/${project.slug}`} className="group block">
        {content}
      </Link>
    );
  }

  // Not ready: same look, but not clickable
  return (
    <div className="block cursor-not-allowed select-none" aria-disabled="true">
      {content}
    </div>
  );
}