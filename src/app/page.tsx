"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import RippleBackground from "@/components/RippleBackground";

export default function MenuPage() {
  const router = useRouter();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* RippleGrid Background */}
      <RippleBackground />

      {/* Content */}
      <div className="relative z-1 flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            Room Designer
          </h1>
          <p className="text-xl text-purple-200 max-w-md mx-auto">
            Design your perfect room. Drag, drop, and arrange furniture with style.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col gap-4 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-2xl rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 font-semibold"
            onClick={() => router.push("/room")}
          >
            Start Designing
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-purple-900/30 text-purple-200 rounded-lg border border-purple-500/30 hover:bg-purple-800/40 transition-all duration-300"
            onClick={() => router.push("/help")}
          >
            How to Play
          </motion.button>
        </motion.div>
      </div>


    </div>
  );
}
