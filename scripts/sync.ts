import fs from 'fs';
import path from 'path';
import { db } from '../src/db/index';
import { eq, notInArray } from 'drizzle-orm';
// Add 'settings' to your existing imports from the schema
import { files, settings } from '../src/db/schema';


async function getScanPath(): Promise<string> {
    const result = await db.select().from(settings).where(eq(settings.key, 'scan_path')).get();
    return result?.value || 'C:\\Default\\Path';
}

async function syncLibrary(dir: string) {
    const currentFilesOnDisk: string[] = [];
    // Then call it in your sync function
    const targetDir = await getScanPath();

    // 1. Recursive Scan and Upsert (Add/Update)
    async function walk(directory: string) {
        const entries = fs.readdirSync(directory, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.resolve(directory, entry.name);
            if (entry.isDirectory()) {
                await walk(fullPath);
            } else if (entry.name.toLowerCase().endsWith('.pdf')) {
                currentFilesOnDisk.push(fullPath);

                // Use 'onConflictDoUpdate' to refresh metadata if file exists
                await db.insert(files)
                    .values({ fileName: entry.name, filePath: fullPath, fileHash: 'pending', fileSize: fs.statSync(fullPath).size })
                    .onConflictDoUpdate({
                        target: files.filePath,
                        set: { fileSize: fs.statSync(fullPath).size }
                    });
            }
        }
    }

    await walk(dir);

    // 2. Prune (Remove files from DB that aren't on disk)
    const allFilesFromDb = await db.select({ filePath: files.filePath }).from(files);
    const filesToDelete = allFilesFromDb
        .map(f => f.filePath)
        .filter(path => !currentFilesOnDisk.includes(path));

    if (filesToDelete.length > 0) {
        await db.delete(files).where(notInArray(files.filePath, currentFilesOnDisk));
        console.log(`Pruned ${filesToDelete.length} missing files from database.`);
    }
}