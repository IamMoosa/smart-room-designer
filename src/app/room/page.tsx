"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCw, Undo, Move, Home, Target } from "lucide-react";

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
  roomId?: string;
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
    { id: 'sofa-2', x: 250, y: 50, w: 180, h: 80, color: '#7C3AED', label: 'Sofa', rotation: 0, placed: false, type: 'sofa' },
    { id: 'armchair-1', x: 50, y: 150, w: 80, h: 80, color: '#A78BFA', label: 'Armchair', rotation: 0, placed: false, type: 'armchair' },
    { id: 'armchair-2', x: 150, y: 150, w: 80, h: 80, color: '#A78BFA', label: 'Armchair', rotation: 0, placed: false, type: 'armchair' },
    { id: 'armchair-3', x: 250, y: 150, w: 80, h: 80, color: '#C4B5FD', label: 'Armchair', rotation: 0, placed: false, type: 'armchair' },
    { id: 'coffee-table-1', x: 50, y: 250, w: 100, h: 60, color: '#D8B4FE', label: 'Coffee Table', rotation: 0, placed: false, type: 'table' },
    { id: 'coffee-table-2', x: 170, y: 250, w: 100, h: 60, color: '#E9D5FF', label: 'Coffee Table', rotation: 0, placed: false, type: 'table' },
    { id: 'tv-stand-1', x: 50, y: 330, w: 120, h: 40, color: '#4C1D95', label: 'TV Stand', rotation: 0, placed: false, type: 'tv-stand' },
    { id: 'tv-stand-2', x: 190, y: 330, w: 120, h: 40, color: '#6B21A8', label: 'TV Stand', rotation: 0, placed: false, type: 'tv-stand' },
    { id: 'bookshelf-1', x: 330, y: 50, w: 60, h: 150, color: '#92400E', label: 'Bookshelf', rotation: 0, placed: false, type: 'bookshelf' },
    { id: 'bookshelf-2', x: 410, y: 50, w: 60, h: 150, color: '#B45309', label: 'Bookshelf', rotation: 0, placed: false, type: 'bookshelf' },
    { id: 'plant-1', x: 330, y: 220, w: 40, h: 40, color: '#22C55E', label: 'Plant', rotation: 0, placed: false, type: 'decor' },
    { id: 'plant-2', x: 390, y: 220, w: 40, h: 40, color: '#16A34A', label: 'Plant', rotation: 0, placed: false, type: 'decor' },
    { id: 'plant-3', x: 450, y: 220, w: 40, h: 40, color: '#15803D', label: 'Plant', rotation: 0, placed: false, type: 'decor' },
    
    // Kitchen & Dining
    { id: 'dining-table-1', x: 50, y: 400, w: 140, h: 90, color: '#F59E0B', label: 'Dining Table', rotation: 0, placed: false, type: 'table' },
    { id: 'dining-table-2', x: 210, y: 400, w: 140, h: 90, color: '#FBBF24', label: 'Dining Table', rotation: 0, placed: false, type: 'table' },
    { id: 'dining-chair-1', x: 50, y: 510, w: 45, h: 45, color: '#FBBF24', label: 'Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'dining-chair-2', x: 110, y: 510, w: 45, h: 45, color: '#FBBF24', label: 'Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'dining-chair-3', x: 170, y: 510, w: 45, h: 45, color: '#FBBF24', label: 'Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'dining-chair-4', x: 230, y: 510, w: 45, h: 45, color: '#FBBF24', label: 'Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'dining-chair-5', x: 290, y: 510, w: 45, h: 45, color: '#F97316', label: 'Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'dining-chair-6', x: 350, y: 510, w: 45, h: 45, color: '#F97316', label: 'Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'kitchen-counter-1', x: 50, y: 580, w: 200, h: 60, color: '#D97706', label: 'Counter', rotation: 0, placed: false, type: 'counter' },
    { id: 'kitchen-counter-2', x: 270, y: 580, w: 200, h: 60, color: '#EA580C', label: 'Counter', rotation: 0, placed: false, type: 'counter' },
    { id: 'fridge-1', x: 50, y: 660, w: 80, h: 80, color: '#1E40AF', label: 'Fridge', rotation: 0, placed: false, type: 'appliance' },
    { id: 'stove-1', x: 150, y: 660, w: 80, h: 80, color: '#DC2626', label: 'Stove', rotation: 0, placed: false, type: 'appliance' },
    { id: 'microwave-1', x: 250, y: 660, w: 60, h: 50, color: '#525252', label: 'Microwave', rotation: 0, placed: false, type: 'appliance' },
    
    // Master Bedroom
    { id: 'king-bed-1', x: 50, y: 50, w: 200, h: 180, color: '#3B82F6', label: 'King Bed', rotation: 0, placed: false, type: 'bed' },
    { id: 'queen-bed-1', x: 280, y: 50, w: 160, h: 160, color: '#1D4ED8', label: 'Queen Bed', rotation: 0, placed: false, type: 'bed' },
    { id: 'nightstand-1', x: 50, y: 250, w: 50, h: 50, color: '#60A5FA', label: 'Nightstand', rotation: 0, placed: false, type: 'nightstand' },
    { id: 'nightstand-2', x: 120, y: 250, w: 50, h: 50, color: '#60A5FA', label: 'Nightstand', rotation: 0, placed: false, type: 'nightstand' },
    { id: 'nightstand-3', x: 280, y: 250, w: 50, h: 50, color: '#3B82F6', label: 'Nightstand', rotation: 0, placed: false, type: 'nightstand' },
    { id: 'nightstand-4', x: 350, y: 250, w: 50, h: 50, color: '#3B82F6', label: 'Nightstand', rotation: 0, placed: false, type: 'nightstand' },
    { id: 'dresser-1', x: 190, y: 250, w: 120, h: 55, color: '#2563EB', label: 'Dresser', rotation: 0, placed: false, type: 'dresser' },
    { id: 'dresser-2', x: 420, y: 250, w: 120, h: 55, color: '#1E40AF', label: 'Dresser', rotation: 0, placed: false, type: 'dresser' },
    { id: 'mirror-1', x: 50, y: 320, w: 80, h: 120, color: '#E0E7FF', label: 'Mirror', rotation: 0, placed: false, type: 'decor' },
    { id: 'mirror-2', x: 420, y: 320, w: 80, h: 120, color: '#E0E7FF', label: 'Mirror', rotation: 0, placed: false, type: 'decor' },
    
    // Bedroom 2
    { id: 'single-bed-1', x: 50, y: 50, w: 100, h: 180, color: '#10B981', label: 'Single Bed', rotation: 0, placed: false, type: 'bed' },
    { id: 'single-bed-2', x: 170, y: 50, w: 100, h: 180, color: '#059669', label: 'Single Bed', rotation: 0, placed: false, type: 'bed' },
    { id: 'bunk-bed-1', x: 290, y: 50, w: 100, h: 200, color: '#0D9488', label: 'Bunk Bed', rotation: 0, placed: false, type: 'bed' },
    { id: 'desk-1', x: 50, y: 250, w: 120, h: 60, color: '#34D399', label: 'Desk', rotation: 0, placed: false, type: 'desk' },
    { id: 'desk-2', x: 190, y: 250, w: 120, h: 60, color: '#2DD4BF', label: 'Desk', rotation: 0, placed: false, type: 'desk' },
    { id: 'desk-chair-1', x: 50, y: 330, w: 50, h: 50, color: '#6EE7B7', label: 'Desk Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'desk-chair-2', x: 120, y: 330, w: 50, h: 50, color: '#5EEAD4', label: 'Desk Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'desk-chair-3', x: 190, y: 330, w: 50, h: 50, color: '#5EEAD4', label: 'Desk Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'wardrobe-1', x: 310, y: 250, w: 90, h: 60, color: '#059669', label: 'Wardrobe', rotation: 0, placed: false, type: 'wardrobe' },
    { id: 'wardrobe-2', x: 310, y: 330, w: 90, h: 60, color: '#10B981', label: 'Wardrobe', rotation: 0, placed: false, type: 'wardrobe' },
    { id: 'gaming-chair-1', x: 310, y: 410, w: 70, h: 70, color: '#14B8A6', label: 'Gaming Chair', rotation: 0, placed: false, type: 'chair' },
    
    // Bathroom
    { id: 'bathtub-1', x: 50, y: 50, w: 140, h: 100, color: '#DBEAFE', label: 'Bathtub', rotation: 0, placed: false, type: 'fixture' },
    { id: 'toilet-1', x: 210, y: 50, w: 60, h: 70, color: '#F3F4F6', label: 'Toilet', rotation: 0, placed: false, type: 'fixture' },
    { id: 'sink-1', x: 50, y: 170, w: 100, h: 50, color: '#E5E7EB', label: 'Sink', rotation: 0, placed: false, type: 'fixture' },
    { id: 'sink-2', x: 170, y: 170, w: 100, h: 50, color: '#E5E7EB', label: 'Sink', rotation: 0, placed: false, type: 'fixture' },
    { id: 'cabinet-1', x: 50, y: 240, w: 80, h: 60, color: '#D1D5DB', label: 'Cabinet', rotation: 0, placed: false, type: 'storage' },
    { id: 'cabinet-2', x: 150, y: 240, w: 80, h: 60, color: '#D1D5DB', label: 'Cabinet', rotation: 0, placed: false, type: 'storage' },
    { id: 'cabinet-3', x: 250, y: 240, w: 80, h: 60, color: '#D1D5DB', label: 'Cabinet', rotation: 0, placed: false, type: 'storage' },
    { id: 'shower-1', x: 210, y: 150, w: 80, h: 80, color: '#C7D2E0', label: 'Shower', rotation: 0, placed: false, type: 'fixture' },
    
    // Hallway & Decorative
    { id: 'coat-rack-1', x: 50, y: 50, w: 50, h: 50, color: '#8B7355', label: 'Coat Rack', rotation: 0, placed: false, type: 'decor' },
    { id: 'shoe-rack-1', x: 120, y: 50, w: 80, h: 40, color: '#A0826D', label: 'Shoe Rack', rotation: 0, placed: false, type: 'storage' },
    { id: 'wall-art-1', x: 50, y: 120, w: 60, h: 80, color: '#F472B6', label: 'Wall Art', rotation: 0, placed: false, type: 'decor' },
    { id: 'wall-art-2', x: 130, y: 120, w: 60, h: 80, color: '#EC4899', label: 'Wall Art', rotation: 0, placed: false, type: 'decor' },
    { id: 'console-table-1', x: 50, y: 220, w: 100, h: 40, color: '#78350F', label: 'Console Table', rotation: 0, placed: false, type: 'table' },
    
    // Balcony
    { id: 'lounge-chair-1', x: 50, y: 50, w: 100, h: 80, color: '#FBBF24', label: 'Lounge Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'lounge-chair-2', x: 170, y: 50, w: 100, h: 80, color: '#F59E0B', label: 'Lounge Chair', rotation: 0, placed: false, type: 'chair' },
    { id: 'outdoor-table-1', x: 50, y: 150, w: 120, h: 80, color: '#D97706', label: 'Outdoor Table', rotation: 0, placed: false, type: 'table' },
    { id: 'outdoor-umbrella-1', x: 190, y: 150, w: 80, h: 80, color: '#EA580C', label: 'Umbrella', rotation: 0, placed: false, type: 'decor' },
    { id: 'outdoor-plant-1', x: 50, y: 250, w: 50, h: 50, color: '#22C55E', label: 'Plant', rotation: 0, placed: false, type: 'decor' },
    { id: 'outdoor-plant-2', x: 120, y: 250, w: 50, h: 50, color: '#16A34A', label: 'Plant', rotation: 0, placed: false, type: 'decor' },
    { id: 'outdoor-plant-3', x: 190, y: 250, w: 50, h: 50, color: '#15803D', label: 'Plant', rotation: 0, placed: false, type: 'decor' },
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

  // Check achievements
  useEffect(() => {
    // No achievement logic needed
  }, [objects]);

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
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        ctx.fillStyle = shadeColor(obj.color, -20);
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h * 0.2);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(-obj.w / 2 + obj.w * 0.15, -obj.h / 2 + obj.h * 0.1, obj.w * 0.3, obj.h * 0.15);
        ctx.fillRect(-obj.w / 2 + obj.w * 0.55, -obj.h / 2 + obj.h * 0.1, obj.w * 0.3, obj.h * 0.15);
        ctx.globalAlpha = 1;
        break;
        
      case 'sofa':
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.2, obj.w, obj.h * 0.6);
        ctx.fillStyle = shadeColor(obj.color, -15);
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h * 0.3);
        ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.2, obj.w * 0.15, obj.h * 0.6);
        ctx.fillRect(obj.w / 2 - obj.w * 0.15, -obj.h / 2 + obj.h * 0.2, obj.w * 0.15, obj.h * 0.6);
        ctx.strokeStyle = shadeColor(obj.color, -30);
        ctx.lineWidth = 1.5 / zoom;
        for (let i = 0; i < 3; i++) {
          ctx.strokeRect(-obj.w / 2 + i * (obj.w / 3), -obj.h / 2 + obj.h * 0.2, obj.w / 3, obj.h * 0.6);
        }
        break;
        
      case 'armchair':
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.2, obj.w, obj.h * 0.6);
        ctx.fillStyle = shadeColor(obj.color, -15);
        ctx.fillRect(-obj.w / 2 + obj.w * 0.15, -obj.h / 2, obj.w * 0.7, obj.h * 0.3);
        ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.2, obj.w * 0.2, obj.h * 0.6);
        ctx.fillRect(obj.w / 2 - obj.w * 0.2, -obj.h / 2 + obj.h * 0.2, obj.w * 0.2, obj.h * 0.6);
        break;
        
      case 'table':
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        ctx.fillStyle = shadeColor(obj.color, -20);
        ctx.fillRect(-obj.w / 2, obj.h / 2 - obj.h * 0.1, obj.w, obj.h * 0.1);
        const legSize = Math.min(obj.w, obj.h) * 0.08;
        ctx.fillStyle = shadeColor(obj.color, -30);
        ctx.fillRect(-obj.w / 2 + legSize, -obj.h / 2 + legSize, legSize, obj.h * 0.15);
        ctx.fillRect(obj.w / 2 - legSize * 2, -obj.h / 2 + legSize, legSize, obj.h * 0.15);
        ctx.fillRect(-obj.w / 2 + legSize, obj.h / 2 - obj.h * 0.15 - legSize, legSize, obj.h * 0.15);
        ctx.fillRect(obj.w / 2 - legSize * 2, obj.h / 2 - obj.h * 0.15 - legSize, legSize, obj.h * 0.15);
        break;
        
      case 'chair':
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.3, obj.w, obj.h * 0.5);
        ctx.fillStyle = shadeColor(obj.color, -15);
        ctx.fillRect(-obj.w / 2 + obj.w * 0.15, -obj.h / 2, obj.w * 0.7, obj.h * 0.4);
        break;
        
      case 'dresser':
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        ctx.strokeStyle = shadeColor(obj.color, -30);
        ctx.lineWidth = 2 / zoom;
        const drawerCount = 3;
        for (let i = 0; i < drawerCount; i++) {
          ctx.strokeRect(-obj.w / 2 + obj.w * 0.05, -obj.h / 2 + (i * obj.h / drawerCount) + obj.h * 0.05, obj.w * 0.9, (obj.h / drawerCount) - obj.h * 0.1);
          ctx.fillStyle = shadeColor(obj.color, -40);
          ctx.fillRect(-obj.w * 0.15, -obj.h / 2 + (i * obj.h / drawerCount) + obj.h / drawerCount / 2 - 2 / zoom, obj.w * 0.3, 4 / zoom);
        }
        break;
        
      case 'nightstand':
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        ctx.strokeStyle = shadeColor(obj.color, -30);
        ctx.lineWidth = 2 / zoom;
        ctx.strokeRect(-obj.w / 2 + obj.w * 0.1, -obj.h / 2 + obj.h * 0.15, obj.w * 0.8, obj.h * 0.3);
        ctx.fillStyle = shadeColor(obj.color, -40);
        ctx.fillRect(-obj.w * 0.15, -obj.h / 2 + obj.h * 0.3, obj.w * 0.3, 3 / zoom);
        break;
        
      case 'desk':
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        ctx.fillStyle = shadeColor(obj.color, -25);
        const deskLegW = obj.w * 0.1;
        ctx.fillRect(-obj.w / 2 + deskLegW, -obj.h / 2, deskLegW, obj.h);
        ctx.fillRect(obj.w / 2 - deskLegW * 2, -obj.h / 2, deskLegW, obj.h);
        break;
        
      case 'tv-stand':
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        ctx.fillStyle = '#1F2937';
        ctx.fillRect(-obj.w / 2 + obj.w * 0.2, -obj.h / 2 - obj.h * 0.6, obj.w * 0.6, obj.h * 0.5);
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2 / zoom;
        ctx.strokeRect(-obj.w / 2 + obj.w * 0.2, -obj.h / 2 - obj.h * 0.6, obj.w * 0.6, obj.h * 0.5);
        break;
        
      case 'counter':
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        ctx.strokeStyle = shadeColor(obj.color, -30);
        ctx.lineWidth = 2 / zoom;
        const cabinetCount = Math.floor(obj.w / 50);
        for (let i = 0; i < cabinetCount; i++) {
          ctx.strokeRect(-obj.w / 2 + (i * obj.w / cabinetCount) + obj.w * 0.02, -obj.h / 2 + obj.h * 0.1, (obj.w / cabinetCount) - obj.w * 0.04, obj.h * 0.8);
        }
        break;
        
      case 'wardrobe':
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
        ctx.strokeStyle = shadeColor(obj.color, -30);
        ctx.lineWidth = 2 / zoom;
        ctx.strokeRect(-obj.w / 2 + obj.w * 0.02, -obj.h / 2 + obj.h * 0.05, obj.w / 2 - obj.w * 0.03, obj.h * 0.9);
        ctx.strokeRect(0 + obj.w * 0.01, -obj.h / 2 + obj.h * 0.05, obj.w / 2 - obj.w * 0.03, obj.h * 0.9);
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 20 / zoom;
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 5 / zoom;
    ctx.strokeRect(0, 0, houseWidth, houseHeight);
    ctx.shadowBlur = 0;

    rooms.forEach(room => {
      ctx.fillStyle = room.color;
      ctx.fillRect(room.x, room.y, room.w, room.h);
      
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 2 / zoom;
      ctx.strokeRect(room.x, room.y, room.w, room.h);
      
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

    objects.forEach(obj => {
      drawFurniture(ctx, obj, zoom);
    });

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
        const wasPlaced = objects.find(o => o.id === dragging.id)?.placed;
        
        setHistory(prev => [...prev, objects]);
        setObjects(prev =>
          prev.map(o =>
            o.id === dragging.id
              ? { ...o, x: dragging.snapX, y: dragging.snapY, placed: true }
              : o
          )
        );
        
        if (!wasPlaced) {
          // Object placed successfully
        }
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

  const placedCount = objects.filter(o => o.placed).length;
  const totalCount = objects.length;
  const progress = (placedCount / totalCount) * 100;

  return (
    <>
      <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-700/50 p-4 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg shadow-lg">
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
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-slate-800 rounded-lg flex flex-col gap-1">
                    <span className="text-white text-sm font-semibold">{objects.find(o => o.id === selectedId)?.label}</span>
                    <span className="text-slate-400 text-xs">{objects.find(o => o.id === selectedId)?.type}</span>
                  </div>
                  <button
                    onClick={() => rotateObject(selectedId)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <RotateCw className="w-4 h-4" />
                    Rotate
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-3">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Target className="w-4 h-4 text-violet-400" />
                  <span>{placedCount}/{totalCount} Placed</span>
                </div>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
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
          <div className="bg-slate-900/60 backdrop-blur-sm border-b border-slate-700/30 px-6 py-3 text-sm text-slate-300 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-8">
              <span className="flex items-center gap-2 font-medium">
                <Move className="w-4 h-4 text-violet-400" />
                Drag furniture to arrange your rooms
              </span>
              <span className="text-slate-400">Press <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono mx-1 border border-slate-700">R</kbd> to rotate</span>
              <span className="text-slate-400">Hold <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono mx-1 border border-slate-700">Space</kbd> or <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono mx-1 border border-slate-700">Shift</kbd> to pan</span>
            </div>
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
    </>
  );
}