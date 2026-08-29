import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-[70svh] items-center justify-center bg-ghost px-4"
    >
      <div className="text-center">
        <p className="type-label text-signal">404</p>
        <h1 className="type-section-title mt-4 uppercase text-ink">
          Sivua ei löytynyt
        </h1>
        <Link href="/" className="btn btn-primary mt-8">
          Takaisin etusivulle
        </Link>
      </div>
    </main>
  );
}
