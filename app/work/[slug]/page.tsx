import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllProjects, getProject } from "@/app/lib/projects";
import { mdxComponents } from "@/app/components/mdx";
import Header from "../../components/Header";

type Params = { slug: string };

// Extra frontmatter fields this page reads.
// Better long-term: add these to the meta type in @/app/lib/projects
// and delete this type and the cast below.
type ExtraMeta = {
  stack?: string[];
  github?: string;
  live?: string;
};

// Only pre-build projects that are ready
export function generateStaticParams(): Params[] {
  return getAllProjects()
    .filter((p) => p.caseStudyReady)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return project
    ? { title: project.meta.title, description: project.meta.summary }
    : {};
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const project = getProject(slug);
  if (!project || !project.meta.caseStudyReady) notFound();

  const { content } = await compileMDX({
    source: project.content,
    components: mdxComponents,
  });

  const extra = project.meta as unknown as ExtraMeta;
  const tags: string[] = project.meta.tags ?? [];
  const stack: string[] = extra.stack ?? [];
  const github = extra.github;
  const live = extra.live;

  // Previous / next navigation (only projects with a ready case study)
  const readyProjects = getAllProjects().filter((p) => p.caseStudyReady);
  const index = readyProjects.findIndex((p) => p.slug === slug);
  const prevProject = index > 0 ? readyProjects[index - 1] : null;
  const nextProject =
    index >= 0 && index < readyProjects.length - 1
      ? readyProjects[index + 1]
      : null;

  return (
    // overflow-x-clip stops the wide screenshots from causing sideways scroll
    <div className="overflow-x-clip bg-[#ffffff] text-[#41413d]">
      <Header />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/#projects" className="text-sm text-neutral-600 hover:underline">
          ← All projects
        </Link>

        {/* Title block */}
        <header className="mt-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            {project.meta.year}
          </p>

          <h1 className="mt-3 text-5xl font-semibold tracking-tight">
            {project.meta.title}
          </h1>

          {project.meta.summary && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-600">
              {project.meta.summary}
            </p>
          )}

          {/* Project links (from frontmatter: live / github) */}
          {(live || github) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {live && (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1f1f1c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black"
                >
                  View live site
                  <ArrowIcon />
                </a>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-[#1f1f1c] transition hover:border-neutral-900"
                >
                  <GithubIcon />
                  GitHub repo
                </a>
              )}
            </div>
          )}

          {/* Meta rows */}
          <dl className="mt-8 space-y-4 border-y border-neutral-200 py-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <dt className="w-20 shrink-0 text-xs font-medium uppercase tracking-wider text-neutral-500">
                Role
              </dt>
              <dd className="text-sm font-medium">{project.meta.role}</dd>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                <dt className="w-20 shrink-0 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Skills
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}

            {stack.length > 0 && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                <dt className="w-20 shrink-0 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Built with
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800"
                    >
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </header>

        {/* MDX content: styled by mdxComponents, so no `prose` class here */}
        <div className="mt-12">{content}</div>

        {/* Previous / next project */}
        {(prevProject || nextProject) && (
          <nav
            aria-label="More projects"
            className="mt-24 grid gap-4 border-t border-neutral-200 pt-10 sm:grid-cols-2"
          >
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group rounded-2xl border border-neutral-200 p-6 transition hover:border-neutral-900"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  ← Previous project
                </p>
                <p className="mt-2 text-lg font-semibold text-[#1f1f1c] group-hover:underline">
                  {prevProject.meta.title}
                </p>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group rounded-2xl border border-neutral-200 p-6 text-left transition hover:border-neutral-900 sm:text-right"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Next project →
                </p>
                <p className="mt-2 text-lg font-semibold text-[#1f1f1c] group-hover:underline">
                  {nextProject.meta.title}
                </p>
              </Link>
            )}
          </nav>
        )}
      </article>
    </div>
  );
}