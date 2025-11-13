"use client";

import React from "react";
import { Room, RoomObject, DraggingObject } from "../types";
import { drawFurniture } from "../drawing";
import { ROOMS, GRID_SIZE, HOUSE_WIDTH, HOUSE_HEIGHT } from "../constants";

type CanvasProps = {
  objects: RoomObject[];
  dragging: DraggingObject | null;
  selectedId: string | null;
  zoom: number;
  pan: { x: number; y: number };
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
  isPanning: boolean;
};

export const CanvasComponent = React.forwardRef<HTMLCanvasElement, CanvasProps>(
  (
    {
      objects,
      dragging,
      selectedId,
      zoom,
      pan,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
      onWheel,
      isPanning,
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const canvas = ref as React.MutableRefObject<HTMLCanvasElement | null>;
      if (!canvas.current) return;
      const ctx = canvas.current.getContext("2d");
      if (!ctx) return;

      const container = containerRef.current;
      if (container) {
        canvas.current.width = container.clientWidth;
        canvas.current.height = container.clientHeight;
      }

      ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
      
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Modern dark background
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, HOUSE_WIDTH, HOUSE_HEIGHT);

      // Add a subtle animated background pattern
      const patternSize = 40;
      for (let x = 0; x < HOUSE_WIDTH; x += patternSize) {
        for (let y = 0; y < HOUSE_HEIGHT; y += patternSize) {
          const opacity = Math.sin((x + y) / 100) * 0.05 + 0.05;
          ctx.fillStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.fillRect(x, y, patternSize, patternSize);
        }
      }

      // Draw rooms with modern styling - no labels
      ROOMS.forEach((room, index) => {
        // Room background
        ctx.fillStyle = room.color;
        ctx.fillRect(room.x, room.y, room.w, room.h);

        // Gradient overlay for depth
        const roomGradient = ctx.createLinearGradient(room.x, room.y, room.x + room.w, room.y + room.h);
        roomGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
        roomGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
        ctx.fillStyle = roomGradient;
        ctx.fillRect(room.x, room.y, room.w, room.h);

        // Main border - colored based on room type
        let borderColor = '#555';
        if (room.id.includes('bedroom')) borderColor = '#4f46e5';
        if (room.id.includes('kitchen') || room.id.includes('dining')) borderColor = '#f59e0b';
        if (room.id.includes('bathroom')) borderColor = '#ec4899';
        if (room.id.includes('living')) borderColor = '#8b5cf6';
        if (room.id.includes('balcony')) borderColor = '#22c55e';

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2.5 / zoom;
        ctx.strokeRect(room.x, room.y, room.w, room.h);

        // Glowing inner border
        ctx.strokeStyle = `${borderColor}40`;
        ctx.lineWidth = 1 / zoom;
        ctx.strokeRect(room.x + 2/zoom, room.y + 2/zoom, room.w - 4/zoom, room.h - 4/zoom);
      });

      // Draw a subtle central focus point
      const centerX = HOUSE_WIDTH / 2;
      const centerY = HOUSE_HEIGHT / 2;
      const radius = 5 / zoom;
      ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw furniture
      objects.forEach(obj => {
        drawFurniture({ obj, ctx, zoom, selectedId });
      });

      // Enhanced dragging preview
      if (dragging) {
        const bboxW = dragging.rotation % 180 === 0 ? dragging.w : dragging.h;
        const bboxH = dragging.rotation % 180 === 0 ? dragging.h : dragging.w;
        
        // Glow effect
        ctx.shadowColor = 'rgba(139, 92, 246, 0.6)';
        ctx.shadowBlur = 15 / zoom;
        
        ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.fillRect(dragging.snapX, dragging.snapY, bboxW, bboxH);
        
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.8)';
        ctx.lineWidth = 2 / zoom;
        ctx.setLineDash([8 / zoom, 4 / zoom]);
        ctx.strokeRect(dragging.snapX, dragging.snapY, bboxW, bboxH);
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    }, [objects, dragging, zoom, pan, selectedId, ref]);

    return (
      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-slate-950">
        <canvas
          ref={ref}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onWheel={onWheel}
          className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-default'}`}
        />
      </div>
    );
  }
);

CanvasComponent.displayName = "CanvasComponent";
