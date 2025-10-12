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
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}
