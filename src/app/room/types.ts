export type RoomObject = {
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

export type Room = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color: string;
};

export type DraggingObject = RoomObject & {
  offsetX: number;
  offsetY: number;
  snapX: number;
  snapY: number;
};

export type PanState = {
  x: number;
  y: number;
};
