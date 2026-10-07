"use client"

import { useState } from "react"
import Header from "../components/Header"
import GalleryClient, { type Asset } from "./GalleryClient"

type View = "list" | "board"

export default function MatterClient({ assets }: { assets: Asset[] }) {
    const [view, setView] = useState<View>("board")

    return(
        <div className="min-h-screen bg-[#ffffff] text-[#41413d]">
           <Header/>
           <div className="px-5 pt-6 sm:px-9 sm:pt-10">
            <h1 className="text-6xl font-medium leading-[0.98] tracking-[-0.04em] text-[#41413d] sm:text-9xl"> Matter.lab</h1>
            <p>Matter.lab is an experimental studio & playground for making things at the intersection of art, design & engineering.
Industrial design, code , brands, illustrations, weird little experiments — whatever feels worth making.
No rules. Just make stuff.
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

           {/* Green dotted board */}
           {view === "board" && (
            <section
                className="relative h-[1080px] w-full overflow-hidden bg-[#4a983c]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #3fdc2a 4px, transparent 4.5px)",
                    backgroundSize: "39px 47px",
                    backgroundPosition: "20px 24px",
                }}
            >
                <button
                    type="button"
                    onClick={() => setView("list")}
                    className="absolute right-[85px] top-[70px] flex items-center gap-3 rounded-lg bg-[#41413d] px-[18px] py-[14px] text-xl text-white transition-colors hover:bg-[#2f2f2c] max-sm:right-5"
                >
                    View List
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 10.5L8 5.5L13 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Magnets go here later */}
            </section>
           )}

           {/* List view: the gallery (masonry grid + fullscreen viewer) */}
           {view === "list" && <GalleryClient assets={assets} />}
            
        </div>
    )
    
}
