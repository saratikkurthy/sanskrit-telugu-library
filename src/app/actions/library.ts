"use server";
import { db } from "@/db"; 
import { library_files, system_metadata,file_activity } from "@/db/schema"; 
import { desc,eq } from "drizzle-orm";

export async function getLastScanned() {
  try {
    const result = await db.select().from(system_metadata).get(); // .get() is better for SQLite single-row fetch
    return result?.last_scanned ? new Date(result.last_scanned) : null;
  } catch (error) {
    console.error("Failed to fetch scan metadata:", error);
    return null;
  }
}
export async function getRecentlyAdded() {
  try {
    const data = await db.select().from(library_files).orderBy(desc(library_files.id)).limit(25);
    console.log("DEBUG: Recent Files Data:", data); // Check your terminal!
    return data;
  } catch (error) {
    console.error("Failed to fetch recent files:", error);
    return [];
  }
}
// 1. Recently Read (based on file_activity table)
export async function getRecentReads() {
  return await db.select()
    .from(file_activity)
    .leftJoin(library_files, eq(file_activity.file_id, library_files.id))
    .orderBy(desc(file_activity.accessed_at))
    .limit(25);
}

// 2. Most Visited (based on view_count in library_files)
export async function getMostVisited() {
  return await db.select()
    .from(library_files)
    .orderBy(desc(library_files.view_count))
    .limit(25);
}