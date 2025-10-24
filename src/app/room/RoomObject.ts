export type RoomObject = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
  rotation: number; // degrees: 0, 90, 180, 270
};

// No randomRoomObject needed for fixed furniture list

export function isOverlapping(a: RoomObject, b: RoomObject) {
  // Compute axis-aligned bounding box sizes for 90deg-step rotations
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
