import Logo from '@/components/ui/Logo';
import SectionHeading from '@/components/ui/SectionHeading';

export default function Examples() {
  return (
    <section id="esimerkit" className="section bg-bone">
      <div className="shell">
        <SectionHeading
          eyebrow="03 / ESIMERKIT"
          title="Raaka materiaali sisään. Selkeä sisältöobjekti ulos."
          intro="Alla oleva proof sheet havainnollistaa tuotteen logiikkaa. Se on konseptiesimerkki, ei toteutunut asiakastyö tai tulosväite."
        />

        <div className="proof-sheet mt-14">
          <div className="proof-sheet-head">
            <p className="eyebrow">PROOF SHEET / GH-001</p>
            <span className="example-label">KONSEPTIESIMERKKI — EI ASIAKASTYÖ.</span>
          </div>

          <div className="proof-sheet-grid">
            <article className="proof-pane proof-pane-raw">
              <p className="eyebrow text-ink/55">RAW / SOURCE</p>
              <p className="mt-6 max-w-sm text-sm leading-6 text-ink/60">
                Työmaakuva, projektin faktat ja asiakkaan oma materiaali.
              </p>
              <span className="proof-raw-word" aria-hidden="true">RAW</span>
              <span className="proof-file-name">IMG_2841.JPG / 01</span>
            </article>

            <article className="proof-pane proof-pane-ready">
              <p className="eyebrow text-signal">READY / SOCIAL</p>

              <div className="proof-ready-poster">
                <div className="flex items-start justify-between gap-4">
                  <Logo compact className="w-10" />
                  <span className="eyebrow text-signal">01 / REFERENSSI</span>
                </div>

                <p className="proof-ready-title">
                  Työnjälki näkyviin.
                </p>

                <div className="flex items-end justify-between gap-5 border-t border-ink/20 pt-4">
                  <p className="max-w-xs text-xs leading-5 text-ink/60">
                    Kuva + konteksti + copy + CTA + kanava-adaptaatio.
                  </p>
                  <span className="font-mono text-xs text-signal">GH / OUT</span>
                </div>
              </div>
            </article>
          </div>

          <div className="proof-caption-band">
            <div>
              <p className="eyebrow text-signal">RAW / POLISHED</p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink/65">
                GhoulHouse ei tarvitse studiotuotantoa lähtöpisteeksi. Arjessa syntyvä materiaali
                muutetaan hallituksi visuaaliseksi kokonaisuudeksi.
              </p>
            </div>
            <div>
              <p className="eyebrow text-signal">UTILITY / ART</p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink/65">
                Lopputuloksen pitää näyttää suunnitellulta, mutta edelleen yrityksen oikealta työltä —
                ei geneeriseltä mainospohjalta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
