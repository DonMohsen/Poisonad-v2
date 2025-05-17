'use client';

import QRCode from 'react-qr-code';

type QRCodeBoxProps = {
  value: string;
  size?: number;
  logoUrl?: string; // path to the image or svg
  logoSize?: number;
};

export default function QRCodeBox({
  value,
  size = 180,
  logoUrl,
  logoSize = 40,
}: QRCodeBoxProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md inline-block">
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        <QRCode value={value} size={size} style={{ height: '100%', width: '100%' }} />
        {logoUrl && (
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              width: logoSize,
              height: logoSize,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <img
              src={logoUrl}
              alt="Logo"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '8px',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
