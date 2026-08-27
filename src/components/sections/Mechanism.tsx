import MechanismMotion from '@/components/ui/MechanismMotion';
import SectionHeading from '@/components/ui/SectionHeading';

export default function Mechanism() {
  return (
    <section id="mekanismi" className="section overflow-hidden bg-ink text-ghost">
      <div className="shell">
        <SectionHeading
          inverse
          eyebrow="02 / MEKANISMI"
          title="RAW → GHOULHOUSE → READY CONTENT"
          intro="Emme aloita tyhjästä. Otamme materiaalin, joka teillä jo syntyy, ja viemme sen yhden hallitun tuotantoprosessin läpi."
        />
        <div className="mt-14">
          <MechanismMotion />
        </div>
      </div>
    </section>
  );
}
