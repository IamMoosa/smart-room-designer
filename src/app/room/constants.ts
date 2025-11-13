import { Room } from './types';

export const GRID_SIZE = 5;
export const ROOM_SCALE = 1;
export const HOUSE_WIDTH = 1600;
export const HOUSE_HEIGHT = 1200;

export const ROOMS: Room[] = [
  // Central hub
  { id: 'living', x: 200, y: 100, w: 500, h: 450, label: 'Living', color: 'rgba(139, 92, 246, 0.08)' },
  { id: 'kitchen', x: 800, y: 100, w: 350, h: 300, label: 'Kitchen', color: 'rgba(251, 191, 36, 0.08)' },
  { id: 'dining', x: 800, y: 400, w: 350, h: 250, label: 'Dining', color: 'rgba(245, 158, 11, 0.08)' },
  
  // Left wing - Bedrooms
  { id: 'bedroom1', x: 50, y: 600, w: 380, h: 320, label: 'Master Bed', color: 'rgba(59, 130, 246, 0.08)' },
  { id: 'bedroom2', x: 450, y: 600, w: 280, h: 320, label: 'Bedroom 2', color: 'rgba(16, 185, 129, 0.08)' },
  
  // Center bottom - Services
  { id: 'closet', x: 800, y: 700, w: 200, h: 220, label: 'Closet', color: 'rgba(168, 85, 247, 0.08)' },
  { id: 'bathroom1', x: 1050, y: 700, w: 200, h: 110, label: 'Bathroom', color: 'rgba(236, 72, 153, 0.08)' },
  { id: 'laundry', x: 1050, y: 810, w: 200, h: 110, label: 'Laundry', color: 'rgba(100, 116, 139, 0.08)' },
  
  // Right wing - Additional rooms
  { id: 'bedroom3', x: 1300, y: 100, w: 250, h: 300, label: 'Bedroom 3', color: 'rgba(14, 165, 233, 0.08)' },
  { id: 'bathroom2', x: 1300, y: 420, w: 250, h: 180, label: 'Bath 2', color: 'rgba(217, 70, 239, 0.08)' },
  { id: 'balcony', x: 1300, y: 620, w: 250, h: 300, label: 'Balcony', color: 'rgba(34, 197, 94, 0.12)' },
  
  // Top center - Hallway/circulation
  { id: 'hallway', x: 1200, y: 0, w: 350, h: 80, label: 'Entry', color: 'rgba(148, 163, 184, 0.08)' },
];
