'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OpportunityLogoProps {
  src?: string;
  alt: string;
  label: string;
  size?: number;
  className?: string;
}

export default function OpportunityLogo({ src, alt, label, size = 48, className = '' }: OpportunityLogoProps) {
  const [hasError, setHasError] = useState(false);
  const initial = label.trim().charAt(0).toUpperCase() || 'O';

  if (!src || hasError) {
    return (
      <div
        className={`bg-surface-container rounded-xl flex items-center justify-center font-semibold text-primary shrink-0 ring-1 ring-outline-variant/60 ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {initial}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setHasError(true)}
      className={`rounded-xl object-cover shrink-0 ring-1 ring-outline-variant/60 ${className}`}
    />
  );
}