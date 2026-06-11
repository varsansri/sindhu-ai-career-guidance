'use client';
import { useEffect, useState } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

// WebGL animated gradient (ShaderGradient + react-three-fiber). Rendered only after mount
// so it never runs during SSR.
export default function ShaderBg() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      {mounted && (
        <ShaderGradientCanvas style={{ width: '100%', height: '100%' }} pixelDensity={1} fov={42}>
          <ShaderGradient
            control="props"
            type="waterPlane"
            color1="#0b1020"
            color2="#5b8cff"
            color3="#7c5cff"
            uSpeed={0.16}
            uDensity={1.4}
            uStrength={1.7}
            uFrequency={5.5}
            grain="on"
            cAzimuthAngle={180}
            cPolarAngle={80}
            cDistance={3.2}
            cameraZoom={9.1}
            rotationX={50}
            rotationY={0}
            rotationZ={-60}
            reflection={0.1}
          />
        </ShaderGradientCanvas>
      )}
      {/* readability veil */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,12,26,0.6), rgba(8,12,26,0.82))' }} />
    </div>
  );
}
