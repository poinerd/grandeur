"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Header from "../components/Header"
import MagnetBoard, { type BoardItem, type SavedPositions } from "../components/MagnetBoard"
import Button from "../components/button"
import GalleryClient from "./GalleryClient"
import ProjectViewer, { type Asset } from "./ProjectViewer"

type View = "list" | "board"

// Flip to true to unlock the Board view again
const BOARD_ENABLED = false

// Approx navbar height in px. The board stops exactly at this line.
// Tweak to match your Header.
const HEADER_H = 80

// Animation duration in ms (keep in sync with the duration-[900ms] class below)
const ANIM_MS = 900

// Magnets show the image itself, or a video's poster frame
function getAssetImage(asset: Asset): string | undefined {
    return asset.type === "image" ? asset.src : asset.poster
}

export default function MatterClient({ assets }: { assets: Asset[] }) {
    const [view, setView] = useState<View>("list")
    const [menuOpen, setMenuOpen] = useState(false)

    // boardMounted: is the board in the DOM (needed so it can animate out)
    // boardShown: drives the slide up / slide down classes
    const [boardMounted, setBoardMounted] = useState(false)
    const [boardShown, setBoardShown] = useState(false)

    // Full-screen project view (index into assets) and magnet highlight request
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [focusRequest, setFocusRequest] = useState<{ index: number; n: number } | null>(null)

    // Magnet positions survive closing and reopening the board
    const savedPositions = useRef<SavedPositions>({})

    const items: BoardItem[] = useMemo(
        () =>
            assets.map((asset, i) => ({
                id: `asset-${i}`,
                label: asset.title,
                image: getAssetImage(asset),
            })),
        [assets]
    )

    const exitBoard = () => {
        setMenuOpen(false)
        setOpenIndex(null)
        setView("list")
    }

    // Picking a project in the dropdown finds its magnet on the board
    const pickFromMenu = (index: number) => {
        setMenuOpen(false)
        setFocusRequest({ index, n: Date.now() })
    }

    // Mount/unmount the board with slide-up and slide-down animations
    useEffect(() => {
        if (view === "board") {
            // Jump to the top so the fixed navbar lines up with the page's own navbar
            window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior })
            setBoardMounted(true)
            // Wait two frames so the off-screen state paints before sliding in
            let raf2 = 0
            const raf1 = requestAnimationFrame(() => {
                raf2 = requestAnimationFrame(() => setBoardShown(true))
            })
            return () => {
                cancelAnimationFrame(raf1)
                cancelAnimationFrame(raf2)
            }
        } else {
            setBoardShown(false)
            const t = setTimeout(() => setBoardMounted(false), ANIM_MS)
            return () => clearTimeout(t)
        }
    }, [view])

    // Lock page scroll while the board is on screen
    useEffect(() => {
        if (!boardMounted) return
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = prev
        }
    }, [boardMounted])

    // Esc closes the dropdown, then exits board mode.
    // While a project is open, the viewer handles Esc itself.
    useEffect(() => {
        if (view !== "board") return
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape" || openIndex !== null) return
            if (menuOpen) setMenuOpen(false)
            else exitBoard()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [view, menuOpen, openIndex])

    return (
        <div className="min-h-screen bg-[#ffffff] text-[#41413d]">
            <Header />
            <div className="px-5 pt-6 sm:px-9 sm:pt-10">
                <h1 className="text-6xl font-medium leading-[0.98] tracking-[-0.04em] text-[#41413d] sm:text-6xl">
                    Matter.lab
                </h1>
                <p className="mt-4 max-w-2xl">
                    Matter.lab is my experimental studio &amp; playground for making things at the intersection of
                    art, design &amp; engineering.
                </p>

                {/* List / Board toggle */}
                <div className="mt-8 flex gap-3 pb-12">
                    <Button
                        type="button"
                        onClick={() => setView("list")}
                        aria-pressed={view === "list"}
                       
                    >
                        List
                    </Button>
                    <Button
                        type="button"
                        disabled={!BOARD_ENABLED}
                        onClick={() => BOARD_ENABLED && setView("board")}
                        aria-pressed={view === "board"}
                        title={BOARD_ENABLED ? undefined : "Coming soon"}
                      
                    >
                        Board
                    </Button>
                </div>
            </div>

            {/* List view stays visible behind the board while it slides */}
            {(view === "list" || boardMounted) && <GalleryClient assets={assets} />}

            {boardMounted && (
                <>
                    {/* Navbar: fixed at the top, never moves. The board stops right below it. */}
                    <div className="fixed inset-x-0 top-0 z-[60] bg-white">
                        <Header />
                    </div>

                    {/* Green grid board: slides up from the bottom and meets the navbar */}
                    <section
                        style={{
                            top: HEADER_H,
                            backgroundImage:
                                "linear-gradient(rgba(43,114,32,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(43,114,32,0.55) 1px, transparent 1px)",
                            backgroundSize: "32px 32px",
                            backgroundPosition: "-1px -1px",
                        }}
                        className={`fixed inset-x-0 bottom-0 z-50 overflow-hidden bg-[#4a983c] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none ${
                            boardShown ? "translate-y-0" : "pointer-events-none translate-y-full"
                        }`}
                    >
                        {/* Magnets: one per project, same images as the list */}
                        <MagnetBoard
                            items={items}
                            saved={savedPositions}
                            onOpen={setOpenIndex}
                            focusRequest={focusRequest}
                        />

                        {/* Buttons row: View List + Exit (Exit on the extreme right) */}
                        <div className="absolute right-[85px] top-6 z-10 flex items-start gap-3 max-sm:right-5">
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
                                                    onClick={() => pickFromMenu(i)}
                                                    className="w-full px-4 py-3 text-left text-lg transition-colors hover:bg-[#41413d]/10"
                                                >
                                                    {asset.title}
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
                    </section>

                    {/* Same full-screen viewer as the list view, opened from a magnet.
                        No layoutId here (nothing to fly from), and a higher z-index
                        so it sits above the fixed navbar and the board. */}
                    <ProjectViewer
                        assets={assets}
                        index={openIndex}
                        onClose={() => setOpenIndex(null)}
                        onIndexChange={setOpenIndex}
                        zClass="z-[80]"
                    />
                </>
            )}
        </div>
    )
}