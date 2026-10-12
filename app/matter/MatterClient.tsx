"use client"

import { useEffect, useState } from "react"
import Header from "../components/Header"
import GalleryClient, { type Asset } from "./GalleryClient"

type View = "list" | "board"

// Approx navbar height in px. Tweak to match your Header.
const HEADER_H = 80

// Adjust this to match your Asset type (title, name, etc.)
function getAssetLabel(asset: Asset, index: number): string {
    const a = asset as unknown as Record<string, unknown>
    const label = a.title ?? a.name ?? a.id
    return typeof label === "string" && label ? label : `Project ${index + 1}`
}

export default function MatterClient({ assets }: { assets: Asset[] }) {
    // Starts on "list" so the board doesn't cover the page on first load.
    // Change to "board" if you want it to open fullscreen immediately.
    const [view, setView] = useState<View>("list")
    const [menuOpen, setMenuOpen] = useState(false)

    const exitBoard = () => {
        setMenuOpen(false)
        setView("list")
    }

    // Lock page scroll while the board is fullscreen
    useEffect(() => {
        if (view === "board") {
            const prev = document.body.style.overflow
            document.body.style.overflow = "hidden"
            return () => {
                document.body.style.overflow = prev
            }
        }
    }, [view])

    // Esc closes the dropdown first, then exits board mode
    useEffect(() => {
        if (view !== "board") return
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return
            if (menuOpen) setMenuOpen(false)
            else exitBoard()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [view, menuOpen])

    return (
        <div className="min-h-screen bg-[#ffffff] text-[#41413d]">
            <Header />
            <div className="px-5 pt-6 sm:px-9 sm:pt-10">
                <h1 className="text-6xl font-medium leading-[0.98] tracking-[-0.04em] text-[#41413d] sm:text-6xl">
                    Matter.lab
                </h1>
                <p>
                    Matter.lab is an experimental studio & playground for making things at the intersection of art,
                    design & engineering. Industrial design, code, brands, illustrations, weird little experiments —
                    whatever feels worth making. No rules. Just make stuff.
                </p>

                {/* List / Board toggle */}
                <div className="mt-8 flex gap-3 pb-12">
                    <button
                        type="button"
                        onClick={() => setView("list")}
                        aria-pressed={view === "list"}
                        className={`rounded-lg border px-[18px] py-3 text-xl transition-colors ${
                            view === "list"
                                ? "border-[#41413d] bg-[#41413d] text-white"
                                : "border-[#41413d] bg-transparent text-[#41413d] hover:bg-[#41413d]/10"
                        }`}
                    >
                        List
                    </button>
                    <button
                        type="button"
                        onClick={() => setView("board")}
                        aria-pressed={view === "board"}
                        className={`rounded-lg border px-[18px] py-3 text-xl transition-colors ${
                            view === "board"
                                ? "border-[#41413d] bg-[#41413d] text-white"
                                : "border-[#41413d] bg-transparent text-[#41413d] hover:bg-[#41413d]/10"
                        }`}
                    >
                        Board
                    </button>
                </div>
            </div>

            {/* List view: the gallery (masonry grid + fullscreen viewer) */}
            {view === "list" && <GalleryClient assets={assets} />}

            {/* Fullscreen green dotted board with navbar kept on top */}
            {view === "board" && (
                <section
                    className="fixed inset-0 z-50 overflow-hidden bg-[#4a983c]"
                    style={{
                        backgroundImage: "radial-gradient(circle, #2b7220 1.5px, transparent 4.5px)",
                        backgroundSize: "12px 12px",
                        backgroundPosition: "20px 24px",
                    }}
                >
                    {/* Navbar pinned to the top of the board */}
                    <div className="absolute inset-x-0 top-0 z-20 bg-white">
                        <Header />
                    </div>

                    {/* Buttons row: View List + Exit (Exit on the extreme right) */}
                    <div
                        style={{ top: HEADER_H + 24 }}
                        className="absolute right-[85px] z-10 flex items-start gap-3 max-sm:right-5"
                    >
                        {/* View List + dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpen((o) => !o)}
                                aria-expanded={menuOpen}
                                aria-haspopup="menu"
                                className="flex items-center gap-3 rounded-lg bg-[#41413d] px-[18px] py-[14px] text-xl text-white transition-colors hover:bg-[#2f2f2c] max-sm:px-3 max-sm:text-base"
                            >
                                View List
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    aria-hidden="true"
                                    className={`transition-transform ${menuOpen ? "" : "rotate-180"}`}
                                >
                                    <path
                                        d="M3 10.5L8 5.5L13 10.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {menuOpen && (
                                <ul
                                    role="menu"
                                    className="absolute left-0 mt-2 max-h-[60vh] w-72 overflow-y-auto rounded-lg bg-white py-2 text-[#41413d] shadow-xl max-sm:w-56"
                                >
                                    {assets.length === 0 && (
                                        <li className="px-4 py-3 text-base text-[#41413d]/60">No projects yet</li>
                                    )}
                                    {assets.map((asset, i) => (
                                        <li key={i} role="none">
                                            <button
                                                type="button"
                                                role="menuitem"
                                                onClick={exitBoard}
                                                className="w-full px-4 py-3 text-left text-lg transition-colors hover:bg-[#41413d]/10"
                                            >
                                                {getAssetLabel(asset, i)}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Exit board mode (extreme right) */}
                        <button
                            type="button"
                            onClick={exitBoard}
                            className="flex items-center gap-3 rounded-lg border border-white bg-transparent px-[18px] py-[14px] text-xl text-white transition-colors hover:bg-white/15 max-sm:px-3 max-sm:text-base"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Exit
                        </button>
                    </div>

                    {/* Magnets go here later */}
                </section>
            )}
        </div>
    )
}