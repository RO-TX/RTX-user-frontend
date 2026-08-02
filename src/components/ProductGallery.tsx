'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  // images[0] is the opening hero; the rail holds the alternates beside it,
  // exactly as the reference screen does.
  const rail = images.length > 1 ? images.slice(1, 4) : images;
  const railOffset = images.length > 1 ? 1 : 0;
  // The hero counts as the first thumbnail for highlighting purposes, which
  // is how the reference screen marks it.
  const railActive = Math.max(active - railOffset, 0);

  return (
    <>
      <div className="gallery">
        <div className="gallery__rail">
          {rail.map((src, i) => (
            <button
              key={src + i}
              type="button"
              data-active={i === railActive ? '' : undefined}
              aria-pressed={i === railActive}
              aria-label={`View image ${i + 1} of ${rail.length}`}
              onClick={() => setActive(i + railOffset)}
            >
              <Image src={src} alt="" width={136} height={178} />
            </button>
          ))}
        </div>
        <div className="gallery__main">
          <Image src={images[active] ?? images[0]} alt={alt} width={608} height={710} priority />
        </div>
      </div>

      <div className="dots" aria-hidden="true">
        {images.map((src, i) => (
          <i key={src + i} data-active={i === active ? '' : undefined} />
        ))}
      </div>
    </>
  );
}
