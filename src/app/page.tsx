"use client";

import { useRouter } from "next/navigation";

export default function MenuPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1e1e1e]">
      <h1 className="text-4xl text-white mb-8 font-bold">Smart Room Designer</h1>
      <button
        className="px-8 py-4 bg-green-600 text-white text-2xl rounded-lg shadow-lg hover:bg-green-700 transition mb-4"
        onClick={() => router.push("/levels")}
      >
        Play
      </button>
    </div>
  );
}
