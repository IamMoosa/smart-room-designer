"use client";

import { Move } from "lucide-react";

export function InfoBar() {
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border-b border-slate-700/30 px-6 py-3 text-sm text-slate-300 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-8">
        <span className="flex items-center gap-2 font-medium">
          <Move className="w-4 h-4 text-violet-400" />
          Drag furniture to arrange your rooms
        </span>
        <span className="text-slate-400">Press <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono mx-1 border border-slate-700">R</kbd> to rotate</span>
        <span className="text-slate-400">Hold <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono mx-1 border border-slate-700">Space</kbd> + Drag to pan</span>
        <span className="text-slate-400"><kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono mx-1 border border-slate-700">Alt</kbd> + Scroll to zoom</span>
      </div>
    </div>
  );
}
