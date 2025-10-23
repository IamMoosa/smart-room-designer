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
    // Place furniture in a vertical dock on the right
    const defaultFurniture: RoomObject[] = Array.from({ length: 10 }).map((_, i) => ({
      id: `furniture${i}`,
      x: roomX + roomWidth + gridSize * 2, // Position to the right of the room
      y: roomY + gridSize + i * (gridSize * 3), // Stack vertically
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
    const [hoveredObject, setHoveredObject] = useState<RoomObject | null>(null);
    const [history, setHistory] = useState<RoomObject[][]>([]);

    useEffect(() => {
      function handleResize() {
        // Subtract 32px for padding and adjust for better fit
        setCanvasSize({
          width: Math.min(window.innerWidth - 32, 1200),
          height: Math.min(window.innerHeight - 32, 800),
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

          // Draw rotation icon when hovered
          if (hoveredObject && hoveredObject.id === obj.id && !dragging) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.beginPath();
            ctx.arc(obj.w / 2, -obj.h / 2, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#000";
            ctx.font = "bold 14px sans-serif";
            ctx.fillText("⟳", obj.w / 2, -obj.h / 2);
          }
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

    function normalizeRotation(r: number) {
      // Round to nearest 90 to defensively normalize any non-exact values
      const step = Math.round(r / 90) % 4;
      return ((step + 4) % 4) * 90;
    }

    function rotateObject(targetId: string) {
      setObjects((prev) => {
        const idx = prev.findIndex((p) => p.id === targetId);
        if (idx === -1) return prev;
        const obj = prev[idx];

        const current = normalizeRotation(obj.rotation);
        const next = (current + 90) % 360; // only 0,90,180,270

        // Determine new width/height (swap on 90/270)
        const willSwap = (current % 180) !== (next % 180);
        const newW = willSwap ? obj.h : obj.w;
        const newH = willSwap ? obj.w : obj.h;

        // Keep object's center, snap center to grid for alignment
        const cx = obj.x + obj.w / 2;
        const cy = obj.y + obj.h / 2;
        const snapCx = Math.round(cx / gridSize) * gridSize;
        const snapCy = Math.round(cy / gridSize) * gridSize;
        let newX = snapCx - newW / 2;
        let newY = snapCy - newH / 2;

        // Clamp to room bounds
        newX = Math.max(roomX, Math.min(roomX + roomWidth - newW, newX));
        newY = Math.max(roomY, Math.min(roomY + roomHeight - newH, newY));

        const movedObj: RoomObject = { ...obj, x: newX, y: newY, w: newW, h: newH, rotation: next };

        // Check overlap with others
        const others = prev.filter((p) => p.id !== targetId);
        const overlap = others.some((o) => isOverlapping(movedObj, o));
        if (overlap) {
          // Cancel rotation if overlap would occur
          return prev;
        }

        // Commit rotation
        const nextArr = prev.map((p, i) => (i === idx ? movedObj : p));
        return nextArr;
      });
      setHistory((h) => [...h, objects]);
    }

    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const foundObj = objects.find((o) => isPointInRotatedRect(o, x, y));
      if (foundObj) {
        const foundIdx = objects.indexOf(foundObj);
          // Check if clicking the rotation icon (transform local icon point to world coords)
          if (hoveredObject && hoveredObject.id === foundObj.id) {
            const cx = foundObj.x + foundObj.w / 2;
            const cy = foundObj.y + foundObj.h / 2;
            // The icon is drawn at local coords (foundObj.w/2, -foundObj.h/2)
            const localX = foundObj.w / 2;
            const localY = -foundObj.h / 2;
            const theta = (foundObj.rotation * Math.PI) / 180;
            const iconX = cx + (localX * Math.cos(theta) - localY * Math.sin(theta));
            const iconY = cy + (localX * Math.sin(theta) + localY * Math.cos(theta));
            const dx = x - iconX;
            const dy = y - iconY;
            if (dx * dx + dy * dy <= 225) { // 15^2 for icon radius
              // Attempt to rotate (rotateObject will reject if overlap)
              rotateObject(foundObj.id);
              return;
            }
          }
        // Start dragging
        setDragging({
          ...foundObj,
          offsetX: x - foundObj.x,
          offsetY: y - foundObj.y,
          snapX: foundObj.x,
          snapY: foundObj.y,
        });
      }
    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update hovered object
      if (!dragging) {
        const foundObj = objects.find((o) => isPointInRotatedRect(o, x, y));
        setHoveredObject(foundObj || null);
      }

      if (!dragging) return;

      // Calculate center point for better rotation handling
      const objectCenterX = x - dragging.offsetX + dragging.w / 2;
      const objectCenterY = y - dragging.offsetY + dragging.h / 2;

      // Snap center to grid
      let snapCenterX = Math.round(objectCenterX / gridSize) * gridSize;
      let snapCenterY = Math.round(objectCenterY / gridSize) * gridSize;

      // Calculate top-left position from snapped center
      let snapX = snapCenterX - dragging.w / 2;
      let snapY = snapCenterY - dragging.h / 2;

      // Clamp to room boundaries
      snapX = Math.max(roomX, Math.min(roomX + roomWidth - dragging.w, snapX));
      snapY = Math.max(roomY, Math.min(roomY + roomHeight - dragging.h, snapY));

      setDragging({ ...dragging, snapX, snapY });
    }

    function handleMouseUp() {
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

    // handleRotate removed; rotation is now via icon overlay


    // handleAddObject removed (not needed for fixed furniture)


    // No need to initialize objects, already set with initialFurniture

    return (
      <motion.div
        className="w-full min-h-screen bg-[#1e1e1e] p-4 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="mb-4 text-white text-lg bg-black/50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-4">
          <div>Drag, arrange, and rotate furniture 🛋️</div>
          <button
            onClick={handleUndo}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Undo
          </button>
        </div>
        
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="cursor-pointer rounded-lg shadow-xl"
          />
        </div>
      </motion.div>
    );
}
