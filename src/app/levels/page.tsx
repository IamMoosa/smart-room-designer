"use client";

import { useRouter } from "next/navigation";

const levels = [
  { id: 1, name: "Small Bedroom" },
  { id: 2, name: "Living Room" },
  { id: 3, name: "Office" },
];

export default function LevelsPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#232323]">
      <h2 className="text-3xl text-white mb-8 font-bold">Select a Level</h2>
      <div className="flex flex-col gap-6">
        {levels.map((level) => (
          <button
            key={level.id}
            className="px-8 py-4 bg-blue-600 text-white text-xl rounded-lg shadow-lg hover:bg-blue-700 transition"
            onClick={() => router.push(`/levels/${level.id}`)}
          >
            {level.name}
          </button>
        ))}
      </div>
      <button
        className="mt-12 px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        onClick={() => router.push("/")}
      >
        Exit
      </button>
    </div>
  );
}
