"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const floatingIcons = [
  { src: "/file.svg", alt: "File Icon" },
  { src: "/window.svg", alt: "Window Icon" },
  { src: "/globe.svg", alt: "Globe Icon" },
];

export default function MenuPage() {
  const router = useRouter();

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {floatingIcons.map((icon, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * 100, 
              y: Math.random() * 100,
              scale: 0.5,
              opacity: 0.3
            }}
            animate={{
              x: [null, Math.random() * window.innerWidth],
              y: [null, Math.random() * window.innerHeight],
              scale: [0.5, 0.8, 0.5],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          >
            <Image 
              src={icon.src} 
              alt={icon.alt} 
              width={64} 
              height={64} 
              className="opacity-50"
            />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            Smart Room Designer
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

      {/* Decorative corner gradients */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-500/20 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-indigo-500/20 to-transparent" />
    </div>
  );
}
