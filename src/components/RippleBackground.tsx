'use client';

import RippleGrid from './RippleGrid';

export default function RippleBackground() {
  return (
    // <div className="absolute inset-0 z-10 overflow-hidden h-full w-full pointer-events-auto">
    <div className="absolute inset-0 z-0 overflow-hidden h-full w-full">
      <RippleGrid
        enableRainbow={true}
        gridColor="rgba(139, 92, 246, 0.4)" // Brighter purple with opacity
          rippleIntensity={0.09}
        gridSize={20}
        gridThickness={20}
        mouseInteraction={true}
          mouseInteractionRadius={0.5}
        opacity={0.4}
          glowIntensity={0.9}
      />
    </div>
  );
}