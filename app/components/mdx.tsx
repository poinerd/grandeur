import Image from "next/image";

type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

function Figure({ src, alt, caption, width = 1600, height = 1000 }: FigureProps) {
  return (
    <figure className="my-10">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 768px, 100vw"
        className="h-auto w-full rounded-xl"
      />
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-neutral-500">{caption}</figcaption>
      )}
    </figure>
  );
}

function VideoClip({ src }: { src: string }) {
  return <video src={src} autoPlay muted loop playsInline className="my-10 w-full rounded-xl" />;
}

function Callout({ children }: { children: React.ReactNode }) {
  return <div className="my-8 rounded-xl bg-green-50 p-6 text-green-900">{children}</div>;
}

// Anything in this object can be used as <Name /> inside .mdx files
export const mdxComponents = { Figure, VideoClip, Callout };