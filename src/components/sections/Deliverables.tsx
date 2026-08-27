import Reveal from '@/components/ui/Reveal';

const deliverables = [
  '12 alkuperäistä sisältöä / 30 päivää',
  'Instagram + Facebook',
  'Sisältösuunnittelu',
  'Kuvien valinta ja viimeistely',
  'Tekstit ja CTA:t',
  'Ajastus ja julkaisu',
  'Yksi koottu korjauskierros',
  'Kevyt kuukausikooste',
];

export default function Deliverables() {
  return (
    <section className="bg-bone py-16 sm:py-24" aria-labelledby="deliverables-title">
      <div className="container-wide">
        <Reveal className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-signal">Toimitus</p>
            <h2 id="deliverables-title" className="mt-4 text-ink">Some 12</h2>
          </div>
          <ul className="grid gap-0 border-t-2 border-ink">
            {deliverables.map((item) => (
              <li key={item} className="border-b border-ink/25 py-4 font-semibold text-ink">
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
