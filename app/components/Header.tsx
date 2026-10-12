"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLayoutEffect, useRef, useState } from "react"

const LINKS = [
    { label: "Work", href: "/" },
    { label: "Matter.lab", href: "/matter" },
    { label: "Me", href: "/me" },
]

const DOT = 8 // dot size in px
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)" // smooth, long deceleration, no bounce

export default function Header() {
    const pathname = usePathname()
    const navRef = useRef<HTMLElement>(null)
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
    const prevLeft = useRef<number | null>(null)
    const [dot, setDot] = useState<{ left: number; right: number; top: number; dir: 1 | -1 } | null>(null)
    const [animate, setAnimate] = useState(false)

    const activeIndex = LINKS.findIndex((l) =>
        l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)
    )

    useLayoutEffect(() => {
        const place = () => {
            const el = linkRefs.current[activeIndex]
            const nav = navRef.current
            if (!el || !nav) return setDot(null)

            const left = el.offsetLeft - 16 // sits in the gap, left of the text
            const dir: 1 | -1 = prevLeft.current !== null && left < prevLeft.current ? -1 : 1
            prevLeft.current = left

            setDot({
                left,
                right: nav.clientWidth - (left + DOT),
                top: el.offsetTop + el.offsetHeight / 2 - DOT / 2,
                dir,
            })
        }
        place()
        const id = requestAnimationFrame(() => setAnimate(true))
        window.addEventListener("resize", place)
        return () => {
            cancelAnimationFrame(id)
            window.removeEventListener("resize", place)
        }
    }, [activeIndex])

    // The leading edge moves first, the trailing edge follows slightly later,
    // so the dot stretches into a pill mid-travel, then contracts on arrival.
    const lead = `${EASE} 0ms`
    const trail = `${EASE} 110ms`
    const movingRight = dot?.dir === 1

    return (
        <header className="flex items-center justify-between px-5 py-6 sm:px-9">
            {/* Logo */}
            <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full"
                aria-label="Home"
            >
                <img src="/assets/me.png" alt="Emmanuel" className="h-full w-full object-cover" />
            </Link>

            {/* Main navigation */}
            <nav ref={navRef} className="relative flex items-center gap-6 text-sm text-[#555550]">
                {/* Sliding dot */}
                {dot && (
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute rounded-full bg-[#f15a24] motion-reduce:!transition-none"
                        style={{
                            left: dot.left,
                            right: dot.right,
                            top: dot.top,
                            height: DOT,
                            transition: animate
                                ? `left 520ms ${movingRight ? trail : lead}, right 520ms ${
                                      movingRight ? lead : trail
                                  }`
                                : "none",
                        }}
                    />
                )}

                {LINKS.map((link, i) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        ref={(el) => {
                            linkRefs.current[i] = el
                        }}
                        className={`transition-colors duration-500 hover:text-[#f15a24] ${
                            i === activeIndex ? "text-[#f15a24]" : ""
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </header>
    )
}