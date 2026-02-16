import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScans, useAnalyze } from "@/hooks/use-scans";
import { UploadZone } from "@/components/UploadZone";
import { Scanner } from "@/components/Scanner";
import { ResultCard } from "@/components/ResultCard";
import { Shield, Activity, Lock, Github, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [analyzingFile, setAnalyzingFile] = useState<File | null>(null);
  const [resultId, setResultId] = useState<number | null>(null);
  
  const { data: scans, isLoading: isLoadingScans } = useScans();
  const { mutate: analyze, isPending: isAnalyzing } = useAnalyze();
  
  // Find the result if we have an ID
  const currentResult = scans?.find(s => s.id === resultId);

  const handleFileSelect = (file: File) => {
    setAnalyzingFile(file);
    setResultId(null);
    
    // Simulate upload delay then analyze
    // In a real app, we'd upload the file first
    const type = file.type.startsWith("image/") ? "image" : 
                 file.type.startsWith("audio/") ? "audio" : "video";
                 
    // Mocking a file URL for the schema
    const mockUrl = URL.createObjectURL(file);
    
    analyze({
      fileName: file.name,
      fileUrl: mockUrl,
      type
    }, {
      onSuccess: (data) => {
        setResultId(data.id);
        setAnalyzingFile(null);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] bg-cover bg-fixed">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Header */}
      <header className="relative z-50 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-wide">
              REAL CHECK <span className="text-primary">AI</span>
            </span>
          </div>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container max-w-5xl mx-auto px-4 py-12 flex flex-col gap-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            System Operational v2.4.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4 drop-shadow-2xl">
            VERIFY <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">REALITY</span> IN THE AGE OF AI
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Detect deepfakes, AI-generated images, and synthetic voice clones with enterprise-grade precision. 
            Protect yourself from misinformation.
          </p>
        </div>

        {/* Upload & Scanner Section */}
        <div className="relative max-w-3xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {!currentResult ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <div className="glass-panel rounded-2xl relative overflow-hidden">
                  <Scanner 
                    isScanning={isAnalyzing} 
                    type={analyzingFile?.type.startsWith("image") ? "image" : "video"} 
                  />
                  <UploadZone 
                    onFileSelect={handleFileSelect} 
                    isAnalyzing={isAnalyzing} 
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <ResultCard scan={currentResult} />
                <div className="text-center mt-8">
                  <Button 
                    size="lg" 
                    onClick={() => setResultId(null)}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  >
                    Analyze Another File
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: Activity,
              title: "99.8% Accuracy",
              desc: "Powered by advanced neural networks trained on millions of deepfake samples."
            },
            {
              icon: Lock,
              title: "Privacy First",
              desc: "Files are analyzed in real-time and automatically deleted after processing."
            },
            {
              icon: Shield,
              title: "Multi-Format",
              desc: "Supports all major video, audio, and image formats including MP4, MP3, JPG, PNG."
            }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6 rounded-xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Recent Scans Table */}
        <div className="glass-panel rounded-xl overflow-hidden mt-8">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Global Scans
            </h3>
            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">Live Feed</span>
          </div>
          <div className="p-0">
            {isLoadingScans ? (
              <div className="p-8 text-center text-muted-foreground animate-pulse">Loading feed...</div>
            ) : scans && scans.length > 0 ? (
              <div className="divide-y divide-white/5">
                {scans.slice(0, 5).map((scan) => (
                  <div key={scan.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${scan.result === 'Real' ? 'bg-green-500 shadow-[0_0_10px_#10B981]' : 'bg-red-500 shadow-[0_0_10px_#EF4444]'}`} />
                      <div>
                        <div className="font-medium text-sm">{scan.fileName}</div>
                        <div className="text-xs text-muted-foreground">{new Date(scan.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono text-muted-foreground">{scan.type.toUpperCase()}</span>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        scan.result === 'Real' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {scan.result}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">No recent scans available.</div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-background/80 backdrop-blur-xl mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground text-sm">
            Created by <span className="text-primary font-bold">Shankar Janamoni</span>
          </p>
          <p className="text-xs text-white/20 mt-2">
            © 2025 Real Check AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
