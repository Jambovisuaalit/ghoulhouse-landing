import Reveal from '@/components/ui/Reveal';

export default function Audience() {
  return (
    <section className="bg-white py-16 sm:py-24" aria-labelledby="audience-title">
      <div className="container-wide">
        <Reveal className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-signal">Kenelle</p>
            <h2 id="audience-title" className="mt-4 text-ink">Remontti- ja korjausrakentamisen pienyrityksille.</h2>
          </div>
          <div className="grid gap-4 text-ink/75">
            <p>Palvelu sopii erityisesti yrityksille, joilla syntyy jatkuvasti oikeita työmaa- ja referenssikuvia, mutta julkaiseminen jää epäsäännölliseksi.</p>
            <p>Jos materiaalia ei synny lainkaan tai tavoitteena on ensisijaisesti maksettu liidimainonta, tämä paketti ei ole oikea ratkaisu.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
