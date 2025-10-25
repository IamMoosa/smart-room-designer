"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const instructions = [
  {
    title: "Select & Move",
    description: "Click and drag furniture pieces to position them in the room",
    icon: "🖱️"
  },
  {
    title: "Rotate",
    description: "Press 'R' key to rotate the selected piece by 90 degrees",
    icon: "⟳"
  },
  {
    title: "Snap to Grid",
    description: "Pieces automatically align to the grid for perfect placement",
    icon: "📏"
  },
  {
    title: "Avoid Overlap",
    description: "Keep furniture pieces from overlapping each other",
    icon: "⚡"
  }
];

export default function HelpPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How to Play</h1>
          <p className="text-purple-200">Design your perfect room with these simple controls</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {instructions.map((instruction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
            >
              <div className="text-4xl mb-4">{instruction.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{instruction.title}</h3>
              <p className="text-purple-200">{instruction.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors duration-300"
          >
            Back to Menu
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}