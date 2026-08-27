import Logo from '@/components/ui/Logo';
import SectionHeading from '@/components/ui/SectionHeading';

export default function Founder() {
  return (
    <section id="hanna" className="section bg-ghost">
      <div className="shell">
        <SectionHeading eyebrow="08 / FOUNDER" title="Hanna Nyholm rakentaa GhoulHousea Helsingistä." />
        <div className="mt-14 grid gap-8 border-t border-ink/15 pt-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="flex min-h-64 items-center justify-center bg-bone p-10">
            <Logo compact className="w-28 sm:w-36" />
          </div>
          <div className="max-w-3xl">
            <p className="text-xl leading-8 text-ink/80">
              GhoulHouse syntyi yksinkertaisesta havainnosta: monella pienellä palveluyrityksellä on jo kaikki tarvittava näyttö hyvästä työstä, mutta ei aikaa tai järjestelmää muuttaa sitä jatkuvaksi sisällöksi.
            </p>
            <p className="mt-6 text-base leading-7 text-ink/60">
              Hannan rooli on yhdistää asiakkaan materiaalit, selkeä sisältösuunnittelu ja hallittu julkaiseminen yhdeksi tuotteistetuksi palveluksi. Ensimmäinen fokus on remontti- ja korjausrakentamisen yrityksissä.
            </p>
            <p className="mt-8 eyebrow text-signal">HANNA NYHOLM · FOUNDER · HELSINKI</p>
          </div>
        </div>
      </div>
    </section>
  );
}
