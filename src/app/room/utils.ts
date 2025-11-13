import { RoomObject } from './types';

export function isOverlapping(a: RoomObject, b: RoomObject) {
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

export function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#",""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
    (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
    .toString(16).slice(1);
}

export function isPointInRotatedRect(obj: RoomObject, px: number, py: number) {
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
