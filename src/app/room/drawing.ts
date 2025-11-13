"use client";

import { RoomObject } from './types';
import { shadeColor } from './utils';

type DrawFurnitureProps = {
  obj: RoomObject;
  ctx: CanvasRenderingContext2D;
  zoom: number;
  selectedId: string | null;
};

export function drawFurniture({ obj, ctx, zoom, selectedId }: DrawFurnitureProps) {
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
  
  switch(obj.type) {
    case 'bed':
      drawBed(ctx, obj, zoom);
      break;
    case 'sofa':
      drawSofa(ctx, obj, zoom);
      break;
    case 'armchair':
      drawArmchair(ctx, obj, zoom);
      break;
    case 'table':
      drawTable(ctx, obj, zoom);
      break;
    case 'chair':
      drawChair(ctx, obj, zoom);
      break;
    case 'dresser':
      drawDresser(ctx, obj, zoom);
      break;
    case 'nightstand':
      drawNightstand(ctx, obj, zoom);
      break;
    case 'desk':
      drawDesk(ctx, obj, zoom);
      break;
    case 'tv-stand':
      drawTVStand(ctx, obj, zoom);
      break;
    case 'counter':
      drawCounter(ctx, obj, zoom);
      break;
    case 'wardrobe':
      drawWardrobe(ctx, obj, zoom);
      break;
    case 'bookshelf':
      drawBookshelf(ctx, obj, zoom);
      break;
    case 'decor':
      drawDecor(ctx, obj, zoom);
      break;
    case 'appliance':
      drawAppliance(ctx, obj, zoom);
      break;
    case 'fixture':
      drawFixture(ctx, obj, zoom);
      break;
    case 'storage':
      drawStorage(ctx, obj, zoom);
      break;
    default:
      ctx.fillStyle = obj.color;
      ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
  }
  
  ctx.restore();
}

function drawBed(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
  ctx.fillStyle = shadeColor(obj.color, -20);
  ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h * 0.2);
  ctx.fillStyle = '#FFFFFF';
  ctx.globalAlpha = 0.8;
  ctx.fillRect(-obj.w / 2 + obj.w * 0.15, -obj.h / 2 + obj.h * 0.1, obj.w * 0.3, obj.h * 0.15);
  ctx.fillRect(-obj.w / 2 + obj.w * 0.55, -obj.h / 2 + obj.h * 0.1, obj.w * 0.3, obj.h * 0.15);
  ctx.globalAlpha = 1;
}

function drawSofa(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
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
}

function drawArmchair(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.2, obj.w, obj.h * 0.6);
  ctx.fillStyle = shadeColor(obj.color, -15);
  ctx.fillRect(-obj.w / 2 + obj.w * 0.15, -obj.h / 2, obj.w * 0.7, obj.h * 0.3);
  ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.2, obj.w * 0.2, obj.h * 0.6);
  ctx.fillRect(obj.w / 2 - obj.w * 0.2, -obj.h / 2 + obj.h * 0.2, obj.w * 0.2, obj.h * 0.6);
}

function drawTable(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
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
}

function drawChair(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(-obj.w / 2, -obj.h / 2 + obj.h * 0.3, obj.w, obj.h * 0.5);
  ctx.fillStyle = shadeColor(obj.color, -15);
  ctx.fillRect(-obj.w / 2 + obj.w * 0.15, -obj.h / 2, obj.w * 0.7, obj.h * 0.4);
}

function drawDresser(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
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
}

function drawNightstand(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
  ctx.strokeStyle = shadeColor(obj.color, -30);
  ctx.lineWidth = 2 / zoom;
  ctx.strokeRect(-obj.w / 2 + obj.w * 0.1, -obj.h / 2 + obj.h * 0.15, obj.w * 0.8, obj.h * 0.3);
  ctx.fillStyle = shadeColor(obj.color, -40);
  ctx.fillRect(-obj.w * 0.15, -obj.h / 2 + obj.h * 0.3, obj.w * 0.3, 3 / zoom);
}

function drawDesk(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
  ctx.fillStyle = shadeColor(obj.color, -25);
  const deskLegW = obj.w * 0.1;
  ctx.fillRect(-obj.w / 2 + deskLegW, -obj.h / 2, deskLegW, obj.h);
  ctx.fillRect(obj.w / 2 - deskLegW * 2, -obj.h / 2, deskLegW, obj.h);
}

function drawTVStand(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
  ctx.fillStyle = '#1F2937';
  ctx.fillRect(-obj.w / 2 + obj.w * 0.2, -obj.h / 2 - obj.h * 0.6, obj.w * 0.6, obj.h * 0.5);
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2 / zoom;
  ctx.strokeRect(-obj.w / 2 + obj.w * 0.2, -obj.h / 2 - obj.h * 0.6, obj.w * 0.6, obj.h * 0.5);
}

function drawCounter(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
  ctx.strokeStyle = shadeColor(obj.color, -30);
  ctx.lineWidth = 2 / zoom;
  const cabinetCount = Math.floor(obj.w / 50);
  for (let i = 0; i < cabinetCount; i++) {
    ctx.strokeRect(-obj.w / 2 + (i * obj.w / cabinetCount) + obj.w * 0.02, -obj.h / 2 + obj.h * 0.1, (obj.w / cabinetCount) - obj.w * 0.04, obj.h * 0.8);
  }
}

function drawWardrobe(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
  ctx.strokeStyle = shadeColor(obj.color, -30);
  ctx.lineWidth = 2 / zoom;
  ctx.strokeRect(-obj.w / 2 + obj.w * 0.02, -obj.h / 2 + obj.h * 0.05, obj.w / 2 - obj.w * 0.03, obj.h * 0.9);
  ctx.strokeRect(0 + obj.w * 0.01, -obj.h / 2 + obj.h * 0.05, obj.w / 2 - obj.w * 0.03, obj.h * 0.9);
  ctx.fillStyle = shadeColor(obj.color, -40);
  ctx.fillRect(-obj.w / 4 - obj.w * 0.05, 0, obj.w * 0.05, 4 / zoom);
  ctx.fillRect(obj.w / 4, 0, obj.w * 0.05, 4 / zoom);
}

function drawBookshelf(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
  ctx.strokeStyle = shadeColor(obj.color, -30);
  ctx.lineWidth = 2 / zoom;
  const shelfCount = 5;
  for (let i = 1; i < shelfCount; i++) {
    const shelfY = -obj.h / 2 + (i * obj.h / shelfCount);
    ctx.beginPath();
    ctx.moveTo(-obj.w / 2 + obj.w * 0.05, shelfY);
    ctx.lineTo(obj.w / 2 - obj.w * 0.05, shelfY);
    ctx.stroke();
  }
  ctx.fillStyle = shadeColor(obj.color, -40);
  for (let i = 0; i < shelfCount - 1; i++) {
    const shelfY = -obj.h / 2 + (i * obj.h / shelfCount) + obj.h / shelfCount * 0.3;
    const bookCount = 3;
    for (let j = 0; j < bookCount; j++) {
      const bookX = -obj.w / 2 + obj.w * 0.1 + (j * obj.w * 0.25);
      ctx.fillRect(bookX, shelfY, obj.w * 0.2, obj.h / shelfCount * 0.5);
    }
  }
}

function drawDecor(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  if (obj.label.includes('Plant')) {
    ctx.fillStyle = shadeColor(obj.color, -30);
    ctx.fillRect(-obj.w / 2 + obj.w * 0.2, obj.h / 2 - obj.h * 0.3, obj.w * 0.6, obj.h * 0.3);
    ctx.fillStyle = obj.color;
    ctx.beginPath();
    ctx.arc(-obj.w / 4, -obj.h / 4, obj.w * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(obj.w / 4, -obj.h / 4, obj.w * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -obj.h / 3, obj.w * 0.35, 0, Math.PI * 2);
    ctx.fill();
  } else if (obj.label.includes('Mirror')) {
    ctx.fillStyle = shadeColor(obj.color, -40);
    ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
    ctx.fillStyle = '#E0E7FF';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(-obj.w / 2 + obj.w * 0.1, -obj.h / 2 + obj.h * 0.1, obj.w * 0.8, obj.h * 0.8);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(-obj.w / 2 + obj.w * 0.15, -obj.h / 2 + obj.h * 0.15, obj.w * 0.3, obj.h * 0.2);
    ctx.globalAlpha = 1;
  } else if (obj.label.includes('Wall Art')) {
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 3 / zoom;
    ctx.strokeRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w / 2 + obj.w * 0.1, -obj.h / 2 + obj.h * 0.1, obj.w * 0.8, obj.h * 0.8);
    ctx.fillStyle = shadeColor(obj.color, 20);
    ctx.beginPath();
    ctx.arc(0, 0, obj.w * 0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (obj.label.includes('Coat Rack')) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w * 0.1, -obj.h / 2, obj.w * 0.2, obj.h);
    ctx.fillStyle = shadeColor(obj.color, -20);
    for (let i = 0; i < 3; i++) {
      const hookY = -obj.h / 2 + obj.h * 0.2 + (i * obj.h * 0.25);
      ctx.fillRect(-obj.w / 2 + obj.w * 0.2, hookY, obj.w * 0.6, obj.h * 0.08);
    }
  } else if (obj.label.includes('Umbrella')) {
    ctx.strokeStyle = shadeColor(obj.color, -40);
    ctx.lineWidth = 3 / zoom;
    ctx.beginPath();
    ctx.moveTo(0, obj.h / 2);
    ctx.lineTo(0, -obj.h / 4);
    ctx.stroke();
    ctx.fillStyle = obj.color;
    ctx.beginPath();
    ctx.arc(0, -obj.h / 4, obj.w * 0.45, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = shadeColor(obj.color, -30);
    ctx.lineWidth = 1.5 / zoom;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * obj.w * 0.2, -obj.h / 4);
      ctx.lineTo(i * obj.w * 0.2, -obj.h / 4 - obj.h * 0.15);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
  }
}

function drawAppliance(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  if (obj.label.includes('Fridge')) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
    ctx.strokeStyle = shadeColor(obj.color, -30);
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(-obj.w / 2 + obj.w * 0.05, -obj.h / 2 + obj.h * 0.05, obj.w * 0.9, obj.h * 0.45);
    ctx.strokeRect(-obj.w / 2 + obj.w * 0.05, -obj.h / 2 + obj.h * 0.55, obj.w * 0.9, obj.h * 0.4);
    ctx.fillStyle = shadeColor(obj.color, -40);
    ctx.fillRect(obj.w / 2 - obj.w * 0.15, -obj.h / 2 + obj.h * 0.2, obj.w * 0.08, obj.h * 0.1);
    ctx.fillRect(obj.w / 2 - obj.w * 0.15, -obj.h / 2 + obj.h * 0.7, obj.w * 0.08, obj.h * 0.1);
  } else if (obj.label.includes('Stove')) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
    ctx.fillStyle = '#1F2937';
    const burnerSize = obj.w * 0.35;
    ctx.beginPath();
    ctx.arc(-obj.w / 4, -obj.h / 4, burnerSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(obj.w / 4, -obj.h / 4, burnerSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-obj.w / 4, obj.h / 4, burnerSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(obj.w / 4, obj.h / 4, burnerSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = shadeColor(obj.color, -30);
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(-obj.w / 2 + obj.w * 0.1, obj.h / 2 - obj.h * 0.3, obj.w * 0.8, obj.h * 0.25);
  } else if (obj.label.includes('Microwave')) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(-obj.w / 2 + obj.w * 0.1, -obj.h / 2 + obj.h * 0.15, obj.w * 0.5, obj.h * 0.7);
    ctx.fillStyle = '#374151';
    ctx.fillRect(obj.w / 2 - obj.w * 0.35, -obj.h / 2 + obj.h * 0.2, obj.w * 0.25, obj.h * 0.6);
    ctx.fillStyle = '#6B7280';
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.fillRect(
          obj.w / 2 - obj.w * 0.3 + j * obj.w * 0.08,
          -obj.h / 2 + obj.h * 0.25 + i * obj.h * 0.15,
          obj.w * 0.06,
          obj.h * 0.1
        );
      }
    }
  } else {
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
  }
}

function drawFixture(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  if (obj.label.includes('Bathtub')) {
    ctx.fillStyle = obj.color;
    ctx.beginPath();
    ctx.moveTo(-obj.w / 2, obj.h / 2);
    ctx.lineTo(-obj.w / 2, obj.h / 4);
    ctx.quadraticCurveTo(-obj.w / 2, -obj.h / 2, 0, -obj.h / 2);
    ctx.quadraticCurveTo(obj.w / 2, -obj.h / 2, obj.w / 2, obj.h / 4);
    ctx.lineTo(obj.w / 2, obj.h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = shadeColor(obj.color, -15);
    ctx.beginPath();
    ctx.moveTo(-obj.w / 2 + obj.w * 0.1, obj.h / 2 - obj.h * 0.1);
    ctx.quadraticCurveTo(-obj.w / 2 + obj.w * 0.1, -obj.h / 2 + obj.h * 0.15, 0, -obj.h / 2 + obj.h * 0.15);
    ctx.quadraticCurveTo(obj.w / 2 - obj.w * 0.1, -obj.h / 2 + obj.h * 0.15, obj.w / 2 - obj.w * 0.1, obj.h / 2 - obj.h * 0.1);
    ctx.lineTo(-obj.w / 2 + obj.w * 0.1, obj.h / 2 - obj.h * 0.1);
    ctx.fill();
  } else if (obj.label.includes('Toilet')) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w / 2, 0, obj.w, obj.h / 2);
    ctx.beginPath();
    ctx.ellipse(0, obj.h / 4, obj.w * 0.4, obj.h * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-obj.w / 2 + obj.w * 0.1, -obj.h / 2, obj.w * 0.8, obj.h / 2);
    ctx.fillStyle = shadeColor(obj.color, -10);
    ctx.fillRect(-obj.w / 2 + obj.w * 0.05, -obj.h / 2 - obj.h * 0.05, obj.w * 0.9, obj.h * 0.08);
  } else if (obj.label.includes('Sink')) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
    ctx.fillStyle = shadeColor(obj.color, -20);
    ctx.beginPath();
    ctx.ellipse(0, 0, obj.w * 0.35, obj.h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 3 / zoom;
    ctx.beginPath();
    ctx.moveTo(0, -obj.h / 2 + obj.h * 0.3);
    ctx.lineTo(0, -obj.h / 2 + obj.h * 0.5);
    ctx.arc(obj.w * 0.15, -obj.h / 2 + obj.h * 0.5, obj.w * 0.15, Math.PI, 0);
    ctx.lineTo(obj.w * 0.3, 0);
    ctx.stroke();
  } else if (obj.label.includes('Shower')) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
    ctx.fillStyle = shadeColor(obj.color, -30);
    ctx.fillRect(-obj.w / 2 + obj.w * 0.7, -obj.h / 2, obj.w * 0.2, obj.h * 0.15);
    ctx.fillStyle = '#60A5FA';
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.arc(
          -obj.w / 2 + obj.w * 0.3 + j * obj.w * 0.2,
          -obj.h / 2 + obj.h * 0.2 + i * obj.h * 0.15,
          2 / zoom,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
  }
}

function drawStorage(ctx: CanvasRenderingContext2D, obj: RoomObject, zoom: number) {
  if (obj.label.includes('Cabinet')) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
    ctx.strokeStyle = shadeColor(obj.color, -30);
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(-obj.w / 2 + obj.w * 0.05, -obj.h / 2 + obj.h * 0.1, obj.w / 2 - obj.w * 0.08, obj.h * 0.8);
    ctx.strokeRect(obj.w * 0.03, -obj.h / 2 + obj.h * 0.1, obj.w / 2 - obj.w * 0.08, obj.h * 0.8);
    ctx.fillStyle = shadeColor(obj.color, -40);
    ctx.fillRect(-obj.w / 4, 0, obj.w * 0.1, 3 / zoom);
    ctx.fillRect(obj.w / 4, 0, obj.w * 0.1, 3 / zoom);
  } else if (obj.label.includes('Shoe Rack')) {
    ctx.strokeStyle = obj.color;
    ctx.lineWidth = 3 / zoom;
    ctx.strokeRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
    const rackLevels = 3;
    for (let i = 1; i < rackLevels; i++) {
      ctx.beginPath();
      ctx.moveTo(-obj.w / 2, -obj.h / 2 + (i * obj.h / rackLevels));
      ctx.lineTo(obj.w / 2, -obj.h / 2 + (i * obj.h / rackLevels));
      ctx.stroke();
    }
    ctx.fillStyle = shadeColor(obj.color, -20);
    for (let i = 0; i < rackLevels; i++) {
      ctx.fillRect(-obj.w / 2 + obj.w * 0.1, -obj.h / 2 + (i * obj.h / rackLevels) + obj.h * 0.05, obj.w * 0.35, obj.h / rackLevels * 0.3);
    }
  } else {
    ctx.fillStyle = obj.color;
    ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
  }
}
