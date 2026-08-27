export default function Footer() {
  return (
    <footer className="bg-ink text-ghost">
      <div className="container-wide grid gap-8 py-10 md:grid-cols-2 md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-signal">GhoulHouse Oy</p>
          <p className="mt-3 max-w-md text-sm text-ghost/80">
            Työmaakuvat sisään. Valmis some ulos.
          </p>
        </div>
        <div className="text-sm text-ghost/70 md:text-right">
          <p>Instagram + Facebook · 12 sisältöä / 30 päivää</p>
          <p className="mt-2">© {new Date().getFullYear()} GhoulHouse Oy</p>
        </div>
      </div>
    </footer>
  );
}
