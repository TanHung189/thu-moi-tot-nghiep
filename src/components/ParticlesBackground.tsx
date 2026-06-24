// Component Particles - Tạo hiệu ứng hạt vàng lấp lánh nền
import { useMemo } from 'react';

interface Particle {
  id: number;
  left: string;
  width: string;
  height: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
}

interface Star {
  id: number;
  left: string;
  top: string;
  width: string;
  animationDuration: string;
  animationDelay: string;
}

export default function ParticlesBackground() {
  // Tạo danh sách hạt ngẫu nhiên (memo để không tạo lại mỗi render)
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      animationDuration: `${Math.random() * 15 + 10}s`,
      animationDelay: `${Math.random() * 10}s`,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, []);

  // Tạo danh sách ngôi sao lấp lánh
  const stars: Star[] = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 2 + 1}px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 5}s`,
    }));
  }, []);

  return (
    <>
      {/* Ngôi sao lấp lánh cố định */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.width,
              height: star.width,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Hạt vàng bay lên */}
      <div className="particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.width,
              height: p.height,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Gradient nền chính */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(21, 57, 105, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(14, 38, 72, 0.5) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(3, 10, 20, 1) 0%, #030a14 100%)
            `,
          }}
        />
      </div>
    </>
  );
}
