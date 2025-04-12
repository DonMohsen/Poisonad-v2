'use client';

import QRCode from 'react-qr-code';

type QRCodeBoxProps = {
  value: string;
  size?: number;
};

export default function QRCodeBox({ value, size = 180 }: QRCodeBoxProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md inline-block">
      <QRCode value={value} size={size} />
    </div>
  );
}
