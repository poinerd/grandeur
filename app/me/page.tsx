import Header from "../components/Header"
import Contact from "../components/contact"
type Experience = {
    company: string
    role: string
    start: string // e.g. "Jan 2024"
    end: string // e.g. "Aug 2024" or "Present"
}

// Replace these placeholders with your real experience (newest first)
const EXPERIENCE: Experience[] = [
    { company: "TM30 Global, Lagos", role: "Design Enginering Intern", start: "May 2026", end: "Present" },
    { company: "Colab Innovation Hub, Kaduna", role: "Software Development Intern", start: "July 2025", end: "Sep 2026" },
    { company: "Ufarm Africa", role: "Visual Designer", start: "July 2025", end: "Present" },
]

const SKILLS = ["UI Design", "Software Development", "Visual Design", "Figma", "HTML & CSS", "React", "Go", "Prototyping"]

// Change to wherever your resume lives (e.g. a PDF in /public)
const RESUME_URL = "/resume.pdf"

export default function Me() {
    return (
        <div className="min-h-screen bg-[#ffffff] text-[#41413d]">
            <Header />

            <main className="px-5 pb-24 pt-6 sm:px-9 sm:pt-10">
                <h1 className="text-6xl font-medium leading-[0.98] tracking-[-0.04em] text-[#41413d] sm:text-6xl">
                    I care about beauty and how things work.
                </h1>

                <p className="mt-4 max-w-2xl">
                    I&apos;m Emmanuel Olumide, a Computer Engineering student and designer from Nigeria. I design
                    digital interfaces and visual identities, with an interest in how design and technology come
                    together to solve problems.
                </p>

                <div className="mt-12 flex flex-col gap-10">
                    {/* Skills & Tools */}
                    <section className="grid gap-3 md:grid-cols-[220px_1fr] md:gap-10">
                        <h2 className="font-medium">Skills &amp; Tools</h2>
                        <ul className="flex flex-wrap gap-2">
                            {SKILLS.map((skill) => (
                                <li
                                    key={skill}
                                    className="rounded-lg border border-[#41413d] px-3 py-1.5"
                                >
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Experience timeline */}
                    <section className="grid gap-3 md:grid-cols-[220px_1fr] md:gap-10">
                        <div>
                            <h2 className="font-medium">Experience</h2>
                            <p className="mt-1 text-[#41413d]/60">Selected roles and projects</p>
                        </div>

                        <ol className="relative ml-2 border-l border-[#41413d]/30">
                            {EXPERIENCE.map((item, i) => (
                                <li key={i} className="relative pb-8 pl-6 last:pb-0">
                                    {/* Timeline dot */}
                                    <span className="absolute -left-[6px] top-1.5 h-3 w-3 rounded-full border-2 border-[#41413d] bg-white" />

                                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                                        <h3 className="font-medium">{item.company}</h3>
                                        <span className="text-[#41413d]/60">
                                            {item.start} – {item.end}
                                        </span>
                                    </div>
                                    <p className="mt-0.5">{item.role}</p>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {/* Resume */}
                    <section className="grid gap-3 md:grid-cols-[220px_1fr] md:gap-10">
                        <h2 className="font-medium">Resume</h2>
                        <div>
                            <a
                                href={RESUME_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 rounded-lg bg-[#41413d] px-[18px] py-3 text-xl text-white transition-colors hover:bg-[#2f2f2c]"
                            >
                                View my resume
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <path
                                        d="M5 11L11 5M11 5H6M11 5V10"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                        </div>
                    </section>
                </div>
            </main>
                    <Contact  className="px-5 pt-6 sm:px-9 sm:pt-10 "/>

        </div>
    )
}