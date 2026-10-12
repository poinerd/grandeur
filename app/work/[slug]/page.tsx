import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllProjects, getProject } from "@/app/lib/projects";
import { mdxComponents } from "@/app/components/mdx";
import Header from "../../components/Header";

type Params = { slug: string };

// Builds a page for every project at deploy time
// only pre-build the ready ones
export function generateStaticParams(): Params[] {
  return getAllProjects()
    .filter((p) => p.caseStudyReady)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return project ? { title: project.meta.title, description: project.meta.summary } : {};
}



export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const project = getProject(slug);
  if (!project || !project.meta.caseStudyReady) notFound();   // ← changed line

  const { content } = await compileMDX({
    source: project.content,
    components: mdxComponents,
  });

  return (
    <div className="bg-[#ffffff] text-[#41413d]">
      <Header/>
      <article className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/#projects" className="text-sm text-neutral-600 hover:underline">
        ← All projects
      </Link>

      <h1 className="mt-6 text-5xl font-semi-bold tracking-tight">{project.meta.title}</h1>
      <p className="mt-3 text-neutral-600">
        {project.meta.role} · {project.meta.year}
      </p>

      <div className="prose prose-neutral mt-12 max-w-none">{content}</div>
    </article>



    </div>
    
  );
}