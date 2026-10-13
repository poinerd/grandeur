"use client"

import { useEffect, useRef } from "react"
import { MagnetField, type MagnetOptions, type MagnetShape } from "./magnet"

export type BoardItem = { id: string; label: string; image?: string }
export type SavedPositions = Record<string, { x: number; y: number; rotation: number }>

type Props = {
    items: BoardItem[]
    /** Keeps magnet positions alive between board open/close. */
    saved: React.MutableRefObject<SavedPositions>
    /** Called with the item index when a magnet is clicked (not dragged). */
    onOpen: (index: number) => void
    /** Change this to make a magnet lift and pulse so you can spot it. */
    focusRequest: { index: number; n: number } | null
    className?: string
}

const SHAPES: MagnetShape[] = ["circle", "square", "rectangle", "square", "circle", "rectangle"]
const COLORS = ["#f4f1ea", "#f15a24", "#41413d", "#f2c230", "#2f6fdb", "#e8e4da"]

// Keep the first magnets clear of the View List / Exit buttons.
const TOP_SAFE = 90

export default function MagnetBoard({ items, saved, onOpen, focusRequest, className = "" }: Props) {
    const hostRef = useRef<HTMLDivElement>(null)
    const fieldRef = useRef<MagnetField | null>(null)
    const onOpenRef = useRef(onOpen)

    useEffect(() => {
        onOpenRef.current = onOpen
    }, [onOpen])

    // Build the field and one magnet per item
    useEffect(() => {
        const host = hostRef.current
        if (!host) return

        const W = host.clientWidth
        const H = host.clientHeight
        const field = new MagnetField(host)
        fieldRef.current = field

        const n = Math.max(1, items.length)
        const usableH = Math.max(1, H - TOP_SAFE)
        // Small magnets, scaled down a little when there are many
        const unit = Math.min(120, Math.max(64, Math.sqrt((W * usableH) / (n * 3.2))))
        const cols = Math.max(1, Math.ceil(Math.sqrt((n * W) / usableH)))
        const rows = Math.ceil(n / cols)
        const cellW = W / cols
        const cellH = usableH / rows
        const jitter = (amount: number) => (Math.random() - 0.5) * amount

        items.forEach((item, i) => {
            const shape = SHAPES[i % SHAPES.length]
            const prev = saved.current[item.id]
            const col = i % cols
            const row = Math.floor(i / cols)

            const opts: MagnetOptions = {
                id: item.id,
                shape,
                image: item.image,
                color: COLORS[i % COLORS.length],
                borderWidth: 6,
                text: shape === "rectangle" ? item.label : undefined,
                x: prev?.x ?? cellW * (col + 0.5) + jitter(cellW * 0.3),
                y: prev?.y ?? TOP_SAFE + cellH * (row + 0.5) + jitter(cellH * 0.3),
                rotation: prev?.rotation ?? jitter(14),
            }
            if (shape === "rectangle") {
                opts.width = unit * 1.4
                opts.height = unit * 0.95
            } else {
                opts.size = shape === "square" ? unit * 0.95 : unit
            }
            field.addMagnet(opts)
        })

        // Tell a click apart from a drag: tiny movement, short press, same magnet
        let down: { x: number; y: number; t: number; id: string } | null = null
        const magnetOf = (e: Event) => (e.target as HTMLElement).closest<HTMLElement>("[data-magnet-id]")

        const onDown = (e: PointerEvent) => {
            const el = magnetOf(e)
            down = el ? { x: e.clientX, y: e.clientY, t: performance.now(), id: el.dataset.magnetId! } : null
        }
        const onUp = (e: PointerEvent) => {
            if (!down) return
            const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y)
            const quick = performance.now() - down.t < 500
            const sameMagnet = magnetOf(e)?.dataset.magnetId === down.id
            if (moved < 6 && quick && sameMagnet) {
                const index = items.findIndex((it) => it.id === down!.id)
                if (index >= 0) onOpenRef.current(index)
            }
            down = null
        }
        const onCancel = () => {
            down = null
        }
        host.addEventListener("pointerdown", onDown)
        host.addEventListener("pointerup", onUp)
        host.addEventListener("pointercancel", onCancel)

        return () => {
            host.removeEventListener("pointerdown", onDown)
            host.removeEventListener("pointerup", onUp)
            host.removeEventListener("pointercancel", onCancel)
            // Remember where everything was left
            field.magnets.forEach((m) => {
                saved.current[m.id] = { x: m.x, y: m.y, rotation: m.rotation }
            })
            field.destroy()
            fieldRef.current = null
        }
    }, [items, saved])

    // Highlight a magnet: bring it to the front, lift it, and ring-pulse around it
    useEffect(() => {
        if (!focusRequest) return
        const item = items[focusRequest.index]
        const host = hostRef.current
        const field = fieldRef.current
        const m = item && field?.magnets.get(item.id)
        if (!m || !host || !field) return

        let top = 0
        field.magnets.forEach((o) => {
            top = Math.max(top, Number(o.el.style.zIndex) || 0)
        })
        m.el.style.zIndex = String(top + 1)

        m.liftTarget = 1
        const drop = setTimeout(() => {
            if (!m.dragging) m.liftTarget = 0
        }, 900)

        const size = Math.max(m.hw, m.hh) * 2 + 24
        const ring = document.createElement("div")
        Object.assign(ring.style, {
            position: "absolute",
            left: `${m.x - size / 2}px`,
            top: `${m.y - size / 2}px`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            border: "3px solid #fff",
            pointerEvents: "none",
            zIndex: String(top + 2),
        } as Partial<CSSStyleDeclaration>)
        host.appendChild(ring)
        const anim = ring.animate(
            [
                { transform: "scale(0.7)", opacity: 1 },
                { transform: "scale(1.9)", opacity: 0 },
            ],
            { duration: 800, iterations: 2, easing: "ease-out" }
        )
        anim.onfinish = () => ring.remove()

        return () => {
            clearTimeout(drop)
            anim.cancel()
            ring.remove()
        }
    }, [focusRequest, items])

    return <div ref={hostRef} className={`absolute inset-0 z-0 ${className}`} />
}