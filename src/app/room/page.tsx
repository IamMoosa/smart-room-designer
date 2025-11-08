"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCw, Undo, Move, Home } from "lucide-react";

type RoomObject = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
  rotation: number;
  placed: boolean;
  type: string;
};

type Room = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color: string;
};

type DraggingObject = RoomObject & {
  offsetX: number;
  offsetY: number;
  snapX: number;
  snapY: number;
};

function isOverlapping(a: RoomObject, b: RoomObject) {
  if (!a.placed || !b.placed) return false;
  
  const aW = a.rotation % 180 === 0 ? a.w : a.h;
  const aH = a.rotation % 180 === 0 ? a.h : a.w;
  const bW = b.rotation % 180 === 0 ? b.w : b.h;
  const bH = b.rotation % 180 === 0 ? b.h : b.w;

  return (
    a.x < b.x + bW &&
    a.x + aW > b.x &&
    a.y < b.y + bH &&
    a.y + aH > b.y
  );
}

export default function HouseLayoutDesigner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const gridSize = 5;
  
  const houseWidth = 1200;
  const houseHeight = 900;
  
  const rooms: Room[] = [
    { id: 'living', x: 0, y: 0, w: 600, h: 500, label: 'Living Room', color: 'rgba(139, 92, 246, 0.08)' },
    { id: 'kitchen', x: 600, y: 0, w: 600, h: 350, label: 'Kitchen & Dining', color: 'rgba(251, 191, 36, 0.08)' },
    { id: 'bedroom1', x: 0, y: 500, w: 450, h: 400, label: 'Master Bedroom', color: 'rgba(59, 130, 246, 0.08)' },
    { id: 'bedroom2', x: 450, y: 500, w: 400, h: 400, label: 'Bedroom 2', color: 'rgba(16, 185, 129, 0.08)' },
    { id: 'bathroom', x: 850, y: 350, w: 350, h: 300, label: 'Bathroom', color: 'rgba(236, 72, 153, 0.08)' },
    { id: 'hallway', x: 600, y: 350, w: 250, h: 150, label: 'Hallway', color: 'rgba(148, 163, 184, 0.08)' },
    { id: 'balcony', x: 850, y: 650, w: 350, h: 250, label: 'Balcony', color: 'rgba(34, 197, 94, 0.08)' },
  ];

  const initialFurniture: RoomObject[] = [
    // Living Room Furniture
    { id: 'sofa-1', x: 50, y: 50, w: 180, h: 80, color: '#8B5CF6', label: 'Sofa', rotation: 0, placed: false, type: 'sofa' },
    { id: 'armchair-1', x: 50, y: 150, w: 80, h: 80, color: '#A78BFA', label: 'Armchair', rotation: 0, placed: false, type: 'armchair' },
    { id: 'armchair-2', x: 150, y: 150, w: 80, h: 80, color: '#A78BFA', label: 'Armchair', rotation: 0, placed: false, type: 'armchair' },
    { id: 'coffee-table-1', x: 50, y: 250, w: 100, h: 60, color: '#D8B4FE', label: 'Coffee Table', rotation: 0, placed: false, type: 'table' },
    { id: 'tv-stand-1', x: 170, y: 250, w: 120, h: 40, color: '#4C1D95', label: 'TV Stand', rotation: 0, placed: false, type: 'tv-stand' },
    
    // Kitchen & Dining
    { id: 'dining-table-1', x: 50, y: 320, w: 140, h: 90, color: '#F59E0B', label: 'Dining Table', rotation: 0, placed: false, type: 'table' },
    { id: 'dining-chair-1', x: 50, y: 430, w: 45, h: 45, color: '#FBBF24', label: 'Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'dining-chair-2', x: 110, y: 430, w: 45, h: 45, color: '#FBBF24', label: 'Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'dining-chair-3', x: 170, y: 430, w: 45, h: 45, color: '#FBBF24', label: 'Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'dining-chair-4', x: 230, y: 430, w: 45, h: 45, color: '#FBBF24', label: 'Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'kitchen-counter-1', x: 50, y: 490, w: 200, h: 60, color: '#D97706', label: 'Counter', rotation: 0, placed: false, type: 'counter' },
    
    // Master Bedroom
    { id: 'king-bed-1', x: 50, y: 570, w: 200, h: 180, color: '#3B82F6', label: 'King Bed', rotation: 0, placed: false, type: 'bed' },
    { id: 'nightstand-1', x: 50, y: 760, w: 50, h: 50, color: '#60A5FA', label: 'Nightstand', rotation: 0, placed: false, type: 'nightstand' },
    { id: 'nightstand-2', x: 120, y: 760, w: 50, h: 50, color: '#60A5FA', label: 'Nightstand', rotation: 0, placed: false, type: 'nightstand' },
    { id: 'dresser-1', x: 190, y: 760, w: 120, h: 55, color: '#2563EB', label: 'Dresser', rotation: 0, placed: false, type: 'dresser' },
    
    // Bedroom 2
    { id: 'single-bed-1', x: 330, y: 570, w: 100, h: 180, color: '#10B981', label: 'Single Bed', rotation: 0, placed: false, type: 'bed' },
    { id: 'desk-1', x: 330, y: 760, w: 120, h: 60, color: '#34D399', label: 'Desk', rotation: 0, placed: false, type: 'desk' },
    { id: 'desk-chair-1', x: 330, y: 830, w: 50, h: 50, color: '#6EE7B7', label: 'Desk Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'wardrobe-1', x: 460, y: 760, w: 90, h: 60, color: '#059669', label: 'Wardrobe', rotation: 0, placed: false, type: 'wardrobe' },
  ];

  const [objects, setObjects] = useState<RoomObject[]>(initialFurniture);
  const [dragging, setDragging] = useState<DraggingObject | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<RoomObject[][]>([]);
  
  const [zoom, setZoom] = useState(0.7);
  const [pan, setPan] = useState({ x: 150, y: 80 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if ((e.key === "r" || e.key === "R") && selectedId && !e.repeat) {
        e.preventDefault();
        rotateObject(selectedId);
      }
      if (e.code === "Space" && !e.repeat && !dragging) {
        e.preventDefault();
        setSpacePressed(true);
      }
    }
    
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        setSpacePressed(false);
        setIsPanning(false);
      }
    }
    
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [selectedId, dragging]);

  function drawFurniture(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
    const bboxW = obj.rotation % 180 === 0 ? obj.w : obj.h;
    const bboxH = obj.rotation % 180 === 0 ? obj.h : obj.w;
    
    if (selectedId === obj.id) {
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 3 / zoom;
      ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
      ctx.shadowBlur = 10 / zoom;
      ctx.strokeRect(obj.x - 4 / zoom, obj.y - 4 / zoom, bboxW + 8 / zoom, bboxH + 8 / zoom);
      ctx.shadowBlur = 0;
    }

    const cx = obj.x + bboxW / 2;
    const cy = obj.y + bboxH / 2;
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((obj.rotation * Math.PI) / 180);
    
    // Draw furniture based on type
    switch(obj.type) {
      case 'bed':
        // Mattress
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        // Headboard
        ctx.fillStyle = shadeColor(obj.color, -20);
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h * 0.2);
        // Pillows
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(-obj.w / 2 + obj.w * 0.15, -obj.h / 2 + obj.h * 0.1, obj.w * 0.3, obj.h * 0.15);
        ctx.fillRect(-obj.w / 2 + obj.w * 0.55, -obj.h / 2 + obj.h * 0.1, obj.w * 0.3, obj.h * 0.15);
        ctx.globalAlpha = 1;
        break;
        
      case 'sofa':
        // Seat
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.2, obj.w, obj.h * 0.6);
        // Back
        ctx.fillStyle = shadeColor(obj.color, -15);
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h * 0.3);
        // Arms
        ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.2, obj.w * 0.15, obj.h * 0.6);
        ctx.fillRect(obj.w / 2 - obj.w * 0.15, -obj.h / 2 + obj.h * 0.2, obj.w * 0.15, obj.h * 0.6);
        // Cushions
        ctx.strokeStyle = shadeColor(obj.color, -30);
        ctx.lineWidth = 1.5 / zoom;
        for (let i = 0; i < 3; i++) {
          ctx.strokeRect(-obj.w / 2 + i * (obj.w / 3), -obj.h / 2 + obj.h * 0.2, obj.w / 3, obj.h * 0.6);
        }
        break;
        
      case 'armchair':
        // Seat
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.2, obj.w, obj.h * 0.6);
        // Back
        ctx.fillStyle = shadeColor(obj.color, -15);
        ctx.fillRect(-obj.w / 2 + obj.w * 0.15, -obj.h / 2, obj.w * 0.7, obj.h * 0.3);
        // Arms
        ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.2, obj.w * 0.2, obj.h * 0.6);
        ctx.fillRect(obj.w / 2 - obj.w * 0.2, -obj.h / 2 + obj.h * 0.2, obj.w * 0.2, obj.h * 0.6);
        break;
        
      case 'table':
        // Table top
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        // Table edge (3D effect)
        ctx.fillStyle = shadeColor(obj.color, -20);
        ctx.fillRect(-obj.w / 2, obj.h / 2 - obj.h * 0.1, obj.w, obj.h * 0.1);
        // Legs
        const legSize = Math.min(obj.w, obj.h) * 0.08;
        ctx.fillStyle = shadeColor(obj.color, -30);
        ctx.fillRect(-obj.w / 2 + legSize, -obj.h / 2 + legSize, legSize, obj.h * 0.15);
        ctx.fillRect(obj.w / 2 - legSize * 2, -obj.h / 2 + legSize, legSize, obj.h * 0.15);
        ctx.fillRect(-obj.w / 2 + legSize, obj.h / 2 - obj.h * 0.15 - legSize, legSize, obj.h * 0.15);
        ctx.fillRect(obj.w / 2 - legSize * 2, obj.h / 2 - obj.h * 0.15 - legSize, legSize, obj.h * 0.15);
        break;
        
      case 'chair':
        // Seat
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.3, obj.w, obj.h * 0.5);
        // Back
        ctx.fillStyle = shadeColor(obj.color, -15);
        ctx.fillRect(-obj.w / 2 + obj.w * 0.15, -obj.h / 2, obj.w * 0.7, obj.h * 0.4);
        break;
        
      case 'dresser':
        // Main body
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        // Drawers
        ctx.strokeStyle = shadeColor(obj.color, -30);
        ctx.lineWidth = 2 / zoom;
        const drawerCount = 3;
        for (let i = 0; i < drawerCount; i++) {
          ctx.strokeRect(-obj.w / 2 + obj.w * 0.05, -obj.h / 2 + (i * obj.h / drawerCount) + obj.h * 0.05, obj.w * 0.9, (obj.h / drawerCount) - obj.h * 0.1);
          // Handles
          ctx.fillStyle = shadeColor(obj.color, -40);
          ctx.fillRect(-obj.w * 0.15, -obj.h / 2 + (i * obj.h / drawerCount) + obj.h / drawerCount / 2 - 2 / zoom, obj.w * 0.3, 4 / zoom);
        }
        break;
        
      case 'nightstand':
        // Main body
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        // Drawer
        ctx.strokeStyle = shadeColor(obj.color, -30);
        ctx.lineWidth = 2 / zoom;
        ctx.strokeRect(-obj.w / 2 + obj.w * 0.1, -obj.h / 2 + obj.h * 0.15, obj.w * 0.8, obj.h * 0.3);
        // Handle
        ctx.fillStyle = shadeColor(obj.color, -40);
        ctx.fillRect(-obj.w * 0.15, -obj.h / 2 + obj.h * 0.3, obj.w * 0.3, 3 / zoom);
        break;
        
      case 'desk':
        // Desktop
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        // Legs
        ctx.fillStyle = shadeColor(obj.color, -25);
        const deskLegW = obj.w * 0.1;
        ctx.fillRect(-obj.w / 2 + deskLegW, -obj.h / 2, deskLegW, obj.h);
        ctx.fillRect(obj.w / 2 - deskLegW * 2, -obj.h / 2, deskLegW, obj.h);
        break;
        
      case 'tv-stand':
        // Main body
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        // TV screen representation
        ctx.fillStyle = '#1F2937';
        ctx.fillRect(-obj.w / 2 + obj.w * 0.2, -obj.h / 2 - obj.h * 0.6, obj.w * 0.6, obj.h * 0.5);
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2 / zoom;
        ctx.strokeRect(-obj.w / 2 + obj.w * 0.2, -obj.h / 2 - obj.h * 0.6, obj.w * 0.6, obj.h * 0.5);
        break;
        
      case 'counter':
        // Counter top
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        // Cabinets
        ctx.strokeStyle = shadeColor(obj.color, -30);
        ctx.lineWidth = 2 / zoom;
        const cabinetCount = Math.floor(obj.w / 50);
        for (let i = 0; i < cabinetCount; i++) {
          ctx.strokeRect(-obj.w / 2 + (i * obj.w / cabinetCount) + obj.w * 0.02, -obj.h / 2 + obj.h * 0.1, (obj.w / cabinetCount) - obj.w * 0.04, obj.h * 0.8);
        }
        break;
        
      case 'wardrobe':
        // Main body
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        // Doors
        ctx.strokeStyle = shadeColor(obj.color, -30);
        ctx.lineWidth = 2 / zoom;
        ctx.strokeRect(-obj.w / 2 + obj.w * 0.02, -obj.h / 2 + obj.h * 0.05, obj.w / 2 - obj.w * 0.03, obj.h * 0.9);
        ctx.strokeRect(0 + obj.w * 0.01, -obj.h / 2 + obj.h * 0.05, obj.w / 2 - obj.w * 0.03, obj.h * 0.9);
        // Handles
        ctx.fillStyle = shadeColor(obj.color, -40);
        ctx.fillRect(-obj.w / 4 - obj.w * 0.05, 0, obj.w * 0.05, 4 / zoom);
        ctx.fillRect(obj.w / 4, 0, obj.w * 0.05, 4 / zoom);
        break;
        
      default:
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
    }
    
    ctx.restore();
  }

  function shadeColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
      (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
      .toString(16).slice(1);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw house outline with shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 20 / zoom;
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 5 / zoom;
      ctx.strokeRect(0, 0, houseWidth, houseHeight);
      ctx.shadowBlur = 0;

      // Draw rooms
      rooms.forEach(room => {
        ctx.fillStyle = room.color;
        ctx.fillRect(room.x, room.y, room.w, room.h);
        
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 2 / zoom;
        ctx.strokeRect(room.x, room.y, room.w, room.h);
        
        // Room labels with background
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        const labelPadding = 8 / zoom;
        const fontSize = 14 / zoom;
        ctx.font = `bold ${fontSize}px system-ui`;
        const metrics = ctx.measureText(room.label);
        const labelX = room.x + room.w / 2;
        const labelY = room.y + 20 / zoom;
        ctx.fillRect(labelX - metrics.width / 2 - labelPadding, labelY - fontSize - labelPadding / 2, 
                     metrics.width + labelPadding * 2, fontSize + labelPadding);
        
        ctx.fillStyle = "#E5E7EB";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(room.label, labelX, labelY - fontSize);
      });

      // Draw subtle grid
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 0.3 / zoom;
      for (let x = 0; x <= houseWidth; x += gridSize * 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, houseHeight);
        ctx.stroke();
      }
      for (let y = 0; y <= houseHeight; y += gridSize * 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(houseWidth, y);
        ctx.stroke();
      }

      // Draw furniture
      objects.forEach(obj => {
        drawFurniture(ctx, obj, zoom);
      });

      // Draw ghost
      if (dragging) {
        const bboxW = dragging.rotation % 180 === 0 ? dragging.w : dragging.h;
        const bboxH = dragging.rotation % 180 === 0 ? dragging.h : dragging.w;
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 2 / zoom;
        ctx.setLineDash([5 / zoom, 5 / zoom]);
        ctx.fillRect(dragging.snapX, dragging.snapY, bboxW, bboxH);
        ctx.strokeRect(dragging.snapX, dragging.snapY, bboxW, bboxH);
        ctx.setLineDash([]);
      }

      ctx.restore();
    };

    render();
  }, [objects, dragging, zoom, pan, selectedId]);

  function screenToWorld(screenX: number, screenY: number) {
    return {
      x: (screenX - pan.x) / zoom,
      y: (screenY - pan.y) / zoom
    };
  }

  function isPointInRotatedRect(obj: RoomObject, px: number, py: number) {
    const bboxW = obj.rotation % 180 === 0 ? obj.w : obj.h;
    const bboxH = obj.rotation % 180 === 0 ? obj.h : obj.w;
    const cx = obj.x + bboxW / 2;
    const cy = obj.y + bboxH / 2;
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

  function rotateObject(targetId: string) {
    setObjects(prev => {
      const idx = prev.findIndex(p => p.id === targetId);
      if (idx === -1) return prev;
      const obj = prev[idx];
      
      if (!obj.placed) return prev;
      
      const next = (obj.rotation + 90) % 360;
      const currBboxW = obj.rotation % 180 === 0 ? obj.w : obj.h;
      const currBboxH = obj.rotation % 180 === 0 ? obj.h : obj.w;
      const nextBboxW = next % 180 === 0 ? obj.w : obj.h;
      const nextBboxH = next % 180 === 0 ? obj.h : obj.w;

      const cx = obj.x + currBboxW / 2;
      const cy = obj.y + currBboxH / 2;

      let newX = cx - nextBboxW / 2;
      let newY = cy - nextBboxH / 2;

      newX = Math.max(0, Math.min(houseWidth - nextBboxW, newX));
      newY = Math.max(0, Math.min(houseHeight - nextBboxH, newY));

      const movedObj: RoomObject = { ...obj, x: newX, y: newY, rotation: next };
      const others = prev.filter(p => p.id !== targetId);
      const overlap = others.some(o => isOverlapping(movedObj, o));
      
      if (overlap) return prev;
      
      setHistory(h => [...h, prev]);
      return prev.map((p, i) => (i === idx ? movedObj : p));
    });
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY);

    if (spacePressed || e.button === 1 || e.shiftKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setLastPan({ ...pan });
      return;
    }

    const foundObj = [...objects].reverse().find(o => isPointInRotatedRect(o, world.x, world.y));
    
    if (foundObj) {
      setSelectedId(foundObj.id);
      setDragging({
        ...foundObj,
        offsetX: world.x - foundObj.x,
        offsetY: world.y - foundObj.y,
        snapX: foundObj.x,
        snapY: foundObj.y,
      });
    } else {
      setSelectedId(null);
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPan({
        x: lastPan.x + dx,
        y: lastPan.y + dy
      });
      return;
    }

    if (!dragging) return;

    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY);

    const bboxW = dragging.rotation % 180 === 0 ? dragging.w : dragging.h;
    const bboxH = dragging.rotation % 180 === 0 ? dragging.h : dragging.w;

    const objectCenterX = world.x - dragging.offsetX + bboxW / 2;
    const objectCenterY = world.y - dragging.offsetY + bboxH / 2;

    let snapCenterX = Math.round(objectCenterX / gridSize) * gridSize;
    let snapCenterY = Math.round(objectCenterY / gridSize) * gridSize;

    let snapX = snapCenterX - bboxW / 2;
    let snapY = snapCenterY - bboxH / 2;

    snapX = Math.max(0, Math.min(houseWidth - bboxW, snapX));
    snapY = Math.max(0, Math.min(houseHeight - bboxH, snapY));

    setDragging({ ...dragging, snapX, snapY });
  }

  function handleMouseUp() {
    setIsPanning(false);
    
    if (dragging) {
      const movedObj = { ...dragging, x: dragging.snapX, y: dragging.snapY, placed: true };
      const others = objects.filter(o => o.id !== dragging.id);
      const overlap = others.some(o => isOverlapping(movedObj, o));
      
      const bboxW = movedObj.rotation % 180 === 0 ? movedObj.w : movedObj.h;
      const bboxH = movedObj.rotation % 180 === 0 ? movedObj.h : movedObj.w;
      const insideHouse =
        movedObj.x >= 0 &&
        movedObj.y >= 0 &&
        movedObj.x + bboxW <= houseWidth &&
        movedObj.y + bboxH <= houseHeight;

      if (!overlap && insideHouse) {
        setHistory(prev => [...prev, objects]);
        setObjects(prev =>
          prev.map(o =>
            o.id === dragging.id
              ? { ...o, x: dragging.snapX, y: dragging.snapY, placed: true }
              : o
          )
        );
      }
      setDragging(null);
    }
  }

  function handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const worldBeforeX = (mouseX - pan.x) / zoom;
    const worldBeforeY = (mouseY - pan.y) / zoom;
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.3, Math.min(3, zoom * delta));
    
    const worldAfterX = (mouseX - pan.x) / newZoom;
    const worldAfterY = (mouseY - pan.y) / newZoom;
    
    const panX = pan.x - (worldAfterX - worldBeforeX) * newZoom;
    const panY = pan.y - (worldAfterY - worldBeforeY) * newZoom;
    
    setZoom(newZoom);
    setPan({ x: panX, y: panY });
  }

  function handleUndo() {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setObjects(prev);
      setHistory(history.slice(0, -1));
    }
  }

  function handleZoomIn() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const worldBeforeX = (centerX - pan.x) / zoom;
    const worldBeforeY = (centerY - pan.y) / zoom;
    
    const newZoom = Math.min(3, zoom * 1.2);
    
    const worldAfterX = (centerX - pan.x) / newZoom;
    const worldAfterY = (centerY - pan.y) / newZoom;
    
    const panX = pan.x - (worldAfterX - worldBeforeX) * newZoom;
    const panY = pan.y - (worldAfterY - worldBeforeY) * newZoom;
    
    setZoom(newZoom);
    setPan({ x: panX, y: panY });
  }

  function handleZoomOut() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const worldBeforeX = (centerX - pan.x) / zoom;
    const worldBeforeY = (centerY - pan.y) / zoom;
    
    const newZoom = Math.max(0.3, zoom / 1.2);
    
    const worldAfterX = (centerX - pan.x) / newZoom;
    const worldAfterY = (centerY - pan.y) / newZoom;
    
    const panX = pan.x - (worldAfterX - worldBeforeX) * newZoom;
    const panY = pan.y - (worldAfterY - worldBeforeY) * newZoom;
    
    setZoom(newZoom);
    setPan({ x: panX, y: panY });
  }

  function handleResetView() {
    setZoom(0.7);
    setPan({ x: 150, y: 80 });
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-700/50 p-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg">
              <Home className="w-5 h-5 text-white" />
              <h1 className="text-xl font-bold text-white">House Designer</h1>
            </div>
            
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Undo className="w-4 h-4" />
              Undo
            </button>
            
            {selectedId && (
              <button
                onClick={() => rotateObject(selectedId)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <RotateCw className="w-4 h-4" />
                Rotate
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <div className="px-4 py-2 bg-slate-800 text-white rounded-lg min-w-[90px] text-center text-sm font-mono font-semibold shadow-lg">
              {Math.round(zoom * 100)}%
            </div>
            
            <button
              onClick={handleZoomIn}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleResetView}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info bar */}
        <div className="bg-slate-900/60 backdrop-blur-sm border-b border-slate-700/30 px-6 py-3 text-sm text-slate-300 flex items-center gap-8 shadow-lg">
          <span className="flex items-center gap-2 font-medium">
            <Move className="w-4 h-4 text-violet-400" />
            Drag furniture to arrange your rooms
          </span>
          <span className="text-slate-400">Press <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono mx-1 border border-slate-700">R</kbd> to rotate</span>
          <span className="text-slate-400">Hold <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono mx-1 border border-slate-700">Space</kbd> or <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono mx-1 border border-slate-700">Shift</kbd> to pan</span>
          <span className="text-slate-400">Scroll to zoom</span>
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="flex-1 relative overflow-hidden bg-slate-950">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className={`w-full h-full ${isPanning ? 'cursor-grabbing' : dragging ? 'cursor-grabbing' : 'cursor-default'}`}
          />
        </div>
      </div>
    </div>
  );
}