import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'image', 'audio', 'video'
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  result: text("result").notNull(), // 'Real', 'Fake'
  confidence: integer("confidence").notNull(), // 0-100
  analysis: text("analysis").notNull(), // Detailed explanation
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScanSchema = createInsertSchema(scans).omit({ 
  id: true, 
  createdAt: true 
});

export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;

// Request type for analysis
export const analyzeRequestSchema = z.object({
  type: z.enum(["image", "audio", "video"]),
  fileUrl: z.string().url(),
  fileName: z.string(),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
