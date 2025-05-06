'use client';

export function QRCodeBoxSkeleton({ size = 180 }: { size?: number }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md inline-block">
      <div 
        className="animate-pulse bg-gray-200 rounded" 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
        }}
      />
    </div>
  );
}