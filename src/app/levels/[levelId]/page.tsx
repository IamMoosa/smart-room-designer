"use client";

import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Lazy load the RoomDesigner to avoid SSR issues
const RoomDesigner = dynamic(() => import("../../room/page"), { ssr: false });

const levelConfigs: Record<string, any> = {
  "1": {
    name: "Small Bedroom",
    room: { width: 800, height: 600 },
    furniture: [
      { id: "bed", label: "Bed", w: 120, h: 60, color: "#f28b82" },
      { id: "table", label: "Table", w: 60, h: 60, color: "#34a853" },
    ],
  },
  "2": {
    name: "Living Room",
    room: { width: 600, height: 400 },
    furniture: [
      { id: "sofa", label: "Sofa", w: 150, h: 70, color: "#fbbc04" },
      { id: "tv", label: "TV Stand", w: 100, h: 40, color: "#4285f4" },
      { id: "table", label: "Table", w: 80, h: 80, color: "#34a853" },
    ],
  },
  "3": {
    name: "Office",
    room: { width: 500, height: 350 },
    furniture: [
      { id: "desk", label: "Desk", w: 120, h: 60, color: "#a142f4" },
      { id: "chair", label: "Chair", w: 50, h: 50, color: "#f28b82" },
      { id: "cabinet", label: "Cabinet", w: 80, h: 40, color: "#fbbc04" },
    ],
  },
};

export default function LevelPage() {
  const router = useRouter();
  const params = useParams();
  const levelId = Array.isArray(params?.levelId) ? params.levelId[0] : params?.levelId;
  const config = useMemo(() => (levelId ? levelConfigs[levelId] : undefined), [levelId]);

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#232323] text-white">
        <h2 className="text-2xl mb-4">Level not found</h2>
        <button className="px-4 py-2 bg-gray-700 rounded" onClick={() => router.push("/levels")}>Back to Levels</button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#181818]">
      <div className="absolute top-4 left-4 z-10">
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          onClick={() => router.push("/levels")}
        >
          Exit Level
        </button>
      </div>
      <div className="flex flex-col items-center pt-16">
        <h2 className="text-3xl text-white mb-4 font-bold">{config.name}</h2>
        <RoomDesigner
          roomWidth={config.room.width}
          roomHeight={config.room.height}
          initialFurniture={config.furniture}
        />
      </div>
    </div>
  );
}
