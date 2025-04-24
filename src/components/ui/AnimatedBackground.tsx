'use client'

import { useEffect, useState } from 'react'

export default function AnimatedBackground() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 100,
        y: Math.random() * 100
      })
    }, 10000) // Changes every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(
              circle at ${position.x}% ${position.y}%,
              rgba(99, 102, 241, 0.8) 0%,
              rgba(217, 70, 239, 0.6) 30%,
              rgba(245, 158, 11, 0.4) 60%,
              rgba(14, 165, 233, 0.2) 100%
          )`,
          transition: 'background 8s ease-in-out',
          backgroundSize: '200% 200%'
        }}
      />
      <div className="absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    </div>
  )
}