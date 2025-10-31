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

<motion.h1
  className="text-7xl sm:text-5xl md:text-9xl text-white mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
  style={{ fontFamily: '"Brush Script MT", cursive' }}
  initial={{ opacity: 0, scale: 0.7 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, ease: "easeOut" }}
  whileHover={{ scale: 1.05 }}
>
  Room Designer
</motion.h1>

          <p   className="text-xl sm:text-lg md:text-2xl text-purple-200 max-w-md mx-auto mb-8 leading-relaxed drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
  style={{ fontFamily: '"Forte", cursive' }}>
  Design your perfect room. Drag, drop, and arrange furniture with style.
</p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
           className="flex flex-col gap-6 items-center"
>
  {/* Start Designing Button */}
  <motion.button
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.96 }}
    className="relative px-14 py-5 text-xl font-semibold rounded-2xl overflow-hidden
               bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-blue-500/30
               text-white backdrop-blur-lg border border-white/20
               shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-500"
    onClick={() => router.push("/room")}
  >
    <span className="relative z-10">Start Designing</span>
    <motion.span
      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 rounded-2xl"
      whileHover={{ opacity: 0.3 }}
      transition={{ duration: 0.4 }}
    />
  </motion.button>

  {/* How to Play Button */}
  <motion.button
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.96 }}
    className="relative px-10 py-3 text-lg font-medium rounded-xl overflow-hidden
               text-purple-200 border border-purple-500/40 bg-white/5 backdrop-blur-md
               hover:bg-purple-600/10 hover:text-white transition-all duration-400"
    onClick={() => router.push("/help")}
  >
    <span className="relative z-10">How to Play</span>
    <motion.span
      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-0 rounded-xl"
      whileHover={{ opacity: 0.2 }}
      transition={{ duration: 0.4 }}
    />
  </motion.button>
</motion.div>
      </div>


    </div>
  );
}
