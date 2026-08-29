import Container from '@/components/ui/Container';

export default function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b-2 border-ink bg-ghost py-12 md:py-20">
      <Container>
        <p className="type-label text-signal">{eyebrow}</p>
        <h1 className="type-display mt-5 max-w-[13ch] text-ink">{title}</h1>
        <p className="type-editorial mt-7 max-w-2xl text-ink/75">{description}</p>
      </Container>
    </section>
  );
}
