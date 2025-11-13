import { useState, useCallback, useEffect } from "react";
import { RoomObject, DraggingObject } from "../types";
import { isOverlapping, isPointInRotatedRect } from "../utils";
import { GRID_SIZE, HOUSE_WIDTH, HOUSE_HEIGHT } from "../constants";

export function useRoomDesigner(initialFurniture: RoomObject[]) {
  const [objects, setObjects] = useState<RoomObject[]>(initialFurniture);
  const [dragging, setDragging] = useState<DraggingObject | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<RoomObject[][]>([]);
  const [zoom, setZoom] = useState(0.7);
  const [pan, setPan] = useState({ x: 150, y: 80 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    return {
      x: (screenX - pan.x) / zoom,
      y: (screenY - pan.y) / zoom
    };
  }, [pan, zoom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const rotateObject = useCallback((targetId: string) => {
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

      newX = Math.max(0, Math.min(HOUSE_WIDTH - nextBboxW, newX));
      newY = Math.max(0, Math.min(HOUSE_HEIGHT - nextBboxH, newY));

      const movedObj: RoomObject = { ...obj, x: newX, y: newY, rotation: next };
      const others = prev.filter(p => p.id !== targetId);
      const overlap = others.some(o => isOverlapping(movedObj, o));
      
      if (overlap) return prev;
      
      setHistory(h => [...h, prev]);
      return prev.map((p, i) => (i === idx ? movedObj : p));
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>, canvasRef: HTMLCanvasElement | null) => {
    if (!canvasRef) return;
    const rect = canvasRef.getBoundingClientRect();
    
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY);

    // Space bar panning (Figma-style)
    if (isSpacePressed) {
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
  }, [objects, screenToWorld, pan, isSpacePressed]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>, canvasRef: HTMLCanvasElement | null) => {
    if (!canvasRef) return;

    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPan({
        x: lastPan.x + dx,
        y: lastPan.y + dy
      });
      return;
    }

    if (!dragging || isSpacePressed) return;

    const rect = canvasRef.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY);

    const bboxW = dragging.rotation % 180 === 0 ? dragging.w : dragging.h;
    const bboxH = dragging.rotation % 180 === 0 ? dragging.h : dragging.w;

    const objectCenterX = world.x - dragging.offsetX + bboxW / 2;
    const objectCenterY = world.y - dragging.offsetY + bboxH / 2;

    let snapCenterX = Math.round(objectCenterX / GRID_SIZE) * GRID_SIZE;
    let snapCenterY = Math.round(objectCenterY / GRID_SIZE) * GRID_SIZE;

    let snapX = snapCenterX - bboxW / 2;
    let snapY = snapCenterY - bboxH / 2;

    snapX = Math.max(0, Math.min(HOUSE_WIDTH - bboxW, snapX));
    snapY = Math.max(0, Math.min(HOUSE_HEIGHT - bboxH, snapY));

    setDragging({ ...dragging, snapX, snapY });
  }, [dragging, isPanning, panStart, lastPan, screenToWorld, isSpacePressed]);

  const handleMouseUp = useCallback(() => {
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
        movedObj.x + bboxW <= HOUSE_WIDTH &&
        movedObj.y + bboxH <= HOUSE_HEIGHT;

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
  }, [dragging, objects]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>, canvasRef: HTMLCanvasElement | null) => {
    if (!canvasRef) return;
    
    // Alt + Scroll = Zoom
    if (e.altKey) {
      e.preventDefault();
      
      const rect = canvasRef.getBoundingClientRect();
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
      return;
    }
    
    // Touchpad pan: smooth scroll without modifier (deltaMode 0 = pixels, higher = lines/pages)
    // Trackpad produces small pixel values, allow natural panning
    if (!dragging && !isSpacePressed && e.deltaMode === 0) {
      e.preventDefault();
      // Invert X and Y for natural pan direction
      setPan(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  }, [zoom, pan, dragging, isSpacePressed]);

  const handleUndo = useCallback(() => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setObjects(prev);
      setHistory(history.slice(0, -1));
    }
  }, [history]);

  const handleZoomIn = useCallback((canvasRef: HTMLCanvasElement | null) => {
    if (!canvasRef) return;
    
    const centerX = canvasRef.width / 2;
    const centerY = canvasRef.height / 2;
    
    const worldBeforeX = (centerX - pan.x) / zoom;
    const worldBeforeY = (centerY - pan.y) / zoom;
    
    const newZoom = Math.min(3, zoom * 1.2);
    
    const worldAfterX = (centerX - pan.x) / newZoom;
    const worldAfterY = (centerY - pan.y) / newZoom;
    
    const panX = pan.x - (worldAfterX - worldBeforeX) * newZoom;
    const panY = pan.y - (worldAfterY - worldBeforeY) * newZoom;
    
    setZoom(newZoom);
    setPan({ x: panX, y: panY });
  }, [zoom, pan]);

  const handleZoomOut = useCallback((canvasRef: HTMLCanvasElement | null) => {
    if (!canvasRef) return;
    
    const centerX = canvasRef.width / 2;
    const centerY = canvasRef.height / 2;
    
    const worldBeforeX = (centerX - pan.x) / zoom;
    const worldBeforeY = (centerY - pan.y) / zoom;
    
    const newZoom = Math.max(0.3, zoom / 1.2);
    
    const worldAfterX = (centerX - pan.x) / newZoom;
    const worldAfterY = (centerY - pan.y) / newZoom;
    
    const panX = pan.x - (worldAfterX - worldBeforeX) * newZoom;
    const panY = pan.y - (worldAfterY - worldBeforeY) * newZoom;
    
    setZoom(newZoom);
    setPan({ x: panX, y: panY });
  }, [zoom, pan]);

  const handleResetView = useCallback(() => {
    setZoom(0.7);
    setPan({ x: 150, y: 80 });
  }, []);

  const placedCount = objects.filter(o => o.placed).length;
  const totalCount = objects.length;

  return {
    objects,
    dragging,
    selectedId,
    history,
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
  };
}
