'use client';

import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

type QRCodeWithLogoProps = {
  value: string;
  size?: number;
  logoUrl?: string;
};

export default function QRCodeWithLogo({
  value,
  size = 180,
  logoUrl = '/logo.svg',
}: QRCodeWithLogoProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qrCode = new QRCodeStyling({
      width: size,
      height: size,
      data: value,
      image: logoUrl,
      dotsOptions: {
        color: '#000',
        type: 'rounded',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
        imageSize: 0.25,
      },
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [value, size, logoUrl]);

  return (
    <div className="inline-block bg-white p-4 rounded-xl shadow-md">
      <div ref={qrRef} />
    </div>
  );
}
