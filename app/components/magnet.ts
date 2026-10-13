/**
 * magnet.ts
 * ---------------------------------------------------------------------------
 * Fridge-magnet library. Dependency-free.
 *
 * - Magnets stick to the surface: when you let go they stay where you put them
 *   (heavy friction, no endless drifting).
 * - Drag them with mouse or touch. They lift off the surface while held.
 * - Shapes: "circle" | "square" | "rectangle", each with a colored border
 *   (frame) around an inner shape that can hold an image.
 * - Nearby magnets attract each other and snap edge-to-edge. Dragging one
 *   magnet carries along everything stuck to it.
 * - Lighting: one light source above the surface. Gloss, rim bevel, inner
 *   well shadow and drop shadow all respond to it, so highlights and
 *   shadows stay consistent even when a magnet is rotated.
 * ---------------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MagnetShape = "circle" | "square" | "rectangle";

export interface MagnetOptions {
  id?: string;
  /** "circle" | "square" | "rectangle". Defaults to "rectangle". */
  shape?: MagnetShape;
  /** Image URL or data URI shown inside the inner shape. */
  image?: string;
  /** Border (frame) color. Any CSS color. Defaults to "#f4f1ea". */
  color?: string;
  /** Inner fill color shown when there is no image (or while it loads). */
  innerColor?: string;
  /** Border thickness in px. Defaults to 8. */
  borderWidth?: number;
  /** Diameter (circle) or side length (square). Defaults to 120. */
  size?: number;
  /** Rectangle only. Defaults to 170. */
  width?: number;
  /** Rectangle only. Defaults to 115. */
  height?: number;
  /** Outer corner radius for square/rectangle. Defaults to 14. */
  cornerRadius?: number;
  /** Optional caption on a gradient strip at the bottom of the image. */
  text?: string;
  /** Initial center x within the field. Random if omitted. */
  x?: number;
  /** Initial center y within the field. Random if omitted. */
  y?: number;
  /** Initial rotation in degrees. Defaults to 0. */
  rotation?: number;
  /** Magnetic strength multiplier. Defaults to 1. */
  strength?: number;
  /** Bolted to the surface: attracts others but never moves or drags. */
  fixed?: boolean;
  className?: string;
}

export interface MagnetFieldOptions {
  /** How quickly motion dies after release (higher = stops sooner). Defaults to 9. */
  friction?: number;
  /** Edge gap (px) within which magnets snap together. Defaults to 10. */
  snapDistance?: number;
  /** Edge gap (px) within which magnets start pulling toward each other. Defaults to 70. */
  range?: number;
  /** Global attraction multiplier. Defaults to 1. */
  attraction?: number;
  /** Square/rectangle magnets rotate to sit flush against what they touch. Defaults to true. */
  alignFaces?: boolean;
  /** Dragging a magnet also carries the magnets stuck to it. Defaults to true. */
  groupDrag?: boolean;
  /** Max throw speed on release, px/s. Defaults to 1400. */
  maxThrow?: number;
  /**
   * Light position as a fraction of the field size. Default {x: 0.2, y: -0.4}
   * (up and to the left, slightly above the surface), so shadows fall down-right.
   */
  light?: { x: number; y: number };
  /** Start the animation loop immediately. Defaults to true. */
  autoStart?: boolean;
  /** Fired when two magnets newly stick together. */
  onSnap?: (a: Magnet, b: Magnet) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DEG = Math.PI / 180;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function rotateVec(x: number, y: number, deg: number) {
  const r = deg * DEG;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return { x: x * c - y * s, y: x * s + y * c };
}

/** Signed shortest difference (degrees) from `from` to `to`. */
function angleDiff(from: number, to: number): number {
  let d = (to - from) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

let uid = 0;
const nextId = () => `magnet-${++uid}`;

// ---------------------------------------------------------------------------
// Magnet
// ---------------------------------------------------------------------------

export class Magnet {
  readonly id: string;
  readonly el: HTMLDivElement;
  readonly shape: MagnetShape;
  readonly isCircle: boolean;
  readonly strength: number;
  readonly hw: number; // half width
  readonly hh: number; // half height
  fixed: boolean;

  x: number;
  y: number;
  vx = 0;
  vy = 0;
  rotation: number;

  dragging = false;
  /** True while this magnet moves rigidly as part of a drag group. */
  inDragGroup = false;
  lift = 0; // 0 = flat on the surface, 1 = fully lifted
  liftTarget = 0;

  private body!: HTMLDivElement;
  private rim!: HTMLDivElement;
  private well!: HTMLDivElement;
  private gloss!: HTMLDivElement;
  private lastKey = "";
  private radiusPx: number;
  private borderWidth: number;

  constructor(field: MagnetField, o: MagnetOptions) {
    this.id = o.id ?? nextId();
    this.shape = o.shape ?? "rectangle";
    this.isCircle = this.shape === "circle";
    this.strength = o.strength ?? 1;
    this.fixed = o.fixed ?? false;
    this.rotation = o.rotation ?? 0;
    this.borderWidth = o.borderWidth ?? 8;

    let w: number;
    let h: number;
    if (this.shape === "rectangle") {
      w = o.width ?? 170;
      h = o.height ?? 115;
    } else {
      w = h = o.size ?? 120;
    }
    this.hw = w / 2;
    this.hh = h / 2;
    this.radiusPx = o.cornerRadius ?? 14;

    const cw = field.container.clientWidth;
    const ch = field.container.clientHeight;
    this.x = o.x ?? this.extentX() + Math.random() * Math.max(1, cw - this.extentX() * 2);
    this.y = o.y ?? this.extentY() + Math.random() * Math.max(1, ch - this.extentY() * 2);

    this.el = this.build(o, w, h);
    field.attachDrag(this);
  }

  /** Half-extent along x of the (rotated) shape's bounding box. */
  extentX(): number {
    if (this.isCircle) return this.hw;
    const r = this.rotation * DEG;
    return this.hw * Math.abs(Math.cos(r)) + this.hh * Math.abs(Math.sin(r));
  }

  extentY(): number {
    if (this.isCircle) return this.hh;
    const r = this.rotation * DEG;
    return this.hw * Math.abs(Math.sin(r)) + this.hh * Math.abs(Math.cos(r));
  }

  private build(o: MagnetOptions, w: number, h: number): HTMLDivElement {
    const color = o.color ?? "#f4f1ea";
    const bw = this.borderWidth;
    const outerRadius = this.isCircle ? "50%" : `${this.radiusPx}px`;
    const innerRadius = this.isCircle ? "50%" : `${Math.max(0, this.radiusPx - bw)}px`;
    const abs = { position: "absolute" } as const;

    // Wrapper: translated only (never rotated), so the drop-shadow filter
    // applied here always falls the same way, whatever the magnet's rotation.
    const el = document.createElement("div");
    el.className = ["magnet", `magnet--${this.shape}`, o.className ?? ""].join(" ").trim();
    el.dataset.magnetId = this.id;
    Object.assign(el.style, {
      ...abs,
      left: "0px",
      top: "0px",
      width: `${w}px`,
      height: `${h}px`,
      touchAction: "none",
      userSelect: "none",
      webkitUserSelect: "none",
      cursor: this.fixed ? "default" : "grab",
      willChange: "transform, filter",
    } as Partial<CSSStyleDeclaration>);

    // Body: rotates and scales. This is the frame.
    const body = document.createElement("div");
    Object.assign(body.style, {
      ...abs,
      inset: "0",
      borderRadius: outerRadius,
      background: color,
      overflow: "hidden",
    } as Partial<CSSStyleDeclaration>);

    // Inner shape: holds the image, recessed inside the frame.
    const inner = document.createElement("div");
    Object.assign(inner.style, {
      ...abs,
      inset: `${bw}px`,
      borderRadius: innerRadius,
      overflow: "hidden",
      background: o.innerColor ?? "#d9d6ce",
    } as Partial<CSSStyleDeclaration>);

    if (o.image) {
      const photo = document.createElement("div");
      Object.assign(photo.style, {
        ...abs,
        inset: "0",
        backgroundImage: `url("${o.image.replace(/"/g, '\\"')}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } as Partial<CSSStyleDeclaration>);
      inner.appendChild(photo);
    }

    if (o.text) {
      const caption = document.createElement("div");
      caption.textContent = o.text;
      Object.assign(caption.style, {
        ...abs,
        left: "0",
        right: "0",
        bottom: "0",
        padding: "14px 10px 7px",
        textAlign: "center",
        font: "600 12px/1.2 system-ui, sans-serif",
        color: "#fff",
        textShadow: "0 1px 2px rgba(0,0,0,0.6)",
        background: "linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0))",
        pointerEvents: "none",
      } as Partial<CSSStyleDeclaration>);
      inner.appendChild(caption);
    }

    // Well: inset shadow so the image looks set into the frame.
    // Offsets are recomputed on every render so the shadow stays on the
    // light side regardless of rotation.
    const well = document.createElement("div");
    Object.assign(well.style, {
      ...abs,
      inset: "0",
      borderRadius: "inherit",
      pointerEvents: "none",
    } as Partial<CSSStyleDeclaration>);
    inner.appendChild(well);

    // Rim: bevel highlight/shade on the frame itself (same idea).
    const rim = document.createElement("div");
    Object.assign(rim.style, {
      ...abs,
      inset: "0",
      borderRadius: outerRadius,
      pointerEvents: "none",
    } as Partial<CSSStyleDeclaration>);

    // Gloss: oversized, counter-rotated every frame so the sheen and the
    // specular hotspot stay locked to the world light, not the magnet.
    // It sits above the image, like a glossy coating over a printed photo.
    const gloss = document.createElement("div");
    Object.assign(gloss.style, {
      ...abs,
      inset: "-50%",
      pointerEvents: "none",
    } as Partial<CSSStyleDeclaration>);

    body.appendChild(inner);
    body.appendChild(rim);
    body.appendChild(gloss);
    el.appendChild(body);

    this.body = body;
    this.rim = rim;
    this.well = well;
    this.gloss = gloss;
    return el;
  }

  /** Pushes current state (position, rotation, lift, lighting) to the DOM. */
  render(light: { x: number; y: number }): void {
    const key = `${this.x.toFixed(2)}|${this.y.toFixed(2)}|${this.rotation.toFixed(2)}|${this.lift.toFixed(3)}`;
    if (key === this.lastKey) return;
    this.lastKey = key;

    const lift = this.lift;

    // Direction from magnet toward the light (screen space).
    let lx = light.x - this.x;
    let ly = light.y - this.y;
    const len = Math.hypot(lx, ly) || 1;
    lx /= len;
    ly /= len;

    // Position and tilt/scale
    this.el.style.transform = `translate(${this.x - this.hw}px, ${this.y - this.hh}px)`;
    this.body.style.transform = `rotate(${this.rotation}deg) scale(${1 + lift * 0.06})`;

    // Drop shadow: thin and tight at rest, long and soft when lifted.
    const off = 1.5 + lift * 10;
    const blur = 1.5 + lift * 11;
    const sx = -lx * off;
    const sy = Math.max(0.5, -ly * off);
    this.el.style.filter =
      `drop-shadow(${(sx * 0.3).toFixed(2)}px ${(sy * 0.3 + 0.5).toFixed(2)}px 0.8px rgba(0,0,0,0.55)) ` +
      `drop-shadow(${sx.toFixed(2)}px ${sy.toFixed(2)}px ${blur.toFixed(2)}px rgba(0,0,0,${(0.34 - lift * 0.06).toFixed(2)}))`;

    // Rim bevel and well shadow, offsets rotated back into screen space.
    const hl = rotateVec(lx, ly, -this.rotation); // toward light, in local space
    const bx = hl.x * 1.6;
    const by = hl.y * 1.6;
    this.rim.style.boxShadow =
      `inset ${bx.toFixed(2)}px ${by.toFixed(2)}px 1px rgba(255,255,255,0.65), ` +
      `inset ${(-bx * 1.4).toFixed(2)}px ${(-by * 1.4).toFixed(2)}px 3px rgba(0,0,0,0.38), ` +
      `inset 0 0 0 1px rgba(0,0,0,0.22)`;

    const wx = hl.x * 3.5;
    const wy = hl.y * 3.5;
    this.well.style.boxShadow =
      `inset ${wx.toFixed(2)}px ${wy.toFixed(2)}px 6px rgba(0,0,0,0.55), ` +
      `inset ${(-wx * 0.35).toFixed(2)}px ${(-wy * 0.35).toFixed(2)}px 3px rgba(255,255,255,0.18), ` +
      `inset 0 0 0 1px rgba(0,0,0,0.3)`;

    // Gloss layer: counter-rotate, then place the specular hotspot toward the light.
    const hx = 50 + lx * 16;
    const hy = 50 + ly * 16;
    this.gloss.style.transform = `rotate(${-this.rotation}deg)`;
    this.gloss.style.background =
      `radial-gradient(ellipse 34% 26% at ${hx.toFixed(1)}% ${hy.toFixed(1)}%, ` +
      `rgba(255,255,255,${(0.42 + lift * 0.1).toFixed(2)}), rgba(255,255,255,0) 100%), ` +
      `linear-gradient(135deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.08) 32%, ` +
      `rgba(255,255,255,0) 50%, rgba(0,0,0,0.20) 100%)`;
  }

  destroy(): void {
    this.el.remove();
  }
}

// ---------------------------------------------------------------------------
// Contact geometry (circle / oriented box)
// ---------------------------------------------------------------------------

interface Contact {
  /** Edge-to-edge gap. Negative when overlapping. */
  gap: number;
  /** Unit normal pointing from a toward b. */
  nx: number;
  ny: number;
}

function circleVsBox(circle: Magnet, box: Magnet): Contact {
  // Returns normal pointing from box toward circle.
  const r = box.rotation * DEG;
  const ux = Math.cos(r);
  const uy = Math.sin(r);
  const vx = -uy;
  const vy = ux;
  const relx = circle.x - box.x;
  const rely = circle.y - box.y;
  const lx = relx * ux + rely * uy;
  const ly = relx * vx + rely * vy;
  const cx = clamp(lx, -box.hw, box.hw);
  const cy = clamp(ly, -box.hh, box.hh);
  const dx = lx - cx;
  const dy = ly - cy;
  const d = Math.hypot(dx, dy);

  let nlx: number;
  let nly: number;
  let gap: number;
  if (d > 1e-6) {
    nlx = dx / d;
    nly = dy / d;
    gap = d - circle.hw;
  } else {
    // Circle center is inside the box: exit through the nearest face.
    const fx = box.hw - Math.abs(lx);
    const fy = box.hh - Math.abs(ly);
    if (fx < fy) {
      nlx = Math.sign(lx) || 1;
      nly = 0;
      gap = -fx - circle.hw;
    } else {
      nlx = 0;
      nly = Math.sign(ly) || 1;
      gap = -fy - circle.hw;
    }
  }
  return { gap, nx: nlx * ux + nly * vx, ny: nlx * uy + nly * vy };
}

function contact(a: Magnet, b: Magnet): Contact {
  if (a.isCircle && b.isCircle) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.hypot(dx, dy) || 1e-4;
    return { gap: d - a.hw - b.hw, nx: dx / d, ny: dy / d };
  }
  if (a.isCircle !== b.isCircle) {
    const circleIsA = a.isCircle;
    const c = circleIsA ? circleVsBox(a, b) : circleVsBox(b, a);
    return circleIsA ? { gap: c.gap, nx: -c.nx, ny: -c.ny } : c;
  }

  // Box vs box: separating axis test, keeping the axis with the largest gap
  // (least penetration if overlapping).
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const ra = a.rotation * DEG;
  const rb = b.rotation * DEG;
  const uax = Math.cos(ra);
  const uay = Math.sin(ra);
  const ubx = Math.cos(rb);
  const uby = Math.sin(rb);
  const axes: [number, number][] = [
    [uax, uay],
    [-uay, uax],
    [ubx, uby],
    [-uby, ubx],
  ];
  let best = -Infinity;
  let bnx = 1;
  let bny = 0;
  for (const [nx, ny] of axes) {
    const d = dx * nx + dy * ny;
    const radA = a.hw * Math.abs(nx * uax + ny * uay) + a.hh * Math.abs(nx * -uay + ny * uax);
    const radB = b.hw * Math.abs(nx * ubx + ny * uby) + b.hh * Math.abs(nx * -uby + ny * ubx);
    const gap = Math.abs(d) - radA - radB;
    if (gap > best) {
      best = gap;
      const s = d >= 0 ? 1 : -1;
      bnx = nx * s;
      bny = ny * s;
    }
  }
  return { gap: best, nx: bnx, ny: bny };
}

// ---------------------------------------------------------------------------
// MagnetField
// ---------------------------------------------------------------------------

interface DragState {
  lead: Magnet;
  pointerId: number;
  members: { m: Magnet; x0: number; y0: number }[];
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  lastT: number;
  vx: number;
  vy: number;
}

export class MagnetField {
  readonly container: HTMLElement;
  readonly magnets = new Map<string, Magnet>();

  private friction: number;
  private snapDistance: number;
  private range: number;
  private attraction: number;
  private alignFaces: boolean;
  private groupDrag: boolean;
  private maxThrow: number;
  private light: { x: number; y: number };
  private onSnap?: (a: Magnet, b: Magnet) => void;

  private rafId: number | null = null;
  private lastT = 0;
  private z = 1;
  private drag: DragState | null = null;
  private stuck = new Set<string>();

  constructor(container: HTMLElement, o: MagnetFieldOptions = {}) {
    this.container = container;
    this.friction = o.friction ?? 9;
    this.snapDistance = o.snapDistance ?? 10;
    this.range = o.range ?? 70;
    this.attraction = o.attraction ?? 1;
    this.alignFaces = o.alignFaces ?? true;
    this.groupDrag = o.groupDrag ?? true;
    this.maxThrow = o.maxThrow ?? 1400;
    this.light = o.light ?? { x: 0.2, y: -0.4 };
    this.onSnap = o.onSnap;

    if (getComputedStyle(container).position === "static") container.style.position = "relative";
    if (!container.style.overflow) container.style.overflow = "hidden";

    if (o.autoStart ?? true) this.start();
  }

  addMagnet(options: MagnetOptions = {}): Magnet {
    const m = new Magnet(this, options);
    m.el.style.zIndex = String(this.z++);
    this.container.appendChild(m.el);
    this.magnets.set(m.id, m);
    m.render(this.lightPx());
    return m;
  }

  removeMagnet(id: string): void {
    const m = this.magnets.get(id);
    if (!m) return;
    m.destroy();
    this.magnets.delete(id);
  }

  start(): void {
    if (this.rafId != null) return;
    this.lastT = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - this.lastT) / 1000);
      this.lastT = t;
      this.step(dt);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop(): void {
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  destroy(): void {
    this.stop();
    for (const m of this.magnets.values()) m.destroy();
    this.magnets.clear();
  }

  // -------------------------------------------------------------------------
  // Dragging
  // -------------------------------------------------------------------------

  /** @internal Called by Magnet to wire up pointer handling. */
  attachDrag(m: Magnet): void {
    if (m.fixed) return;
    const el = m.el;

    el.addEventListener("pointerdown", (e: PointerEvent) => {
      if (this.drag) return;
      const p = this.local(e);
      const members = this.collectGroup(m);

      this.drag = {
        lead: m,
        pointerId: e.pointerId,
        members: members.map((g) => ({ m: g, x0: g.x, y0: g.y })),
        startX: p.x,
        startY: p.y,
        lastX: p.x,
        lastY: p.y,
        lastT: performance.now(),
        vx: 0,
        vy: 0,
      };

      for (const g of members) {
        g.vx = 0;
        g.vy = 0;
        g.inDragGroup = true;
        g.liftTarget = g === m ? 1 : 0.6;
      }
      m.dragging = true;
      m.el.style.cursor = "grabbing";
      m.el.style.zIndex = String(this.z++);
      for (const g of members) if (g !== m) g.el.style.zIndex = String(this.z++);
      m.el.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    el.addEventListener("pointermove", (e: PointerEvent) => {
      const d = this.drag;
      if (!d || d.lead !== m || e.pointerId !== d.pointerId) return;
      const p = this.local(e);
      const now = performance.now();
      const dt = Math.max(1, now - d.lastT) / 1000;

      // Keep the whole group inside the surface.
      const W = this.container.clientWidth;
      const H = this.container.clientHeight;
      let minDx = -Infinity;
      let maxDx = Infinity;
      let minDy = -Infinity;
      let maxDy = Infinity;
      for (const { m: g, x0, y0 } of d.members) {
        minDx = Math.max(minDx, g.extentX() - x0);
        maxDx = Math.min(maxDx, W - g.extentX() - x0);
        minDy = Math.max(minDy, g.extentY() - y0);
        maxDy = Math.min(maxDy, H - g.extentY() - y0);
      }
      let dx = p.x - d.startX;
      let dy = p.y - d.startY;
      if (minDx <= maxDx) dx = clamp(dx, minDx, maxDx);
      if (minDy <= maxDy) dy = clamp(dy, minDy, maxDy);
      for (const { m: g, x0, y0 } of d.members) {
        g.x = x0 + dx;
        g.y = y0 + dy;
      }

      d.vx += ((p.x - d.lastX) / dt - d.vx) * 0.5;
      d.vy += ((p.y - d.lastY) / dt - d.vy) * 0.5;
      d.lastX = p.x;
      d.lastY = p.y;
      d.lastT = now;
    });

    const end = (e: PointerEvent) => {
      const d = this.drag;
      if (!d || d.lead !== m || e.pointerId !== d.pointerId) return;
      this.drag = null;
      m.dragging = false;
      m.el.style.cursor = "grab";
      try {
        m.el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }

      // A small throw. Friction stops it quickly, like a magnet on a fridge door.
      let vx = d.vx;
      let vy = d.vy;
      // Ignore stale velocity if the pointer paused before release.
      if (performance.now() - d.lastT > 80) vx = vy = 0;
      const speed = Math.hypot(vx, vy);
      if (speed > this.maxThrow) {
        vx = (vx / speed) * this.maxThrow;
        vy = (vy / speed) * this.maxThrow;
      }
      for (const { m: g } of d.members) {
        g.inDragGroup = false;
        g.liftTarget = 0;
        g.vx = vx;
        g.vy = vy;
      }
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  /** The dragged magnet plus every free magnet currently stuck to it. */
  private collectGroup(lead: Magnet): Magnet[] {
    if (!this.groupDrag) return [lead];
    const all = Array.from(this.magnets.values()).filter((g) => !g.fixed);
    const seen = new Set<Magnet>([lead]);
    const queue = [lead];
    while (queue.length) {
      const cur = queue.pop()!;
      for (const other of all) {
        if (seen.has(other)) continue;
        if (contact(cur, other).gap < this.snapDistance + 2) {
          seen.add(other);
          queue.push(other);
        }
      }
    }
    return Array.from(seen);
  }

  private local(e: PointerEvent) {
    const r = this.container.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  // -------------------------------------------------------------------------
  // Simulation
  // -------------------------------------------------------------------------

  private lightPx() {
    return {
      x: this.container.clientWidth * this.light.x,
      y: this.container.clientHeight * this.light.y,
    };
  }

  private movable(m: Magnet): boolean {
    return !m.fixed && !m.inDragGroup;
  }

  private step(dt: number): void {
    if (dt <= 0) return;
    const list = Array.from(this.magnets.values());
    const drag = Math.exp(-this.friction * dt);

    // Free motion (only the tail end of a throw), with heavy friction.
    for (const m of list) {
      if (!this.movable(m)) continue;
      m.vx *= drag;
      m.vy *= drag;
      if (Math.abs(m.vx) < 0.5 && Math.abs(m.vy) < 0.5) {
        m.vx = 0;
        m.vy = 0;
      }
      m.x += m.vx * dt;
      m.y += m.vy * dt;
    }

    // Magnetic attraction, snapping and overlap resolution.
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        this.interact(list[i], list[j], dt);
      }
    }

    // Keep free magnets on the surface.
    const W = this.container.clientWidth;
    const H = this.container.clientHeight;
    for (const m of list) {
      if (!this.movable(m)) continue;
      const ex = m.extentX();
      const ey = m.extentY();
      if (W > ex * 2) {
        if (m.x < ex) {
          m.x = ex;
          m.vx = Math.abs(m.vx) * 0.3;
        } else if (m.x > W - ex) {
          m.x = W - ex;
          m.vx = -Math.abs(m.vx) * 0.3;
        }
      }
      if (H > ey * 2) {
        if (m.y < ey) {
          m.y = ey;
          m.vy = Math.abs(m.vy) * 0.3;
        } else if (m.y > H - ey) {
          m.y = H - ey;
          m.vy = -Math.abs(m.vy) * 0.3;
        }
      }
    }

    // Ease lift, then draw.
    const light = this.lightPx();
    const k = Math.min(1, dt * 14);
    for (const m of list) {
      m.lift += (m.liftTarget - m.lift) * k;
      if (Math.abs(m.liftTarget - m.lift) < 0.002) m.lift = m.liftTarget;
      m.render(light);
    }
  }

  private interact(a: Magnet, b: Magnet, dt: number): void {
    // Magnets moving together in a drag group are rigid relative to each other.
    if (a.inDragGroup && b.inDragGroup) return;
    const aMov = this.movable(a);
    const bMov = this.movable(b);
    if (!aMov && !bMov) return;

    const c = contact(a, b);
    const pairKey = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;

    if (c.gap >= this.range) {
      this.stuck.delete(pairKey);
      return;
    }

    // Share of motion each magnet takes (a fixed or held magnet doesn't move).
    const shareA = aMov ? (bMov ? 0.5 : 1) : 0;
    const shareB = bMov ? (aMov ? 0.5 : 1) : 0;

    if (c.gap < this.snapDistance) {
      // Snap: close the gap fully (or push apart if overlapping).
      const k = c.gap < 0 ? 1 : Math.min(1, dt * 18);
      const shift = c.gap * k;
      a.x += c.nx * shift * shareA;
      a.y += c.ny * shift * shareA;
      b.x -= c.nx * shift * shareB;
      b.y -= c.ny * shift * shareB;
      if (aMov) {
        a.vx *= 0.6;
        a.vy *= 0.6;
      }
      if (bMov) {
        b.vx *= 0.6;
        b.vy *= 0.6;
      }
      if (!this.stuck.has(pairKey)) {
        this.stuck.add(pairKey);
        this.onSnap?.(a, b);
      }
    } else {
      // Pull: strength rises as the gap shrinks.
      this.stuck.delete(pairKey);
      const t = 1 - c.gap / this.range;
      const acc = 2200 * this.attraction * a.strength * b.strength * t * t;
      if (aMov) {
        a.vx += c.nx * acc * dt;
        a.vy += c.ny * acc * dt;
      }
      if (bMov) {
        b.vx -= c.nx * acc * dt;
        b.vy -= c.ny * acc * dt;
      }
    }

    // Turn flat faces toward the contact so boxes sit flush against each other.
    if (this.alignFaces && c.gap < this.range * 0.6) {
      const kr = Math.min(1, dt * 10);
      const ang = Math.atan2(c.ny, c.nx) / DEG;
      if (aMov && !a.isCircle) {
        a.rotation += angleDiff(a.rotation, Math.round((ang - a.rotation) / 90) * 90 + a.rotation) * kr;
      }
      if (bMov && !b.isCircle) {
        const angB = ang + 180;
        b.rotation += angleDiff(b.rotation, Math.round((angB - b.rotation) / 90) * 90 + b.rotation) * kr;
      }
    }
  }
}