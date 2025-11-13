"use client";

import { ZoomIn, ZoomOut, Home, RotateCw, Undo, Target, Maximize2 } from "lucide-react";

type ToolbarProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onUndo: () => void;
  zoom: number;
  canUndo: boolean;
  selectedLabel?: string;
  selectedType?: string;
  placedCount: number;
  totalCount: number;
  onResetView: () => void;
};

export function Toolbar({
  onZoomIn,
  onZoomOut,
  onRotate,
  onUndo,
  zoom,
  canUndo,
  selectedLabel,
  selectedType,
  placedCount,
  totalCount,
  onResetView,
}: ToolbarProps) {
  const progress = (placedCount / totalCount) * 100;

  return (
    <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-700/50 p-4 flex items-center justify-between shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg shadow-lg">
          <Home className="w-5 h-5 text-white" />
          <h1 className="text-xl font-bold text-white">House Designer</h1>
        </div>
        
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Undo className="w-4 h-4" />
          Undo
        </button>
      </div>

      {selectedLabel && (
        <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
          <div className="px-6 py-2 bg-slate-800 rounded-lg flex flex-col gap-1 min-w-[200px]">
            <span className="text-white text-sm font-semibold truncate">{selectedLabel}</span>
            <span className="text-slate-400 text-xs">{selectedType}</span>
          </div>
          <button
            onClick={onRotate}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            <RotateCw className="w-4 h-4" />
            Rotate
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end mr-3">
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <Target className="w-4 h-4 text-violet-400" />
            <span>{placedCount}/{totalCount} Placed</span>
          </div>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <button
          onClick={onZoomOut}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        
        <div className="px-4 py-2 bg-slate-800 text-white rounded-lg min-w-[90px] text-center text-sm font-mono font-semibold shadow-lg">
          {Math.round(zoom * 100)}%
        </div>
        
        <button
          onClick={onZoomIn}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        
        <button
          onClick={onResetView}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
 
