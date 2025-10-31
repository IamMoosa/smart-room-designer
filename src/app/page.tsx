"use client";

import { useRouter } from "next/navigation";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";

export default function MenuPage() {
  const router = useRouter();

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Boxes Demo Container */}
      <div className="h-screen relative w-full overflow-hidden bg-black flex flex-col items-center justify-center">
        {/* removed overlay that was hiding the Boxes (it used z-50) */}

        <Boxes />

        {/* Content (static, no animations) */}
        <div className="relative z-30 flex flex-col items-center justify-center h-full w-full pointer-events-none">
          <div className="text-center mb-12">
            <h1 className="text-7xl sm:text-5xl md:text-9xl text-white mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" >
              Room Designer
            </h1>
            <p className="text-xl sm:text-lg md:text-2xl text-purple-200 max-w-md mx-auto mb-8 leading-relaxed drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" >
              Design your perfect room. Drag, drop, and arrange furniture with style.
            </p>
          </div>

          <div className="flex flex-col gap-6 items-center">
            <button
              className="relative px-14 py-5 text-xl font-semibold rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-blue-500/30 text-white backdrop-blur-lg border border-white/20 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              style={{ pointerEvents: 'auto' }}
              onClick={() => router.push("/room")}
            >
              <span className="relative z-10">Start Designing</span>
            </button>

            <button
              className="relative px-10 py-3 text-lg font-medium rounded-xl overflow-hidden text-purple-200 border border-purple-500/40 bg-white/5 backdrop-blur-md hover:bg-purple-600/10 hover:text-white"
              style={{ pointerEvents: 'auto' }}
              onClick={() => router.push("/help")}
            >
              <span className="relative z-10">How to Play</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
