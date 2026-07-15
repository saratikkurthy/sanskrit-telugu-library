import { db } from "@/db";
import { library_files } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import Link from 'next/link';
import crypto from 'crypto';
import path from 'path';
import { deleteFileAction } from "@/app/actions"; // You will need to create this action

function getShardPath(filename: string) {
  const hash = crypto.createHash('md5').update(filename).digest('hex');
  return path.join(hash.substring(0, 2), hash.substring(2, 4));
}

export default async function DuplicatesPage() {
  const duplicates = await db.select()
    .from(library_files)
    .where(sql`${library_files.file_hash} IN (
      SELECT file_hash FROM files 
      GROUP BY file_hash HAVING COUNT(*) > 1
    )`)
    .orderBy(library_files.file_hash);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Duplicate Files</h1>
      <Link href="/">← Back to Library</Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        {duplicates.map((file) => {
          const shard = getShardPath(file.file_name);
          const thumbUrl = `/thumbnails/${shard.replace(/\\/g, '/')}/thumb_${file.file_name.replace('.pdf', '')}.1.png`;
          
          return (
            <div key={file.id} style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center' }}>
              <img src={thumbUrl} alt={file.file_name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <div style={{ fontSize: '0.7rem', margin: '0.5rem 0' }}>{file.file_name}</div>
              
              <form action={async () => {
                'use server';
                const confirmed = confirm("Are you sure you want to delete this file?"); // Note: confirm() only works in client components
                // See instructions below to handle confirmation
                await deleteFileAction(file.id);
              }}>
                <button type="submit" style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}