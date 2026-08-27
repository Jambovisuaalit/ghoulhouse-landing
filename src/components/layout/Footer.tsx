import Logo from '@/components/ui/Logo';
import { siteConfig } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="bg-ink text-ghost">
      <div className="shell py-10 sm:py-14">
        <div className="grid gap-10 border-b border-ghost/15 pb-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="inline-block bg-ghost px-3 py-2">
              <Logo className="w-[176px]" />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-ghost/60">
              Työmaa- ja referenssikuvista valmis, jatkuva Instagram- ja Facebook-sisältö.
            </p>
          </div>
          <div>
            <p className="eyebrow text-bone">YRITYS</p>
            <p className="mt-4 text-sm leading-6 text-ghost/70">
              {siteConfig.legalName}<br />
              {siteConfig.founder}, Founder<br />
              Helsinki, Finland
            </p>
          </div>
          <div>
            <p className="eyebrow text-bone">SEURAAVA ASKEL</p>
            <a href="#demo" className="mt-4 inline-block text-sm font-bold uppercase tracking-[0.08em] text-ghost underline decoration-signal decoration-2 underline-offset-4">
              Pyydä 2 sisältöesimerkkiä
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs text-ghost/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GhoulHouse Oy</p>
          <p>ghoulhouse.fi</p>
        </div>
      </div>
    </footer>
  );
}
