'use client';

import RippleGrid from './RippleGrid';

export default function RippleBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden h-full w-full">
      <RippleGrid
        enableRainbow={true}
        gridColor="rgba(139, 92, 246, 0.4)" // Brighter purple with opacity
          rippleIntensity={0.05}
        gridSize={20}
        gridThickness={12}
        mouseInteraction={true}
          mouseInteractionRadius={2.5}
        opacity={1}
          glowIntensity={0.2}
      />
    </div>
  );
}