interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  inverse?: boolean;
}

export default function SectionHeading({ eyebrow, title, intro, inverse = false }: SectionHeadingProps) {
  return (
    <header className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
      <p className={inverse ? 'eyebrow text-bone' : 'eyebrow text-signal'}>{eyebrow}</p>
      <div className="max-w-4xl">
        <h2 className={inverse ? 'display-title text-ghost' : 'display-title text-ink'}>{title}</h2>
        {intro ? (
          <p className={inverse ? 'mt-6 max-w-2xl text-lg text-ghost/70' : 'mt-6 max-w-2xl text-lg text-ink/70'}>
            {intro}
          </p>
        ) : null}
      </div>
    </header>
  );
}
