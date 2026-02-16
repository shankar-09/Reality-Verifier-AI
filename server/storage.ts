import { db } from "./db";
import { scans, type Scan, type InsertScan } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  createScan(scan: InsertScan): Promise<Scan>;
  getScan(id: number): Promise<Scan | undefined>;
  getRecentScans(limit?: number): Promise<Scan[]>;
}

export class DatabaseStorage implements IStorage {
  async createScan(insertScan: InsertScan): Promise<Scan> {
    const [scan] = await db.insert(scans).values(insertScan).returning();
    return scan;
  }

  async getScan(id: number): Promise<Scan | undefined> {
    const [scan] = await db.select().from(scans).where(eq(scans.id, id));
    return scan;
  }

  async getRecentScans(limit: number = 10): Promise<Scan[]> {
    return await db.select().from(scans).orderBy(desc(scans.createdAt)).limit(limit);
  }
}

export const storage = new DatabaseStorage();
