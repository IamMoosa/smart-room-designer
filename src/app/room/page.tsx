"use client";

import { useEffect, useRef } from "react";
import { Toolbar } from "./components/Toolbar";
import { InfoBar } from "./components/InfoBar";
import { CanvasComponent } from "./components/Canvas";
import { useRoomDesigner } from "./hooks/useRoomDesigner";
import { RoomObject } from "./types";

const initialFurniture: RoomObject[] = [
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
  { id: 'bathtub-1', x: 50, y: 50, w: 140, h: 100, color: '#DBEAFE', label: 'Bathtub', rotation: 0, placed: false, type: 'fixture' },
  { id: 'toilet-1', x: 210, y: 50, w: 60, h: 70, color: '#F3F4F6', label: 'Toilet', rotation: 0, placed: false, type: 'fixture' },
  { id: 'sink-1', x: 50, y: 170, w: 100, h: 50, color: '#E5E7EB', label: 'Sink', rotation: 0, placed: false, type: 'fixture' },
  { id: 'sink-2', x: 170, y: 170, w: 100, h: 50, color: '#E5E7EB', label: 'Sink', rotation: 0, placed: false, type: 'fixture' },
  { id: 'cabinet-1', x: 50, y: 240, w: 80, h: 60, color: '#D1D5DB', label: 'Cabinet', rotation: 0, placed: false, type: 'storage' },
  { id: 'cabinet-2', x: 150, y: 240, w: 80, h: 60, color: '#D1D5DB', label: 'Cabinet', rotation: 0, placed: false, type: 'storage' },
  { id: 'cabinet-3', x: 250, y: 240, w: 80, h: 60, color: '#D1D5DB', label: 'Cabinet', rotation: 0, placed: false, type: 'storage' },
  { id: 'shower-1', x: 210, y: 150, w: 80, h: 80, color: '#C7D2E0', label: 'Shower', rotation: 0, placed: false, type: 'fixture' },
  { id: 'coat-rack-1', x: 50, y: 50, w: 50, h: 50, color: '#8B7355', label: 'Coat Rack', rotation: 0, placed: false, type: 'decor' },
  { id: 'shoe-rack-1', x: 120, y: 50, w: 80, h: 40, color: '#A0826D', label: 'Shoe Rack', rotation: 0, placed: false, type: 'storage' },
  { id: 'wall-art-1', x: 50, y: 120, w: 60, h: 80, color: '#F472B6', label: 'Wall Art', rotation: 0, placed: false, type: 'decor' },
  { id: 'wall-art-2', x: 130, y: 120, w: 60, h: 80, color: '#EC4899', label: 'Wall Art', rotation: 0, placed: false, type: 'decor' },
  { id: 'console-table-1', x: 50, y: 220, w: 100, h: 40, color: '#78350F', label: 'Console Table', rotation: 0, placed: false, type: 'table' },
  { id: 'lounge-chair-1', x: 50, y: 50, w: 100, h: 80, color: '#FBBF24', label: 'Lounge Chair', rotation: 0, placed: false, type: 'chair' },
  { id: 'lounge-chair-2', x: 170, y: 50, w: 100, h: 80, color: '#F59E0B', label: 'Lounge Chair', rotation: 0, placed: false, type: 'chair' },
  { id: 'outdoor-table-1', x: 50, y: 150, w: 120, h: 80, color: '#D97706', label: 'Outdoor Table', rotation: 0, placed: false, type: 'table' },
  { id: 'outdoor-umbrella-1', x: 190, y: 150, w: 80, h: 80, color: '#EA580C', label: 'Umbrella', rotation: 0, placed: false, type: 'decor' },
  { id: 'outdoor-plant-1', x: 50, y: 250, w: 50, h: 50, color: '#22C55E', label: 'Plant', rotation: 0, placed: false, type: 'decor' },
  { id: 'outdoor-plant-2', x: 120, y: 250, w: 50, h: 50, color: '#16A34A', label: 'Plant', rotation: 0, placed: false, type: 'decor' },
  { id: 'outdoor-plant-3', x: 190, y: 250, w: 50, h: 50, color: '#15803D', label: 'Plant', rotation: 0, placed: false, type: 'decor' },
];

export default function HouseLayoutDesigner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    objects,
    dragging,
    selectedId,
    zoom,
    pan,
    isPanning,
    placedCount,
    totalCount,
    rotateObject,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleUndo,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
  } = useRoomDesigner(initialFurniture);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if ((e.key === "r" || e.key === "R") && selectedId && !e.repeat) {
        e.preventDefault();
        rotateObject(selectedId);
      }
    }
    
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedId, rotateObject]);

  const selectedObject = objects.find(o => o.id === selectedId);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex overflow-hidden">
      <div className="flex-1 flex flex-col">
        <Toolbar
          onZoomIn={() => handleZoomIn(canvasRef.current)}
          onZoomOut={() => handleZoomOut(canvasRef.current)}
          onRotate={() => selectedId && rotateObject(selectedId)}
          onUndo={handleUndo}
          zoom={zoom}
          canUndo={true}
          selectedLabel={selectedObject?.label}
          selectedType={selectedObject?.type}
          placedCount={placedCount}
          totalCount={totalCount}
          onResetView={handleResetView}
        />

        <InfoBar />

        <CanvasComponent
          ref={canvasRef}
          objects={objects}
          dragging={dragging}
          selectedId={selectedId}
          zoom={zoom}
          pan={pan}
          onMouseDown={(e) => handleMouseDown(e, canvasRef.current)}
          onMouseMove={(e) => handleMouseMove(e, canvasRef.current)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={(e) => handleWheel(e, canvasRef.current)}
          isPanning={isPanning}
        />
      </div>
    </div>
  );
}
