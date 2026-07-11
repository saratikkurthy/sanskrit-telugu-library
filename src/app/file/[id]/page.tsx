import { db } from "@/db";
import { library_files } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from 'next/link';

export default async function FileDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fileId = parseInt(id);

  // Fetch the specific file from the database
  const [file] = await db.select()
    .from(library_files)
    .where(eq(library_files.id, fileId));

  if (!file) notFound();

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Link href="/">← Back to Library</Link>
      
      <div style={{ marginTop: "2rem", border: "1px solid #ccc", padding: "2rem", borderRadius: "8px" }}>
        <h1>{file.file_name}</h1>
        
        <div style={{ marginTop: "2rem" }}>
          <p><strong>Author:</strong> {file.author || "Not specified"}</p>
          <p><strong>Language:</strong> {file.language || "Not specified"}</p>
          <p><strong>Size:</strong> {file.file_size ? (file.file_size / 1024 / 1024).toFixed(2) : "0"} MB</p>
          <p><strong>Database Path:</strong> {file.file_path}</p>
        </div>
        
        <div style={{ marginTop: "2rem" }}>
          <Link 
            href={`/assign/${file.id}`} 
            style={{ padding: "0.5rem 1rem", background: "#0070f3", color: "white", textDecoration: "none", borderRadius: "4px" }}
          >
            Edit Assignment
          </Link>
        </div>
      </div>
    </main>
  );
}