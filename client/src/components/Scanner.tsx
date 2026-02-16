import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ScannerProps {
  isScanning: boolean;
  type: "image" | "audio" | "video";
}

export function Scanner({ isScanning, type }: ScannerProps) {
  if (!isScanning) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px]" />
      
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px),
          linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Scanning Line */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_var(--primary)]"
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Corner Brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary" />

      {/* Status Text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div 
          className="bg-black/80 text-primary px-4 py-1 rounded-full text-xs font-mono border border-primary/30"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ANALYZING {type.toUpperCase()} DATA...
        </motion.div>
      </div>
    </div>
  );
}
