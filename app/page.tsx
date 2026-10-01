
'use client';



export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f4ef] text-[#41413d]">
      <style jsx global>{`
        @font-face {
          font-family: 'Tiempos';
          src: url('/fonts/TiemposText-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-6 sm:px-9">
        {/* Logo */}
<a
  href="/"
  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full"
  aria-label="Home"
>
  <img
    src="/assets/me.png"
    alt="Emmanuel"
    className="h-full w-full object-cover"
  />
</a>

        {/* Main navigation */}
        <nav className="flex items-center gap-6 text-sm text-[#555550]">
          <a
            href="#work"
            className="flex items-center gap-2 transition-colors hover:text-[#f15a24]"
          >
            <span className="h-2 w-2 rounded-full bg-[#f15a24]" />
            Work
          </a>

          <a
            href="#matter"
            className="transition-colors hover:text-[#f15a24]"
          >
            Matter.lab
          </a>

          <a
            href="#gallery"
            className="transition-colors hover:text-[#f15a24]"
          >
            Gallery
          </a>

          <a
            href="#me"
            className="transition-colors hover:text-[#f15a24]"
          >
            Me
          </a>
        </nav>
      </header>

      {/* Introduction */}
      <section className="px-5 pt-6 sm:px-9 sm:pt-10">
        <div className="max-w-[760px]">

          {/* Heading */}
          <h1
            className="text-[48px] leading-[0.98] tracking-[-0.04em] text-[#41413d] sm:text-[64px]"
            style={{
              fontFamily: 'Tiempos, Georgia, serif',
            }}
          >
            I&apos;m Emmanuel,
            <br />
            Designer, Engineer
          </h1>

          {/* Links + description */}
          <div className="mt-5 border-t border-[#d5d3cc] pt-3">

            {/* Social links */}
            <nav
              className="flex items-center gap-5 text-[#555550]"
              aria-label="Social links"
            >
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-colors hover:text-[#f15a24]"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.48v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM3.56 8.99h3.57v11.46H3.56V8.99z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="transition-colors hover:text-[#f15a24]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.45 11.45 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5z" />
                </svg>
              </a>

              {/* X */}
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="transition-colors hover:text-[#f15a24]"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25h6.826l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
              </a>

              {/* Substack */}
              <a
                href="https://substack.com/@thegrandeur"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Substack"
                className="transition-colors hover:text-[#f15a24]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v10l-9-4.5L3 21V11z" />
                </svg>
              </a>

              {/* Behance */}
              <a
                href="https://www.behance.net/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Behance"
                className="transition-colors hover:text-[#f15a24]"
              >
                <svg
                  width="20"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M14.5 5.5h5v1.5h-5V5.5zM12.7 11.2c1.3-.6 2-1.6 2-3 0-2.9-2.2-4.2-4.8-4.2H3v16h7.2c3.1 0 5.4-1.5 5.4-4.5 0-2-1.1-3.7-2.9-4.3zM6.2 6.7h3.3c1.1 0 1.9.5 1.9 1.6 0 1.2-.9 1.6-2.1 1.6H6.2V6.7zm3.6 10.6H6.2v-4.3h3.7c1.3 0 2.4.7 2.4 2.1 0 1.5-1 2.2-2.5 2.2zm9.1-7.9c-3.4 0-5.4 2.4-5.4 5.5 0 3.2 1.9 5.4 5.5 5.4 2.4 0 4.5-1.2 5.1-3.6h-2.6c-.4 1-1.2 1.5-2.5 1.5-1.5 0-2.5-.9-2.6-2.5h7.9c.2-3.3-1.5-6.3-5.4-6.3zm-2.5 4.2c.1-1.4 1-2.2 2.5-2.2 1.4 0 2.3.8 2.4 2.2h-4.9z" />
                </svg>
              </a>
            </nav>

            {/* Description */}
            <p className="mt-5 max-w-[680px] text-[16px] leading-[1.35] tracking-[-0.02em] text-[#666660] sm:text-[18px]">
              Product designer and software developer with 2+ years of
              experience designing and building digital products, visual
              identities, and software from idea to execution.
            </p>

            {/* Resume */}
            <a
              href="/resume"
              className="mt-1 inline-block text-[16px] font-medium text-[#f15a24] underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
            >
              View Resume
            </a>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="px-5 py-32 sm:px-9">
        <h2 className="text-2xl font-medium">Work</h2>
      </section>

      {/* Matter.lab */}
      <section id="matter" className="px-5 py-32 sm:px-9">
        <h2 className="text-2xl font-medium">Matter.lab</h2>
      </section>

      {/* Gallery */}
      <section id="gallery" className="px-5 py-32 sm:px-9">
        <h2 className="text-2xl font-medium">Gallery</h2>
      </section>

      {/* Me */}
      <section id="me" className="px-5 py-32 sm:px-9">
        <h2 className="text-2xl font-medium">Me</h2>
      </section>
    </main>
  );
}

