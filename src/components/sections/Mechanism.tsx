import Container from '@/components/ui/Container';

export default function Mechanism() {
  return (
    <section id="mechanism" className="bg-white py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-12 md:mb-16">Miten GhoulHouse toimii</h2>

        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-4 md:gap-6 lg:gap-8">
          {/* Step 1 */}
          <div className="flex flex-col">
            <div className="w-12 h-12 bg-signal rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-ink font-bold mb-2">Lähetät material</h3>
            <p className="text-ink/70 text-sm leading-relaxed">
              Työmaakuvat, videot ja asiakaskommentit. Käytämme sitä, mitä sinulla on.
            </p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center md:col-span-0">
            <svg className="w-6 h-6 text-signal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col">
            <div className="w-12 h-12 bg-signal rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-ink font-bold mb-2">Me tuotamme</h3>
            <p className="text-ink/70 text-sm leading-relaxed">
              Käsittelemme, muokkaamme ja sommittelemme Instagram- ja Facebook-versiot.
            </p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center md:col-span-0">
            <svg className="w-6 h-6 text-signal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col">
            <div className="w-12 h-12 bg-signal rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-ink font-bold mb-2">Hyväksyt</h3>
            <p className="text-ink/70 text-sm leading-relaxed">
              Tarkistat ja hyväksyt ennen julkaisua. Yksi kierros muokkauksille.
            </p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center md:col-span-0">
            <svg className="w-6 h-6 text-signal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col">
            <div className="w-12 h-12 bg-signal rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
              4
            </div>
            <h3 className="text-ink font-bold mb-2">Julkaisemme</h3>
            <p className="text-ink/70 text-sm leading-relaxed">
              Ajastettu julkaisu Instagramissa ja Facebookissa. Sinä et tee mitään.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
