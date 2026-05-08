'use client';

export default function Home() {
  return (
    <div className="min-h-screen grid-bg text-zinc-100 font-sans bg-zinc-950">
      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <section className="text-left">
          <p className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm uppercase tracking-[.24em] text-zinc-300">
            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 blink"></span>
            UNDER CONSTRUCTION
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl mt-3 animate-header-fade">
            Hi, I'm Emmanuel
          </h1>
          <p className="mt-2 text-lg sm:text-xl font-semi-bold text-white">
            Multidisciplinary designer and budding design engineer
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://www.linkedin.com/in/obadofin-emmanuel-314264258/" className="text-zinc-500 hover:text-zinc-400 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://www.behance.net/emmanueobadofi" className="text-zinc-500 hover:text-zinc-400 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z"/>
              </svg>
            </a>
            <a href="https://github.com/poinerd" className="text-zinc-500 hover:text-zinc-400 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://x.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-400 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/>
              </svg>
            </a>
          </div>
          <div className="mt-8 max-w-3xl space-y-4 text-base leading-8 text-zinc-400 sm:mx-0 sm:text-lg">
            <p>
              I love creating things, and my work sits at the intersection of design and engineering. I'm drawn to <span className="text-white">brand design, product design, and software engineering</span>, and I'm currently building toward becoming a design engineer.
            </p>
            <p>
              I enjoy poetry and slow instrumentals (I love M83). <a className="text-white underline" href="https://substack.com/@thegrandeur?utm_source=global-search">I enjoy writing</a>, and I tell the best pun jokes. (haha)
            </p>
            <p>
              In the future, I want to explore industrial design and robotics more deeply.
            </p>
            <p>
              This space is still under construction as i'm learning, building, and will keep adding projects as I grow. Welcome.
            </p>
          </div>
          <footer className="mt-10 border-t border-zinc-800 pt-6 text-sm text-zinc-500">
            Designed and built with care by Emmanuel.
          </footer>
          {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#work"
              className="inline-flex w-full items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition hover:opacity-80 sm:w-auto bg-white text-zinc-950 hover:bg-zinc-200"
            >
              Explore my work
            </a>
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center rounded-full border px-8 py-3 text-sm transition hover:opacity-80 sm:w-auto border-zinc-700 bg-transparent text-zinc-300 hover:border-zinc-500 hover:text-white"
            >
              Let's connect
            </a>
          </div> */}
        </section>

 
      

        
      </main>
    </div>
  );
}
