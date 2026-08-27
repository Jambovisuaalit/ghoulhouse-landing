import Reveal from '@/components/ui/Reveal';

export default function Founder() {
  return (
    <section className="border-y border-ink/10 bg-ghost py-16 sm:py-24" aria-labelledby="founder-title">
      <div className="container-wide">
        <Reveal className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-signal">Yrittäjä</p>
          <div>
            <h2 id="founder-title" className="text-ink">Hanna Nyholm / GhoulHouse</h2>
            <p className="mt-5 max-w-2xl text-ink/70">
              GhoulHouse on rakennettu poistamaan pienyrityksen somesta yksi käytännön pullonkaula: materiaalia syntyy, mutta sen muuttaminen jatkuvaksi julkaisemiseksi vie aikaa. Palvelu pitää prosessin tarkoituksella yksinkertaisena ja rajattuna.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
