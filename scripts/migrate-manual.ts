import { db } from "@/db";
import { sql } from "drizzle-orm";

async function forceCreateTable() {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS file_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_id INTEGER,
      accessed_at INTEGER NOT NULL,
      interaction_type TEXT,
      FOREIGN KEY (file_id) REFERENCES library_files(id)
    )
  `);
  console.log("Table 'file_activity' created successfully!");
}

forceCreateTable();