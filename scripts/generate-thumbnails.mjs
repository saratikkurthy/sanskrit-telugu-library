// generate-thumbnails.mjs
import { db } from "./src/db/index.js"; // Adjust this path if your db export is elsewhere
import { files } from "./src/db/schema.js";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generate() {
  const allFiles = await db.select().from(files);
  const outDir = path.join(__dirname, "public", "thumbnails");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const file of allFiles) {
    const targetPath = path.join(outDir, `thumb_${file.id}.1.png`);
    
    if (!fs.existsSync(targetPath)) {
      console.log(`Generating: ${file.fileName}`);
      try {
        // Ensure 'gs' is in your system PATH
        execSync(`gs -sDEVICE=png16m -o "${targetPath}" -dFirstPage=1 -dLastPage=1 -r72 "${file.filePath}"`);
      } catch (e) {
        console.error(`Failed: ${file.id}`);
      }
    }
  }
}

generate().catch(console.error);