import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileAudio, FileVideo, FileImage, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export function UploadZone({ onFileSelect, isAnalyzing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "audio" | "video" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setFileType("image");
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      setFileType("video");
      setPreview(URL.createObjectURL(file));
    } else if (file.type.startsWith("audio/")) {
      setFileType("audio");
      setPreview(null);
    } else {
      return; // Unsupported type
    }
    
    onFileSelect(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setFileType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <motion.div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center p-8",
        isDragging 
          ? "border-primary bg-primary/5 scale-[1.01] shadow-[0_0_30px_rgba(0,212,255,0.15)]" 
          : "border-white/10 hover:border-primary/50 hover:bg-white/5",
        isAnalyzing && "pointer-events-none opacity-50"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*,audio/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {preview ? (
        <div className="relative w-full h-full flex items-center justify-center">
          {fileType === "image" && (
            <img src={preview} alt="Preview" className="max-h-[250px] rounded-lg shadow-2xl" />
          )}
          {fileType === "video" && (
            <video src={preview} className="max-h-[250px] rounded-lg shadow-2xl" controls />
          )}
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-4 -right-4 rounded-full"
            onClick={clearFile}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : fileType === "audio" ? (
        <div className="flex flex-col items-center text-primary animate-pulse">
          <FileAudio className="w-20 h-20 mb-4" />
          <p className="text-xl font-bold">Audio File Selected</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-4 border-primary/30 text-primary hover:bg-primary/10"
            onClick={clearFile}
          >
            Remove File
          </Button>
        </div>
      ) : (
        <>
          <div className={cn(
            "w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 transition-transform duration-300",
            "group-hover:scale-110 group-hover:bg-primary/20"
          )}>
            <Upload className="w-10 h-10 text-white/50 group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-xl font-bold mb-2">Drag & Drop Media</h3>
          <p className="text-white/40 text-center max-w-sm">
            Supports Images (JPG, PNG), Video (MP4, MOV), and Audio (MP3, WAV).
            Maximum file size 50MB.
          </p>
          
          <div className="flex gap-4 mt-8 opacity-40">
            <div className="flex items-center gap-2">
              <FileImage className="w-4 h-4" /> Image
            </div>
            <div className="flex items-center gap-2">
              <FileVideo className="w-4 h-4" /> Video
            </div>
            <div className="flex items-center gap-2">
              <FileAudio className="w-4 h-4" /> Audio
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
