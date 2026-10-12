"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

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
    const wrapRef = useRef<HTMLDivElement>(null)
    const measureRef = useRef<HTMLSpanElement>(null)
    const charRefs = useRef<(HTMLSpanElement | null)[]>([])
    const [fontSize, setFontSize] = useState(48)
    const [copied, setCopied] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Scale the font so the email spans exactly the container's width
    const fit = useCallback(() => {
        const wrap = wrapRef.current
        const probe = measureRef.current
        if (!wrap || !probe) return
        const available = wrap.clientWidth
        const naturalWidth = probe.getBoundingClientRect().width // measured at 100px
        if (available && naturalWidth) setFontSize((available / naturalWidth) * 100)
    }, [])

    useLayoutEffect(() => {
        fit()
        const ro = new ResizeObserver(fit)
        if (wrapRef.current) ro.observe(wrapRef.current)
        document.fonts?.ready.then(fit)
        return () => ro.disconnect()
    }, [fit, email])

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current)
        }
    }, [])

    // Letters rise, grow and turn orange-red as the cursor passes near them
    const handleMove = (e: React.PointerEvent) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const radius = fontSize * 2.5
        charRefs.current.forEach((el) => {
            if (!el) return
            const r = el.getBoundingClientRect()
            const dx = e.clientX - (r.left + r.width / 2)
            const dy = (e.clientY - (r.top + r.height / 2)) * 0.6
            const influence = Math.max(0, 1 - Math.hypot(dx, dy) / radius) ** 2
            el.style.transition = "transform 120ms ease-out, color 120ms ease-out"
            el.style.transform = `translateY(${-influence * fontSize * 0.3}px) scale(${1 + influence * 0.3})`
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
        <section className={`bg-[#1a1a18] p-6 sm:p-10 md:p-14 ${className}`}>
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

            <div ref={wrapRef} className="relative mt-6 w-full">
                {/* Hidden probe: measures the email's natural width at 100px */}
                <span
                    ref={measureRef}
                    aria-hidden="true"
                    className="invisible absolute left-0 top-0 whitespace-nowrap font-medium tracking-[-0.04em]"
                    style={{ fontSize: 100 }}
                >
                    {email}
                </span>

                <h1 className="m-0">
                    <a
                        href={`mailto:${email}`}
                        aria-label={`Email me at ${email}`}
                        onPointerMove={handleMove}
                        onPointerLeave={handleLeave}
                        className="block w-full select-none whitespace-nowrap font-medium leading-none tracking-[-0.04em] text-[#f2f0ea] no-underline"
                        style={{ fontSize }}
                    >
                        <span aria-hidden="true" className="block">
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
            </div>

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