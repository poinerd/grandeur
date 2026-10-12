"use client"

import { useEffect, useRef, useState } from "react"

type ContactLink = { label: string; href: string }

type ContactProps = {
    email?: string
    links?: ContactLink[]
    heading?: string
    intro?: string
    className?: string
}

const DEFAULT_LINKS: ContactLink[] = [
    { label: "Twitter / X", href: "https://x.com/yourhandle" },
    { label: "Instagram", href: "https://instagram.com/yourhandle" },
    { label: "LinkedIn", href: "https://linkedin.com/in/yourhandle" },
    { label: "GitHub", href: "https://github.com/yourhandle" },
]

export default function Contact({
    email = "hello@yourdomain.com",
    links = DEFAULT_LINKS,
    heading = "Let's make something weird.",
    intro = "Got a project, an idea, or a strange question? Send it my way. I read everything, and I reply faster than you'd expect.",
    className = "",
}: ContactProps) {
    const [copied, setCopied] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current)
        }
    }, [])

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(email)
            setCopied(true)
            if (timer.current) clearTimeout(timer.current)
            timer.current = setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard blocked: fall back to opening the mail app
            window.location.href = `mailto:${email}`
        }
    }

    return (
        <section className={className}>
            {/* Self-contained keyframes so the component works anywhere */}
            <style>{`
                @keyframes contact-wave {
                    0%, 60%, 100% { transform: rotate(0deg); }
                    10%, 30% { transform: rotate(14deg); }
                    20%, 40% { transform: rotate(-8deg); }
                    50% { transform: rotate(10deg); }
                }
                @media (prefers-reduced-motion: no-preference) {
                    .contact-wave { animation: contact-wave 2.5s ease-in-out infinite; }
                }
            `}</style>

            <h2 className="text-6xl font-medium leading-[0.98] tracking-[-0.04em] text-[#41413d] sm:text-6xl">
                {heading}{" "}
                <span className="contact-wave inline-block origin-[70%_70%]" aria-hidden="true">
                    👋
                </span>
            </h2>

            <p className="mt-4 max-w-2xl text-[#41413d]">{intro}</p>

            {/* Email card */}
            <div
                className="mt-10 flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-[#4a983c] p-6 sm:p-10"
                style={{
                    backgroundImage: "radial-gradient(circle, #2b7220 1.5px, transparent 4.5px)",
                    backgroundSize: "12px 12px",
                }}
            >
                <p className="text-white">The fastest way to reach me:</p>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={copyEmail}
                        className="flex items-center gap-3 rounded-lg bg-[#41413d] px-[18px] py-[14px] text-xl text-white transition-all hover:bg-[#2f2f2c] active:scale-95"
                    >
                        {copied ? "Copied! Nice." : email}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            {copied ? (
                                <path
                                    d="M3 8.5L6.5 12L13 4.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ) : (
                                <>
                                    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
                                    <path d="M3 10V4.5A1.5 1.5 0 0 1 4.5 3H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </>
                            )}
                        </svg>
                    </button>

                    <a
                        href={`mailto:${email}`}
                        className="rounded-lg border border-white px-[18px] py-[14px] text-xl text-white transition-colors hover:bg-white/15"
                    >
                        Open mail app
                    </a>
                </div>
            </div>

            {/* Socials */}
            {links.length > 0 && (
                <div className="mt-12 grid gap-3 text-[#41413d] md:grid-cols-[220px_1fr] md:gap-10">
                    <h3 className="font-medium">Or find me here</h3>
                    <ul className="flex flex-wrap gap-3">
                        {links.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 rounded-lg border border-[#41413d] px-[18px] py-3 text-xl transition-colors hover:bg-[#41413d] hover:text-white"
                                >
                                    {link.label}
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        aria-hidden="true"
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    >
                                        <path
                                            d="M5 11L11 5M11 5H6M11 5V10"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    )
}