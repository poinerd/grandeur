import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/data/projects";
import ProjectMedia from "@/components/ProjectMedia";

type Params = { slug: string };

// Pre-build a page for every project
export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

// Next.js 15+: params is a Promise. (On Next 14, remove `await` and the Promise type.)
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.title, description: project.subtitle } : {};
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <Link href="/#projects" className="text-sm text-neutral-600 hover:underline dark:text-neutral-400">
        ← All projects
      </Link>

      <h1 className="mt-6 text-4xl font-bold tracking-tight">{project.title}</h1>
      <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">{project.subtitle}</p>

      <div className="relative mt-8 aspect-video overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
        <ProjectMedia media={project.media} variant="detail" priority />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_16rem]">
        <p className="whitespace-pre-line leading-relaxed">{project.description}</p>

        <aside className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold">Built with</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li key={t} className="rounded-full border border-neutral-300 px-3 py-1 text-xs dark:border-neutral-700">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-black px-4 py-2.5 text-center text-sm font-medium text-white hover:opacity-85 dark:bg-white dark:text-black"
            >
              Visit live site
            </a>
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-neutral-300 px-4 py-2.5 text-center text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                View code
              </a>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
