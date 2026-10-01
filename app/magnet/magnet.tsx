/**
 * magnet.ts
 * ---------------------------------------------------------------------------
 * A reusable, dependency-free component for creating draggable "magnet"
 * objects that behave like real magnets: they attract/repel each other based
 * on distance and orientation, snap together when unlike poles meet, and can
 * be dragged around a surface (a container element) with the mouse or touch.
 *
 * Supports two shapes for now: "rectangle" and "circle". Each magnet is
 * configured with a color, optional text, and/or an image, and is rendered
 * with layered shadow / bevel / gloss so it reads as a physical object
 * sitting on (and lifting off) the surface rather than a flat div.
 *
 * Usage:
 *
 *   import { MagnetField } from "./magnet";
 *
 *   const field = new MagnetField(document.getElementById("surface")!);
 *
 *   field.addMagnet({ shape: "rectangle", color: "#e5484d", text: "A" });
 *   field.addMagnet({ shape: "circle", color: "#3b82f6", text: "B", x: 300, y: 200 });
 *   field.addMagnet({ shape: "circle", image: "/photos/vacation.jpg", text: "2019" });
 *
 *   field.start();
 * ---------------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type MagnetShape = "rectangle" | "circle";

export interface MagnetOptions {
  /** Unique id. Auto-generated if omitted. */
  id?: string;
  /** Visual shape of the magnet. Defaults to "rectangle". */
  shape?: MagnetShape;
  /** Primary color — the "north"-half fill, or the frame color when an image is used. */
  color?: string;
  /** Secondary color — the "south"-half fill. Defaults to a darker shade of color. */
  secondaryColor?: string;
  /** Text rendered on the magnet (centered, or as a caption strip when an image is set). */
  text?: string;
  /** Image URL or data URI. When set, it fills the magnet instead of the two-tone color fill. */
  image?: string;
  /** Width in px (rectangle) or diameter (circle). Defaults to 140 (rectangle) / 110 (circle). */
  width?: number;
  /** Height in px, rectangle only. Defaults to 70. Ignored for circles (height = width). */
  height?: number;
  /** Corner radius in px, rectangle only. Defaults to 12. */
  cornerRadius?: number;
  /** Initial x position (center) within the field. Random if omitted. */
  x?: number;
  /** Initial y position (center) within the field. Random if omitted. */
  y?: number;
  /** Initial rotation in degrees. Defaults to 0. */
  rotation?: number;
  /** Magnetic strength. Higher = pulls/pushes harder and from farther away. Defaults to 1. */
  strength?: number;
  /** If true, the magnet is bolted down: it exerts force but never moves itself. */
  fixed?: boolean;
  /** Extra class name(s) applied to the root element. */
  className?: string;
}

export interface MagnetFieldOptions {
  /** Global multiplier on attraction/repulsion strength. Defaults to 1. */
  forceScale?: number;
  /** Velocity damping per frame (0..1). Higher = stops faster. Defaults to 0.90. */
  damping?: number;
  /** Distance (px, edge-to-edge) at which unlike poles snap fully together. Defaults to 14. */
  snapDistance?: number;
  /** Whether magnets rotate to align their poles when free. Defaults to true. */
  enableTorque?: boolean;
  /** Whether magnets push apart on overlap so they don't visually intersect. Defaults to true. */
  enableCollision?: boolean;
  /** Called every time two magnets snap together. */
  onSnap?: (a: Magnet, b: Magnet) => void;
  /** Called on every animation frame with the elapsed dt in seconds. */
  onTick?: (dt: number) => void;
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function shadeColor(hex: string, percent: number): string {
  // Best-effort darken/lighten for hex colors; falls back to the input for
  // non-hex (e.g. named colors, rgb()) since we can't safely shade those.
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return hex;
  const num = parseInt(match[1], 16);
  const r = clamp((num >> 16) + Math.round(255 * percent), 0, 255);
  const g = clamp(((num >> 8) & 0x00ff) + Math.round(255 * percent), 0, 255);
  const b = clamp((num & 0x0000ff) + Math.round(255 * percent), 0, 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

let uid = 0;
function nextId(): string {
  uid += 1;
  return `magnet-${uid}`;
}

// Layered shadow/bevel presets, swapped in on drag start/end so the piece
// visibly "lifts" off the surface while held and settles back down on release.
const RESTING_SHADOW =
  "0 1px 2px rgba(0,0,0,0.20), " + // contact shadow, tight to the surface
  "0 6px 12px rgba(0,0,0,0.22), " + // ambient elevation
  "inset 0 1px 1px rgba(255,255,255,0.55), " + // top bevel highlight
  "inset 0 -3px 5px rgba(0,0,0,0.30)"; // bottom bevel shade

const LIFTED_SHADOW =
  "0 2px 4px rgba(0,0,0,0.18), " +
  "0 18px 30px rgba(0,0,0,0.32), " +
  "inset 0 1px 1px rgba(255,255,255,0.6), " +
  "inset 0 -3px 5px rgba(0,0,0,0.30)";

// ---------------------------------------------------------------------------
// Magnet
// ---------------------------------------------------------------------------

export class Magnet {
  readonly id: string;
  readonly el: HTMLDivElement;
  readonly shape: MagnetShape;
  readonly strength: number;
  readonly halfW: number;
  readonly halfH: number;
  fixed: boolean;

  x: number;
  y: number;
  vx = 0;
  vy = 0;
  rotation: number; // degrees
  angularVelocity = 0; // degrees / second

  dragging = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private lastPointerT = 0;

  private field: MagnetField;

  constructor(field: MagnetField, options: MagnetOptions) {
    this.field = field;
    this.id = options.id ?? nextId();
    this.shape = options.shape ?? "rectangle";
    this.strength = options.strength ?? 1;
    this.fixed = options.fixed ?? false;
    this.rotation = options.rotation ?? 0;

    const width = options.width ?? (this.shape === "circle" ? 110 : 140);
    const height = this.shape === "circle" ? width : options.height ?? 70;
    this.halfW = width / 2;
    this.halfH = height / 2;

    const bounds = field.container.getBoundingClientRect();
    this.x = options.x ?? Math.random() * Math.max(1, bounds.width - width) + width / 2;
    this.y = options.y ?? Math.random() * Math.max(1, bounds.height - height) + height / 2;

    this.el = this.buildElement(options, width, height);
    this.attachDragHandlers();
    this.render();
  }

  /** Unit vector pointing from this magnet's south pole to its north pole. */
  poleVector(): { x: number; y: number } {
    const rad = (this.rotation * Math.PI) / 180;
    return { x: Math.cos(rad), y: Math.sin(rad) };
  }

  private buildElement(options: MagnetOptions, width: number, height: number): HTMLDivElement {
    const el = document.createElement("div");
    el.className = ["magnet", `magnet--${this.shape}`, options.className ?? ""].join(" ").trim();
    el.dataset.magnetId = this.id;

    const radius = this.shape === "circle" ? "50%" : `${options.cornerRadius ?? 12}px`;
    const color = options.color ?? "#e5484d";
    const secondary = options.secondaryColor ?? shadeColor(color, -0.35);

    Object.assign(el.style, {
      position: "absolute",
      left: "0px",
      top: "0px",
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: radius,
      touchAction: "none",
      userSelect: "none",
      cursor: this.fixed ? "default" : "grab",
      boxShadow: RESTING_SHADOW,
      border: "1px solid rgba(0,0,0,0.18)",
      overflow: "hidden",
      transition: "box-shadow 150ms ease",
    } as Partial<CSSStyleDeclaration>);

    if (options.image) {
      el.style.background = `center/cover no-repeat url("${options.image}")`;
      // Colored frame so the magnet's "brand" color still reads even with a photo.
      el.style.border = `4px solid ${color}`;
      if (options.text) {
        const caption = document.createElement("div");
        caption.className = "magnet__caption";
        caption.textContent = options.text;
        Object.assign(caption.style, {
          position: "absolute",
          left: "0",
          right: "0",
          bottom: "0",
          padding: "4px 8px",
          fontSize: "12px",
          fontWeight: "600",
          fontFamily: "system-ui, sans-serif",
          color: "#fff",
          background: "linear-gradient(0deg, rgba(0,0,0,0.65), rgba(0,0,0,0))",
          pointerEvents: "none",
        } as Partial<CSSStyleDeclaration>);
        el.appendChild(caption);
      }
    } else {
      // Two-tone pole fill, split along the magnet's long axis — the classic
      // painted look of a real bar/disc magnet, doubling as a visual cue for
      // which end is "north" vs "south" once it starts interacting.
      el.style.background = `linear-gradient(90deg, ${color} 0 50%, ${secondary} 50% 100%)`;

      if (options.text) {
        const label = document.createElement("div");
        label.className = "magnet__label";
        label.textContent = options.text;
        Object.assign(label.style, {
          position: "absolute",
          inset: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          fontWeight: "700",
          fontSize: "14px",
          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          pointerEvents: "none",
        } as Partial<CSSStyleDeclaration>);
        el.appendChild(label);
      }
    }

    // North-pole indicator: a small pale dot near one edge so orientation is
    // still legible at a glance, independent of color/image choice.
    const poleDot = document.createElement("div");
    Object.assign(poleDot.style, {
      position: "absolute",
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.85)",
      boxShadow: "0 0 2px rgba(0,0,0,0.4)",
      top: "50%",
      right: "6px",
      transform: "translateY(-50%)",
      pointerEvents: "none",
    } as Partial<CSSStyleDeclaration>);
    el.appendChild(poleDot);

    // Gloss overlay: a soft diagonal highlight to suggest a curved / glossy
    // plastic surface catching light from the upper-left.
    const gloss = document.createElement("div");
    Object.assign(gloss.style, {
      position: "absolute",
      inset: "0",
      background:
        "linear-gradient(155deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.16) 22%, rgba(255,255,255,0) 48%)",
      pointerEvents: "none",
    } as Partial<CSSStyleDeclaration>);
    el.appendChild(gloss);

    return el;
  }

  private attachDragHandlers(): void {
    if (this.fixed) return;

    const onPointerDown = (e: PointerEvent) => {
      this.dragging = true;
      this.vx = 0;
      this.vy = 0;
      this.angularVelocity = 0;
      this.el.style.cursor = "grabbing";
      this.el.style.boxShadow = LIFTED_SHADOW;
      this.el.setPointerCapture(e.pointerId);
      const bounds = this.field.container.getBoundingClientRect();
      const px = e.clientX - bounds.left;
      const py = e.clientY - bounds.top;
      this.dragOffsetX = px - this.x;
      this.dragOffsetY = py - this.y;
      this.lastPointerX = px;
      this.lastPointerY = py;
      this.lastPointerT = performance.now();
      this.field.bringToFront(this);
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!this.dragging) return;
      const bounds = this.field.container.getBoundingClientRect();
      const px = e.clientX - bounds.left;
      const py = e.clientY - bounds.top;
      const now = performance.now();
      const dt = Math.max(1, now - this.lastPointerT) / 1000;

      this.vx = (px - this.lastPointerX) / dt;
      this.vy = (py - this.lastPointerY) / dt;

      this.x = px - this.dragOffsetX;
      this.y = py - this.dragOffsetY;

      this.lastPointerX = px;
      this.lastPointerY = py;
      this.lastPointerT = now;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!this.dragging) return;
      this.dragging = false;
      this.el.style.cursor = "grab";
      this.el.style.boxShadow = RESTING_SHADOW;
      try {
        this.el.releasePointerCapture(e.pointerId);
      } catch {
        /* no-op */
      }
      // Cap release velocity so a fast fling doesn't send it off to infinity.
      const maxV = 1800;
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > maxV) {
        this.vx = (this.vx / speed) * maxV;
        this.vy = (this.vy / speed) * maxV;
      }
    };

    this.el.addEventListener("pointerdown", onPointerDown);
    this.el.addEventListener("pointermove", onPointerMove);
    this.el.addEventListener("pointerup", onPointerUp);
    this.el.addEventListener("pointercancel", onPointerUp);
  }

  /** Writes current x/y/rotation to the DOM. Call after mutating state. */
  render(): void {
    const lift = this.dragging ? 1.04 : 1;
    this.el.style.transform =
      `translate(${this.x - this.halfW}px, ${this.y - this.halfH}px) ` +
      `rotate(${this.rotation}deg) scale(${lift})`;
    this.el.style.transformOrigin = `${this.halfW}px ${this.halfH}px`;
  }

  destroy(): void {
    this.el.remove();
  }
}

// ---------------------------------------------------------------------------
// MagnetField — owns the physics loop and the collection of magnets
// ---------------------------------------------------------------------------

export class MagnetField {
  readonly container: HTMLElement;
  readonly magnets = new Map<string, Magnet>();

  private forceScale: number;
  private damping: number;
  private snapDistance: number;
  private enableTorque: boolean;
  private enableCollision: boolean;
  private onSnap?: (a: Magnet, b: Magnet) => void;
  private onTick?: (dt: number) => void;

  private rafId: number | null = null;
  private lastT = 0;
  private zCounter = 1;

  constructor(container: HTMLElement, options: MagnetFieldOptions = {}) {
    this.container = container;
    this.forceScale = options.forceScale ?? 1;
    this.damping = options.damping ?? 0.9;
    this.snapDistance = options.snapDistance ?? 14;
    this.enableTorque = options.enableTorque ?? true;
    this.enableCollision = options.enableCollision ?? true;
    this.onSnap = options.onSnap;
    this.onTick = options.onTick;

    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    container.style.overflow = container.style.overflow || "hidden";
  }

  /** Creates a magnet, mounts it in the container, and returns it. */
  addMagnet(options: MagnetOptions = {}): Magnet {
    const magnet = new Magnet(this, options);
    magnet.el.style.zIndex = String(this.zCounter++);
    this.container.appendChild(magnet.el);
    this.magnets.set(magnet.id, magnet);
    return magnet;
  }

  removeMagnet(id: string): void {
    const magnet = this.magnets.get(id);
    if (!magnet) return;
    magnet.destroy();
    this.magnets.delete(id);
  }

  bringToFront(magnet: Magnet): void {
    magnet.el.style.zIndex = String(this.zCounter++);
  }

  start(): void {
    if (this.rafId != null) return;
    this.lastT = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - this.lastT) / 1000); // clamp to avoid big jumps on tab switch
      this.lastT = t;
      this.step(dt);
      this.onTick?.(dt);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop(): void {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy(): void {
    this.stop();
    for (const magnet of this.magnets.values()) magnet.destroy();
    this.magnets.clear();
  }

  // -------------------------------------------------------------------------
  // Physics
  // -------------------------------------------------------------------------

  private step(dt: number): void {
    if (dt <= 0) return;
    const list = Array.from(this.magnets.values());

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        this.interact(list[i], list[j], dt);
      }
    }

    const bounds = this.container.getBoundingClientRect();
    for (const magnet of list) {
      if (magnet.dragging || magnet.fixed) continue;

      // integrate velocity
      magnet.vx *= Math.pow(this.damping, dt * 60);
      magnet.vy *= Math.pow(this.damping, dt * 60);
      magnet.angularVelocity *= Math.pow(this.damping, dt * 60);

      magnet.x += magnet.vx * dt;
      magnet.y += magnet.vy * dt;
      magnet.rotation += magnet.angularVelocity * dt;

      // keep the magnet on the surface (bounce softly off edges)
      const minX = magnet.halfW;
      const maxX = bounds.width - magnet.halfW;
      const minY = magnet.halfH;
      const maxY = bounds.height - magnet.halfH;

      if (magnet.x < minX) {
        magnet.x = minX;
        magnet.vx *= -0.4;
      } else if (magnet.x > maxX) {
        magnet.x = maxX;
        magnet.vx *= -0.4;
      }
      if (magnet.y < minY) {
        magnet.y = minY;
        magnet.vy *= -0.4;
      } else if (magnet.y > maxY) {
        magnet.y = maxY;
        magnet.vy *= -0.4;
      }

      magnet.render();
    }

    for (const magnet of list) {
      if (magnet.dragging) magnet.render();
    }
  }

  /** Computes and applies the pairwise magnetic interaction between a and b. */
  private interact(a: Magnet, b: Magnet, dt: number): void {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.max(8, Math.hypot(dx, dy));
    const nx = dx / dist;
    const ny = dy / dist;

    // Orientation term: +1 when poles are aligned N-to-N (like, repel),
    // -1 when opposed (unlike, attract). Derived from each magnet's pole
    // vector dotted with the line connecting them, which lets magnets swing
    // toward the orientation that attracts, just like real magnets.
    const pa = a.poleVector();
    const pb = b.poleVector();
    const alignment = pa.x * pb.x + pa.y * pb.y; // 1 aligned, -1 opposed

    const strength = a.strength * b.strength * this.forceScale;
    const falloff = 1 / (dist * dist);
    // Positive = attract (pulls a toward b), negative = repel.
    const magnitude = strength * falloff * -alignment * 40000;

    const fx = nx * magnitude;
    const fy = ny * magnitude;

    if (!a.fixed && !a.dragging) {
      a.vx += fx * dt;
      a.vy += fy * dt;
    }
    if (!b.fixed && !b.dragging) {
      b.vx -= fx * dt;
      b.vy -= fy * dt;
    }

    // Torque: rotate each magnet a little toward the orientation that would
    // attract its neighbor, so free magnets visibly "seek" alignment.
    if (this.enableTorque && dist < 260) {
      const desiredA = Math.atan2(dy, dx); // pointing from a toward b = attract if a's N faces b
      const desiredB = Math.atan2(-dy, -dx);
      if (!a.fixed && !a.dragging) {
        a.angularVelocity += angularDelta(a.rotation, desiredA) * 40 * dt;
      }
      if (!b.fixed && !b.dragging) {
        b.angularVelocity += angularDelta(b.rotation, desiredB) * 40 * dt;
      }
    }

    // Collision: keep bodies from overlapping once they're close.
    const minGap = a.halfW + b.halfW;
    if (this.enableCollision && dist < minGap) {
      const overlap = minGap - dist;
      const push = overlap / 2;
      if (!a.dragging && !a.fixed) {
        a.x -= nx * push;
        a.y -= ny * push;
      }
      if (!b.dragging && !b.fixed) {
        b.x += nx * push;
        b.y += ny * push;
      }
    }

    // Snap: once unlike poles are within snapDistance edge-to-edge, lock
    // them together (position + rotation) and fire the onSnap callback.
    const edgeGap = dist - minGap;
    if (alignment < -0.6 && edgeGap < this.snapDistance && edgeGap > -4) {
      if (!a.dragging && !b.dragging) {
        const targetRotB = a.rotation + 180;
        b.rotation += angularDelta(b.rotation, (targetRotB * Math.PI) / 180);
        const targetX = a.x + Math.cos((a.rotation * Math.PI) / 180) * minGap;
        const targetY = a.y + Math.sin((a.rotation * Math.PI) / 180) * minGap;
        if (!b.fixed) {
          b.x += (targetX - b.x) * 0.3;
          b.y += (targetY - b.y) * 0.3;
        }
        this.onSnap?.(a, b);
      }
    }
  }
}

/** Shortest signed angular difference (radians) from `fromDeg` to target radians, returned in degrees/sec-ready units. */
function angularDelta(fromDeg: number, toRad: number): number {
  const fromRad = (fromDeg * Math.PI) / 180;
  let diff = toRad - fromRad;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return (diff * 180) / Math.PI;
}