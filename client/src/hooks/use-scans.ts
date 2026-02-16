import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { Scan, AnalyzeRequest } from "@shared/schema";

// GET /api/scans
export function useScans() {
  return useQuery({
    queryKey: [api.scans.list.path],
    queryFn: async () => {
      const res = await fetch(api.scans.list.path);
      if (!res.ok) throw new Error("Failed to fetch scans");
      const data = await res.json();
      return api.scans.list.responses[200].parse(data);
    },
  });
}

// GET /api/scans/:id
export function useScan(id: number) {
  return useQuery({
    queryKey: [api.scans.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.scans.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch scan");
      return api.scans.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// POST /api/analyze
export function useAnalyze() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AnalyzeRequest) => {
      // In a real app, this would likely be multipart/form-data for file uploads
      // For this schema, we are sending JSON with a URL/filename
      const res = await fetch(api.scans.analyze.path, {
        method: api.scans.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Analysis failed");
      }
      return api.scans.analyze.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.scans.list.path] });
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${data.fileName}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// POST /api/tts
export function useTTS() {
  return useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(api.scans.tts.path, {
        method: api.scans.tts.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      if (!res.ok) throw new Error("TTS generation failed");
      return await res.json();
    },
  });
}
