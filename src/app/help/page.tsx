"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const instructions = [
  {
    title: "Select & Move",
    description: "Click and drag furniture pieces to position them in the room.",
    icon: "🖱️",
  },
  {
    title: "Rotate",
    description: "Press 'R' key to rotate the selected piece by 90 degrees.",
    icon: "⟳",
  },
  {
    title: "Snap to Grid",
    description: "Pieces automatically align to the grid for perfect placement.",
    icon: "📏",
  },
  {
    title: "Avoid Overlap",
    description: "Keep furniture pieces from overlapping each other.",
    icon: "⚡",
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track mouse movement for interactive glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center p-8">
      {/* === Neon Animated Background === */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePos.x}px ${mousePos.y}px,
              rgba(0, 255, 255, 0.2),
              rgba(0, 0, 0, 0.9)
            ),
            repeating-linear-gradient(45deg, rgba(0, 255, 255, 0.05) 0px, transparent 3px, transparent 40px),
            repeating-linear-gradient(-45deg, rgba(255, 0, 255, 0.05) 0px, transparent 3px, transparent 40px)
          `,
          transition: "background 0.1s ease-out",
        }}
      />

      {/* Neon grid overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none animate-scanLines bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_2px]" />

      {/* === Content === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-cyan-400 drop-shadow-[0_0_25px_rgba(0,255,255,0.8)]">
          How to Play
        </h1>
        <p className="text-purple-300 mb-12 text-lg drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
          Design your perfect room using these simple neon-inspired controls.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {instructions.map((inst, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="p-6 rounded-2xl bg-black/40 border border-cyan-500/30 shadow-[0_0_25px_rgba(0,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,0,255,0.3)] hover:border-fuchsia-500/40 transition-all duration-500"
            >
              <div className="text-5xl mb-4">{inst.icon}</div>
              <h3 className="text-2xl font-semibold text-cyan-300 mb-2 drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]">
                {inst.title}
              </h3>
              <p className="text-purple-200 leading-relaxed">
                {inst.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <button
            onClick={() => router.push("/")}
            className="px-10 py-3 rounded-lg bg-black/30 border border-cyan-400/40 text-cyan-300 font-semibold hover:bg-black/50 hover:text-fuchsia-300 transition-colors duration-300"
          >
            Back to Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}
