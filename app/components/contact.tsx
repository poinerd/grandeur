"use client"

import { useEffect, useRef, useState } from "react"

type ContactProps = {
    email?: string
    className?: string
}

// Colors interpolated on hover: #f2f0ea (off-white) -> #ff4d1a (orange-red)
const FROM = [242, 240, 234]
const TO = [255, 77, 26]

export default function Contact({
    email = "obadofinadedapo123@gmail.com",
    className = "",
}: ContactProps) {
    const charRefs = useRef<(HTMLSpanElement | null)[]>([])
    const [copied, setCopied] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current)
        }
    }, [])

    // Letters rise, grow and turn orange-red as the cursor passes near them
    const handleMove = (e: React.PointerEvent) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        charRefs.current.forEach((el) => {
            if (!el) return
            const r = el.getBoundingClientRect()
            const radius = r.height * 2.5
            const dx = e.clientX - (r.left + r.width / 2)
            const dy = (e.clientY - (r.top + r.height / 2)) * 0.6
            const influence = Math.max(0, 1 - Math.hypot(dx, dy) / radius) ** 2
            el.style.transition = "transform 120ms ease-out, color 120ms ease-out"
            el.style.transform = `translateY(${-influence * r.height * 0.3}px) scale(${1 + influence * 0.3})`
            const c = FROM.map((f, i) => Math.round(f + (TO[i] - f) * influence))
            el.style.color = `rgb(${c[0]}, ${c[1]}, ${c[2]})`
        })
    }

    const handleLeave = () => {
        charRefs.current.forEach((el) => {
            if (!el) return
            el.style.transition = "transform 600ms cubic-bezier(.2,1.4,.4,1), color 600ms ease"
            el.style.transform = ""
            el.style.color = ""
        })
    }

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(email)
            setCopied(true)
            if (timer.current) clearTimeout(timer.current)
            timer.current = setTimeout(() => setCopied(false), 2000)
        } catch {
            window.location.href = `mailto:${email}`
        }
    }

    return (
        <section className={`w-full max-w-full overflow-hidden bg-[#1a1a18] p-6 sm:p-10 md:p-14 ${className}`}>
            <style>{`
                @keyframes contact-wave {
                    0%, 60%, 100% { transform: rotate(0deg); }
                    10%, 30% { transform: rotate(14deg); }
                    20%, 40% { transform: rotate(-8deg); }
                    50% { transform: rotate(10deg); }
                }
                @keyframes contact-spin { to { transform: rotate(360deg); } }
                @media (prefers-reduced-motion: no-preference) {
                    .contact-wave { animation: contact-wave 4s ease-in-out infinite; }
                    .contact-at { animation: contact-spin 10s linear infinite; }
                }
            `}</style>

            <p className="text-xl text-[#f2f0ea]">
                Say hi, or reach me through my mail{" "}
                <span className="contact-wave inline-block origin-[70%_70%]" aria-hidden="true">
                    👋
                </span>
            </p>

            <h1 className="mt-6 text-[clamp(1.75rem,7vw,5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#f2f0ea]">
                <a
                    href={`mailto:${email}`}
                    aria-label={`Email me at ${email}`}
                    onPointerMove={handleMove}
                    onPointerLeave={handleLeave}
                    className="block max-w-full select-none break-all no-underline"
                >
                    <span aria-hidden="true">
                        {email.split("").map((ch, i) => (
                            <span
                                key={i}
                                ref={(el) => {
                                    charRefs.current[i] = el
                                }}
                                className="inline-block will-change-transform"
                            >
                                {ch === "@" ? (
                                    <span className="contact-at inline-block">@</span>
                                ) : (
                                    ch
                                )}
                            </span>
                        ))}
                    </span>
                </a>
            </h1>

            <button
                type="button"
                onClick={copyEmail}
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#f2f0ea] px-[18px] py-3 text-lg text-[#f2f0ea] transition-all hover:bg-[#f2f0ea] hover:text-[#1a1a18] active:scale-95"
            >
                {copied ? "Copied! Nice. ✓" : "Copy email"}
            </button>
        </section>
    )
}