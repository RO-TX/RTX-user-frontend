import Image from 'next/image';
import { SectionHead } from './sections';
import type { ApiCertification } from '@/lib/api/types';

/**
 * `GET /content/certifications` has always been wired up (`getCertifications()`
 * in `lib/api/source.ts`) but nothing rendered it. Real badge images from the
 * backend, not the icon-glyph `TrustStrip` pattern — different data shape.
 */
export default function CertificationStrip({
  certifications,
}: {
  certifications: ApiCertification[];
}) {
  if (certifications.length === 0) return null;

  return (
    <div className="band">
      <SectionHead title="Certified & Trusted" />
      <div className="rows">
        {certifications.map((c) => (
          <div className="row" key={c._id}>
            <span className="row__media">
              <Image src={c.image} alt={c.title} width={66} height={66} />
            </span>
            <div className="row__body">
              <h3>{c.title}</h3>
              <p>{c.issuedBy}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
