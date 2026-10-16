import type { ComponentPropsWithoutRef, ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  1. BASE ELEMENTS: this is what gives plain Markdown a clear hierarchy       */
/*  (no Tailwind Typography plugin needed, so remove `prose` from the page)     */
/* -------------------------------------------------------------------------- */

const h2 = (props: ComponentPropsWithoutRef<"h2">) => (
  <h2
    className="mt-24 border-t border-neutral-200 pt-8 text-3xl font-semibold tracking-tight text-[#1f1f1c]"
    {...props}
  />
);

const h3 = (props: ComponentPropsWithoutRef<"h3">) => (
  <h3
    className="mt-12 text-2xl font-semibold tracking-tight text-[#1f1f1c]"
    {...props}
  />
);

const h4 = (props: ComponentPropsWithoutRef<"h4">) => (
  <h4
    className="mt-8 text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500"
    {...props}
  />
);

const p = (props: ComponentPropsWithoutRef<"p">) => (
  <p className="my-4 text-[16px]  tracking-[-0.02em] leading-[1.35] text-neutral-700 sm:text-[18px]" {...props} />
);
const strong = (props: ComponentPropsWithoutRef<"strong">) => (
  <strong className="font-semibold text-[#1f1f1c]" {...props} />
);

const ul = (props: ComponentPropsWithoutRef<"ul">) => (
  <ul
    className="my-5 list-disc space-y-2 pl-6 text-[17px] leading-[1.75] text-neutral-700 marker:text-neutral-400"
    {...props}
  />
);

const ol = (props: ComponentPropsWithoutRef<"ol">) => (
  <ol
    className="my-5 list-decimal space-y-2 pl-6 text-[17px] leading-[1.75] text-neutral-700 marker:font-medium marker:text-neutral-400"
    {...props}
  />
);

const a = (props: ComponentPropsWithoutRef<"a">) => (
  <a
    className="font-medium text-[#1f1f1c] underline underline-offset-4 hover:text-black"
    {...props}
  />
);

const hr = () => <hr className="my-16 border-neutral-200" />;

/* -------------------------------------------------------------------------- */
/*  2. LAYOUT COMPONENTS: compose these in the MDX to arrange each project      */
/* -------------------------------------------------------------------------- */

// Breaks out of the narrow text column so images can be bigger than the text.
const breakout =
  "relative left-1/2 w-[min(72rem,calc(100vw-3rem))] -translate-x-1/2";

/** Major section: small label + big title. Renders an <h2>. */
export function Section({
  label,
  title,
  children,
}: {
  label?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="mt-24 border-t border-neutral-200 pt-8">
      {label && (
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          {label}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#1f1f1c]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Row of big numbers. Use <Stats><Stat value="20+" label="..." /></Stats> */
export function Stats({ children }: { children: ReactNode }) {
  return (
    <div className="my-10 grid grid-cols-2 gap-4 sm:grid-cols-3">{children}</div>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
      <p className="text-3xl font-semibold tracking-tight text-[#1f1f1c]">
        {value}
      </p>
      <p className="mt-1 text-sm text-neutral-600">{label}</p>
    </div>
  );
}

/** Side-by-side columns. Stacks on mobile. */
export function Columns({
  cols = 2,
  children,
}: {
  cols?: 2 | 3;
  children: ReactNode;
}) {
  return (
    <div
      className={`my-8 grid gap-4 ${
        cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
      }`}
    >
      {children}
    </div>
  );
}

/** One idea in a box: a user group, a principle, a skill. */
export function Card({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {eyebrow}
        </p>
      )}
      <p className="mt-1 text-lg font-semibold text-[#1f1f1c]">{title}</p>
      <div className="mt-2 text-[15px] leading-relaxed text-neutral-700">
        {children}
      </div>
    </div>
  );
}

function Frame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-2 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full rounded-xl" />
    </div>
  );
}

// Shown only while you're writing (npm run dev), never on the live site.
function Placeholder({ label }: { label: string }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="flex aspect-[16/10] items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 text-sm text-neutral-400">
      Screenshot needed: {label}
    </div>
  );
}

/**
 * One screen of the product. This is the main building block.
 *   <Screen n={1} title="Dashboard" src="/project/x/dashboard.png" caption="...">
 *     Why this screen exists and what it does.
 *   </Screen>
 * layout="stacked" (default): text on top, big image below, breaking out wide.
 * layout="split": text and image side by side.
 * No src yet? A dashed placeholder shows in dev and nothing shows in production.
 */
export function Screen({
  n,
  label = "",
  title,
  src,
  alt,
  caption,
  layout = "stacked",
  children,
}: {
  n?: number | string;
  label?: string;
  title: string;
  src?: string;
  alt?: string;
  caption?: string;
  layout?: "stacked" | "split";
  children?: ReactNode;
}) {
  const media = src ? (
    <Frame src={src} alt={alt ?? title} />
  ) : (
    <Placeholder label={title} />
  );

  const captionEl = caption && src && (
    <p className="mt-3 text-center text-sm text-neutral-500">{caption}</p>
  );

  const header = (
    <div>
      <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
        {n !== undefined && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1f1f1c] text-[11px] tracking-normal text-white">
            {n}
          </span>
        )}
        {label}
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1f1f1c]">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );

  if (layout === "split") {
    return (
      <section className="my-16 grid items-center gap-8 md:grid-cols-2">
        {header}
        <div>
          {media}
          {captionEl}
        </div>
      </section>
    );
  }

  return (
    <section className="my-16">
      <div className="max-w-2xl">{header}</div>
      <div className={`${breakout} mt-8`}>
        {media}
        {captionEl}
      </div>
    </section>
  );
}

/** Numbered call-outs that explain parts of a screen. Put right after <Screen>. */
export function Notes({ children }: { children: ReactNode }) {
  return <div className="my-8 grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function Note({
  n,
  title,
  children,
}: {
  n: number | string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-neutral-200 p-5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f1f1c] text-xs font-medium text-white">
        {n}
      </span>
      <div>
        <p className="font-semibold text-[#1f1f1c]">{title}</p>
        <div className="mt-1 text-[15px] leading-relaxed text-neutral-700">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Image at text width. */
export function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-10">
      <Frame src={src} alt={alt} />
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-neutral-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Image that breaks out wider than the text. */
export function WideFigure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className={`${breakout} my-12`}>
      <Frame src={src} alt={alt} />
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-neutral-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Grid of small images: <Gallery cols={3}><Figure .../></Gallery> */
export function Gallery({
  cols = 2,
  children,
}: {
  cols?: 2 | 3;
  children: ReactNode;
}) {
  return (
    <div
      className={`my-10 grid gap-4 ${
        cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
      } [&_figure]:my-0`}
    >
      {children}
    </div>
  );
}

/** One memorable line. Use once or twice per case study. */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-10 rounded-2xl border-l-4 border-[#1f1f1c] bg-neutral-100 px-6 py-5 text-lg font-medium leading-snug text-[#1f1f1c]">
      {children}
    </div>
  );
}

/** Pull quote, optionally with who said it. */
export function Quote({
  who,
  children,
}: {
  who?: string;
  children: ReactNode;
}) {
  return (
    <blockquote className="my-12 text-2xl font-medium leading-snug text-[#1f1f1c]">
      {children}
      {who && (
        <footer className="mt-3 text-sm font-normal text-neutral-500">
          {who}
        </footer>
      )}
    </blockquote>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. REGISTER EVERYTHING                                                      */
/* -------------------------------------------------------------------------- */

export const mdxComponents = {
  h2,
  h3,
  h4,
  p,
  strong,
  ul,
  ol,
  a,
  hr,
  Section,
  Stats,
  Stat,
  Columns,
  Card,
  Screen,
  Notes,
  Note,
  Figure,
  WideFigure,
  Gallery,
  Callout,
  Quote,
};