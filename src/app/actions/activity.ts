"use server"; 

import { db } from "@/db"; 
import { library_files } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function logActivity(fileId: number) {
  try {
    await db.update(library_files)
      .set({ 
        view_count: sql`${library_files.view_count} + 1`,
        last_accessed: new Date()
      })
      .where(eq(library_files.id, fileId));
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}