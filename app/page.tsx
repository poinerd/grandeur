'use client';

import { useState } from 'react';

export default function Home() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'light-mode' : ''} grid-bg text-zinc-100 font-sans ${theme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-10 p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <section className="space-y-6 text-left">
          <p className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm uppercase tracking-[.24em] text-zinc-300">
            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 blink"></span>
            UNDER CONSTRUCTION
          </p>
          <h1 className={`text-4xl font-semibold leading-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'} sm:text-5xl lg:text-6xl`}>
            Hi, I'm Emmanuel
          </h1>
          <p className={`text-lg sm:text-xl font-medium text-white`}>
            Multidisciplinary designer and budding design engineer
          </p>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/in/obadofin-emmanuel-314264258/" className="text-zinc-500 hover:text-zinc-400 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://www.behance.net/emmanueobadofi" className="text-zinc-500 hover:text-zinc-400 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 7h-7V2H9v5H2v15h9v-5h2v5h9V7zM9 17H4V9h5v8zm11 0h-5v-3h-2v3h-5V9h5v3h2V9h5v8z"/>
              </svg>
            </a>
            <a href="https://github.com/poinerd" className="text-zinc-500 hover:text-zinc-400 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://yourusername.substack.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-400 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.539 8.242H1.461C.657 8.242 0 8.9 0 9.704v4.592c0 .804.657 1.462 1.461 1.462h21.078c.804 0 1.461-.658 1.461-1.462V9.704c0-.804-.657-1.462-1.461-1.462zM1.461 0h21.078C23.343 0 24 .657 24 1.461v2.926c0 .804-.657 1.462-1.461 1.462H1.461C.657 5.849 0 5.191 0 4.387V1.461C0 .657.657 0 1.461 0zM0 22.539c0 .804.657 1.461 1.461 1.461h21.078c.804 0 1.461-.657 1.461-1.461V19.15c0-.804-.657-1.462-1.461-1.462H1.461c-.804 0-1.461.658-1.461 1.462v3.389z"/>
              </svg>
            </a>
          </div>
          <p className={`mx-auto max-w-3xl text-base leading-8 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} sm:mx-0 sm:text-lg`}>
           I love creating things, and my work sits at the intersection of design and engineering. I'm drawn to <span className={`${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>brand design, product design, and software engineering</span>, and I'm currently building toward becoming a design engineer.

<br />
I enjoy poetry and slow instrumentals (Love , love M83). <a>I write sometimes</a>, and I tell (very questionable) pun jokes.

In the future, I want to explore industrial design and robotics more deeply.

<br />
This space is still under construction—I'm learning, building, and will keep adding projects as I grow. Welcome.
          </p>
          {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#work"
              className={`inline-flex w-full items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition hover:opacity-80 sm:w-auto ${
                theme === 'dark' ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-950 text-white hover:bg-zinc-800'
              }`}
            >
              Explore my work
            </a>
            <a
              href="#contact"
              className={`inline-flex w-full items-center justify-center rounded-full border px-8 py-3 text-sm transition hover:opacity-80 sm:w-auto ${
                theme === 'dark' ? 'border-zinc-700 bg-transparent text-zinc-300 hover:border-zinc-500 hover:text-white' : 'border-zinc-300 bg-transparent text-zinc-700 hover:border-zinc-500 hover:text-zinc-950'
              }`}
            >
              Let's connect
            </a>
          </div> */}
        </section>

 
      

        
      </main>
    </div>
  );
}
