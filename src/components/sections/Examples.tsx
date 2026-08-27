import Image from 'next/image';
import Container from '@/components/ui/Container';

const examples = [
  {
    number: '01',
    label: 'Työvaihe',
    title: 'Pohjatyö ratkaisee lopputuloksen.',
    image: '/work-detail.svg',
    alt: 'Konseptikuva remonttityön yksityiskohdasta',
  },
  {
    number: '02',
    label: 'Valmis kohde',
    title: 'Näytä lopputulos selkeästi.',
    image: '/finished-space.svg',
    alt: 'Konseptikuva valmiista remonttikohteesta',
  },
  {
    number: '03',
    label: 'Asiantuntijakulma',
    title: 'Kerro, miksi työ tehdään näin.',
    image: '/hero-renovation.svg',
    alt: 'Konseptikuva remonttityömaan sisältömateriaalista',
  },
] as const;

export default function Examples() {
  return (
    <section id="examples" className="bg-bone py-16 md:py-24">
      <Container>
        <div className="grid gap-6 border-b-2 border-ink pb-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-signal">
              Sisältöesimerkit
            </p>
            <h2 className="font-display text-[clamp(2.7rem,5vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-ink">
              Yhdestä työmaasta
              <span className="block">syntyy monta kulmaa.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink/65 lg:col-span-4">
            Työvaihe, osaaminen, valinnat ja valmis lopputulos voidaan
            paketoida eri julkaisuiksi ilman keksittyä täytesisältöä.
          </p>
        </div>

        <div className="grid border-x-2 border-b-2 border-ink md:grid-cols-3">
          {examples.map((example, index) => (
            <figure
              key={example.number}
              className={`border-ink ${index < 2 ? 'border-b-2 md:border-b-0 md:border-r-2' : ''}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                <Image
                  src={example.image}
                  alt={example.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[0.55rem] font-bold uppercase tracking-[0.13em] text-ghost">
                  KONSEPTIESIMERKKI — EI ASIAKASTYÖ
                </span>
              </div>
              <figcaption className="bg-ghost p-5">
                <div className="flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-[0.14em]">
                  <span>{example.number}</span>
                  <span className="text-signal">{example.label}</span>
                </div>
                <p className="mt-4 font-display text-2xl font-black uppercase leading-none text-ink">
                  {example.title}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
