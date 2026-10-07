export default function Header(){
    return(


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
            href="/"
            className="flex items-center gap-2 transition-colors hover:text-[#f15a24]"
          >
            <span className="h-2 w-2 rounded-full bg-[#f15a24]" />
            Work
          </a>

          <a
            href="/matter"
            className="transition-colors hover:text-[#f15a24]"
          >
            Matter.lab
          </a>


          <a
            href="/me"
            className="transition-colors hover:text-[#f15a24]"
          >
            Me
          </a>
        </nav>
      </header>

    )
}