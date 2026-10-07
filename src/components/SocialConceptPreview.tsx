import Image from 'next/image';

/** A labeled layout example, never a customer result or renovation comparison. */
export default function SocialConceptPreview({ image, alt, headline }: {
  image: string;
  alt: string;
  headline: string;
}) {
  return (
    <div className="ghConceptPreview">
      <div className="ghConceptSource">
        <Image src={image} alt="" width={80} height={64} sizes="80px" />
        <div><span>LÄHTÖKUVA</span><p>Sama kuva. Valmis julkaisu.</p></div>
        <span aria-hidden="true">↓</span>
      </div>
      <div className="ghConceptPost">
        <div className="ghConceptPostHeader"><Image src="/ghoulhouse-mark.svg" alt="" width={24} height={24} /><span>JULKAISUN TAITTOESIMERKKI</span></div>
        <div className="ghConceptPostPhoto"><Image src={image} alt={alt} fill sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 33vw" /></div>
        <p className="ghConceptPostHeadline">{headline}</p>
      </div>
      <p className="ghConceptDisclosure">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</p>
    </div>
  );
}
