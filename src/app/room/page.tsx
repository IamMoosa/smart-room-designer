"use client";


import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { RoomObject, isOverlapping } from "./RoomObject";

type DraggingObject = RoomObject & {
  offsetX: number;
  offsetY: number;
  snapX: number;
  snapY: number;
};

type RoomDesignerProps = {
  roomWidth?: number;
  roomHeight?: number;
  initialFurniture?: Array<Partial<RoomObject> & { id: string; label: string; w: number; h: number; color: string }>;
};

export default function RoomDesigner({ roomWidth: propRoomWidth, roomHeight: propRoomHeight, initialFurniture: propFurniture }: RoomDesignerProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // Room boundary (fixed size, centered or from props)
    const gridSize = 50;
    // Ensure room and canvas are multiples of gridSize
    const roomWidth = Math.ceil((propRoomWidth ?? 800) / gridSize) * gridSize;
    const roomHeight = Math.ceil((propRoomHeight ?? 500) / gridSize) * gridSize;
    const [canvasSize, setCanvasSize] = useState({
      width: roomWidth + gridSize * 6,
      height: roomHeight + gridSize * 6,
    });
    const roomX = Math.round((canvasSize.width - roomWidth) / 2 / gridSize) * gridSize;
    const roomY = Math.round((canvasSize.height - roomHeight) / 2 / gridSize) * gridSize;

    // Predefined furniture pieces or from props
    // Place furniture in a grid pattern, support many pieces
    const defaultFurniture: RoomObject[] = Array.from({ length: 10 }).map((_, i) => ({
      id: `furniture${i}`,
      x: roomX + gridSize + (i % 5) * gridSize * 2,
      y: roomY + gridSize + Math.floor(i / 5) * gridSize * 3,
      w: gridSize * (i % 2 === 0 ? 2 : 1),
      h: gridSize * (i % 3 === 0 ? 2 : 1),
      color: `hsl(${i * 36}, 70%, 60%)`,
      label: `Item ${i + 1}`,
      rotation: 0,
    }));
    const [objects, setObjects] = useState<RoomObject[]>(
      propFurniture
        ? propFurniture.map((f, i) => ({
            ...f,
            x: roomX + gridSize + (i % 5) * gridSize * 2,
            y: roomY + gridSize + Math.floor(i / 5) * gridSize * 3,
            w: Math.ceil((f.w ?? gridSize * 2) / gridSize) * gridSize,
            h: Math.ceil((f.h ?? gridSize * 1) / gridSize) * gridSize,
            rotation: 0,
          } as RoomObject))
        : defaultFurniture
    );
    const [dragging, setDragging] = useState<DraggingObject | null>(null);
    const [history, setHistory] = useState<RoomObject[][]>([]);

    useEffect(() => {
      function handleResize() {
        setCanvasSize({
          width: Math.max(window.innerWidth, 900),
          height: Math.max(window.innerHeight, 600),
        });
      }
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      function drawRoomBoundary() {
        if (!ctx) return;
        ctx.save();
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 4;
        ctx.strokeRect(roomX, roomY, roomWidth, roomHeight);
        ctx.restore();
      }

      function drawGrid() {
        if (!ctx || !canvas) return;
        ctx.save();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 0.5;
        for (let x = roomX; x <= roomX + roomWidth; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, roomY);
          ctx.lineTo(x, roomY + roomHeight);
          ctx.stroke();
        }
        for (let y = roomY; y <= roomY + roomHeight; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(roomX, y);
          ctx.lineTo(roomX + roomWidth, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      function drawObjects() {
        if (!ctx) return;
        objects.forEach((obj) => {
          ctx.save();
          // Move to center of object for rotation
          const cx = obj.x + obj.w / 2;
          const cy = obj.y + obj.h / 2;
          ctx.translate(cx, cy);
          ctx.rotate((obj.rotation * Math.PI) / 180);
          ctx.fillStyle = obj.color;
          ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
          // Draw label
          ctx.fillStyle = "#fff";
          ctx.font = "bold 16px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(obj.label, 0, 0);
          ctx.restore();
        });
      }

      function drawGhost() {
        if (!ctx) return;
        if (dragging) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.fillRect(dragging.snapX, dragging.snapY, dragging.w, dragging.h);
        }
      }

      if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoomBoundary();
    drawGrid();
    drawObjects();
    drawGhost();
    }, [objects, dragging, canvasSize]);

    function isPointInRotatedRect(obj: RoomObject, px: number, py: number) {
      // Transform point into object's local space
      const cx = obj.x + obj.w / 2;
      const cy = obj.y + obj.h / 2;
      const angle = (-obj.rotation * Math.PI) / 180;
      const dx = px - cx;
      const dy = py - cy;
      const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
      const localY = dx * Math.sin(angle) + dy * Math.cos(angle);
      return (
        localX > -obj.w / 2 && localX < obj.w / 2 &&
        localY > -obj.h / 2 && localY < obj.h / 2
      );
    }

    let clickTimer: NodeJS.Timeout | null = null;
    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const foundIdx = objects.findIndex((o) => isPointInRotatedRect(o, x, y));
      if (foundIdx !== -1) {
        // If not dragging, rotate on click (single click)
        clickTimer = setTimeout(() => {
          setObjects((prev) =>
            prev.map((o, i) =>
              i === foundIdx
                ? {
                    ...o,
                    rotation: (o.rotation + 90) % 360,
                    w: o.rotation % 180 === 0 ? o.h : o.w,
                    h: o.rotation % 180 === 0 ? o.w : o.h,
                  }
                : o
            )
          );
        }, 180);
        // If mouse moves, treat as drag
        setDragging({
          ...objects[foundIdx],
          offsetX: x - objects[foundIdx].x,
          offsetY: y - objects[foundIdx].y,
          snapX: objects[foundIdx].x,
          snapY: objects[foundIdx].y,
        });
      }
    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
      if (!dragging) return;
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Snap to grid, keep inside room
      let snapX = Math.round((x - dragging.offsetX) / gridSize) * gridSize;
      let snapY = Math.round((y - dragging.offsetY) / gridSize) * gridSize;
      // Clamp to room
      snapX = Math.max(roomX, Math.min(roomX + roomWidth - dragging.w, snapX));
      snapY = Math.max(roomY, Math.min(roomY + roomHeight - dragging.h, snapY));

      setDragging({ ...dragging, snapX, snapY });
    }

    function handleMouseUp() {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      if (dragging) {
        const movedObj = { ...dragging, x: dragging.snapX, y: dragging.snapY };
        const others = objects.filter((o) => o.id !== dragging.id);
        const overlap = others.some((o) => isOverlapping(movedObj, o));
        // Check if inside room
        const insideRoom =
          movedObj.x >= roomX &&
          movedObj.y >= roomY &&
          movedObj.x + movedObj.w <= roomX + roomWidth &&
          movedObj.y + movedObj.h <= roomY + roomHeight;
        if (!overlap && insideRoom) {
          setHistory((prev) => [...prev, objects]);
          setObjects((prev) =>
            prev.map((o) =>
              o.id === dragging.id
                ? { ...o, x: dragging.snapX, y: dragging.snapY }
                : o
            )
          );
        }
        setDragging(null);

        if (
          objects.length > 0 &&
          objects.every((o) => o.x !== null && o.y !== null)
        ) {
          confetti();
        }
      }
    }

    function handleUndo() {
      if (history.length > 0) {
        const prev = history[history.length - 1];
        setObjects(prev);
        setHistory(history.slice(0, -1));
      }
    }

    function handleRotate(id: string) {
      setObjects((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                rotation: (o.rotation + 90) % 360,
                // Swap width/height for 90/270
                w: o.rotation % 180 === 0 ? o.h : o.w,
                h: o.rotation % 180 === 0 ? o.w : o.h,
              }
            : o
        )
      );
    }


    // handleAddObject removed (not needed for fixed furniture)


    // No need to initialize objects, already set with initialFurniture

    return (
      <motion.div
        className="w-full h-screen bg-[#1e1e1e] relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="cursor-pointer"
        />
        <div className="absolute top-4 left-4 text-white text-lg bg-black/50 px-4 py-2 rounded-xl shadow-lg flex flex-col gap-2">
          <div>Drag, arrange, and rotate furniture 🛋️</div>
          <div className="flex gap-2">
            <button
              onClick={handleUndo}
              className="px-2 py-1 bg-gray-700 rounded"
            >
              Undo
            </button>
          </div>
          {/* Rotation instructions removed, now click object to rotate */}
        </div>
      </motion.div>
    );
}
