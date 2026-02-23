import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Download, Share2, Shield, AlertTriangle, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTTS } from "@/hooks/use-scans";
import { useEffect, useRef, useState } from "react";
import type { Scan } from "@shared/schema";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface ResultCardProps {
  scan: Scan;
}

export function ResultCard({ scan }: ResultCardProps) {
  const { mutate: generateSpeech } = useTTS();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const isReal = scan.result === "Real";
  const color = isReal ? "#10B981" : "#EF4444"; // Green or Red
  
  const data = [
    { name: "Confidence", value: scan.confidence },
    { name: "Remaining", value: 100 - scan.confidence },
  ];

  useEffect(() => {
    // Announce result on mount
    const text = `Analysis complete. This ${scan.type} is ${scan.confidence} percent likely to be ${scan.result}. ${scan.analysis.substring(0, 100)}`;
    
    generateSpeech(text, {
      onSuccess: (response) => {
        if (response.audio) {
          const audio = new Audio(`data:audio/mp3;base64,${response.audio}`);
          audioRef.current = audio;
          audio.play();
          setIsPlaying(true);
          audio.onended = () => setIsPlaying(false);
        }
      }
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [scan, generateSpeech]);

  const handleShare = (platform: "whatsapp" | "email" | "telegram") => {
    const text = `I just analyzed a file with Real Check AI. Result: ${scan.result} (${scan.confidence}% confidence). Check it out here:`;
    const url = window.location.origin; // Use origin for a cleaner share link
    
    let link = "";
    switch (platform) {
      case "whatsapp":
        link = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case "email":
        link = `mailto:?subject=Real Check AI Analysis Report&body=${encodeURIComponent(text + "\n\n" + url + "\n\nFile Name: " + scan.fileName + "\nResult: " + scan.result + "\nConfidence: " + scan.confidence + "%")}`;
        break;
      case "telegram":
        link = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
    }
    window.open(link, "_blank");
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    
    // Add Branding
    doc.setFillColor(15, 20, 25); // Deep Navy
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(0, 212, 255); // Electric Blue
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("REAL CHECK AI", 105, 25, { align: "center" });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("Verify Reality in the Age of AI", 105, 32, { align: "center" });

    // Report Header
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("Analysis Report", 20, 55);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Report ID: #RCAI-${scan.id}-${Date.now().toString().slice(-4)}`, 20, 65);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 20, 72);

    // Main Table
    (doc as any).autoTable({
      startY: 80,
      head: [['Category', 'Details']],
      body: [
        ['File Name', scan.fileName],
        ['Media Type', scan.type.toUpperCase()],
        ['Verdict', scan.result.toUpperCase()],
        ['Confidence Score', `${scan.confidence}%`],
      ],
      headStyles: { fillStyle: [0, 212, 255], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Analysis Section
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.setFont("helvetica", "bold");
    doc.text("Forensic Analysis Details:", 20, finalY + 15);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(scan.analysis, 170);
    doc.text(splitText, 20, finalY + 25);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Created by Shankar Janamoni", 105, 280, { align: "center" });
    doc.text("© 2025 Real Check AI - Professional Deepfake Detection", 105, 285, { align: "center" });

    doc.save(`RealCheck_Report_${scan.fileName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-8 border-t-4"
      style={{ borderColor: color }}
    >
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Circular Chart */}
        <div className="relative w-48 h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={color} />
                <Cell fill="rgba(255,255,255,0.1)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold" style={{ color }}>{scan.confidence}%</span>
            <span className="text-xs text-muted-foreground uppercase">{isReal ? 'Reality' : 'Fake'} Score</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            {isReal ? (
              <Shield className="w-8 h-8 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-red-500" />
            )}
            <h2 className="text-4xl font-black uppercase tracking-tight" style={{ color }}>
              {scan.result.toUpperCase()}
            </h2>
          </div>
          
          <p className="text-white/80 text-lg mb-6 leading-relaxed">
            {scan.analysis}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary"
              onClick={downloadReport}
            >
              <Download className="w-4 h-4 mr-2" />
              Report
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-green-500/20 hover:bg-green-500/10 hover:text-green-500"
              onClick={() => handleShare('whatsapp')}
            >
              <Share2 className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-500"
              onClick={() => handleShare('telegram')}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Telegram
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-white/10 hover:bg-white/5"
              onClick={() => handleShare('email')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
