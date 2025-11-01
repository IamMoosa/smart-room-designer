"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  let colors = [
  // Blues
  "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8",
  
  // Purples
  "#d8b4fe", "#c084fc", "#a78bfa", "#8b5cf6", "#7c3aed",
  
  // Pinks
  "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d",
  
  // Reds
  "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c",
  
  // Oranges
  "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c",
  
  // Yellows
  "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207",
  
  // Greens
  "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d",
  
  // Teals
  "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e",
  
  // Neutrals
  "#f5f5f5", "#e5e7eb", "#9ca3af", "#6b7280", "#374151"
];
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className,
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="relative h-8 w-16 border-l border-slate-700"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `${getRandomColor()}`,
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="relative h-8 w-16 border-t border-r border-slate-700"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
