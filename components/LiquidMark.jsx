'use client';
import { useEffect, useState } from 'react';
import { LiquidMetal, liquidMetalPresets } from '@paper-design/shaders-react';

// Real liquid-metal shader (paper-design/liquid-logo) as the hero brand mark, tinted neon green.
export default function LiquidMark({ size = 300, className = '' }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const base = liquidMetalPresets?.[0]?.params || {};

  return (
    <div className={className} style={{ width: size, height: size, position: 'relative' }}>
      {mounted && (
        <LiquidMetal
          {...base}
          style={{ width: size, height: size, borderRadius: '50%' }}
          colorBack="#06140c"
          colorTint="#1fe06a"
          speed={0.8}
          distortion={0.1}
          repetition={3}
          softness={0.18}
          contour={0.55}
          angle={70}
          scale={0.72}
          shape="metaballs"
        />
      )}
      {/* soft neon halo */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: '0 0 80px 10px rgba(31,224,106,0.28)', pointerEvents: 'none' }} />
    </div>
  );
}
