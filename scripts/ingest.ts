import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { db } from '../src/db/index';
import { files } from '../src/db/schema';

// Helper to hash files
async function getFileHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

// RECURSIVE function to walk through all subdirectories
async function scanDirectory(dir: string) {
  // Check if directory exists first (Robustness check)
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    
    if (entry.isDirectory()) {
      // RECURSION: If it's a folder, call the function again for this folder
      await scanDirectory(res);
    } else if (entry.name.toLowerCase().endsWith('.pdf')) {
      console.log(`Processing: ${entry.name}`);
      const hash = await getFileHash(res);
      const stats = fs.statSync(res);

      await db.insert(files).values({
        fileName: entry.name,
        filePath: res,
        fileHash: hash,
        fileSize: stats.size,
      }).onConflictDoNothing();
    }
  }
}

// Run the scan
const targetDir = 'F:\\Devotional_Books\\'; // Update this to your path
scanDirectory(targetDir).catch(console.error);