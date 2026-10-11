import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const projectsDir = path.join(process.cwd(), "app/content/projects");

export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  year: number;
  cover: string;
  tags: string[];
  caseStudyReady: boolean;
};

// Turns raw frontmatter into a clean ProjectMeta
function toMeta(slug: string, data: Record<string, unknown>): ProjectMeta {
  return {
    ...(data as Omit<ProjectMeta, "slug" | "caseStudyReady">),
    slug,
    caseStudyReady: data.caseStudyReady === true, // missing = not ready
  };
}

export function getAllProjects(): ProjectMeta[] {
  if (!fs.existsSync(projectsDir)) return [];

  return fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data } = matter(fs.readFileSync(path.join(projectsDir, file), "utf8"));
      return toMeta(slug, data);
    })
    .sort((a, b) => b.year - a.year);
}

export function getProject(slug: string) {
  const file = path.join(projectsDir, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { meta: toMeta(slug, data), content };
}