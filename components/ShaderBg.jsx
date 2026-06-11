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
            color1="#060a07"
            color2="#1fe06a"
            color3="#c9f23e"
            uSpeed={0.14}
            uDensity={1.5}
            uStrength={1.5}
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
      {/* readability veil — green-black, keeps white text crisp */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 0%, rgba(6,10,7,0.55), rgba(6,10,7,0.86))' }} />
    </div>
  );
}
