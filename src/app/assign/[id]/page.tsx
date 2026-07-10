import CategoryAssigner from "@/components/CategoryAssigner";
import Link from "next/link";
import { db } from "@/db"; 
import { categories, library_files } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function AssignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fileId = Number(id);
  
  // 1. Fetch all available categories
  const categoryList = await db.select().from(categories);
  
  // 2. Fetch the current document to see its existing category_id
  const currentAssignment = await db
    .select()
    .from(library_files)
    .where(eq(library_files.id, fileId))
    .get();
  
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Step 1: Categorize Document {id}</h1>
      
      <CategoryAssigner 
        fileId={fileId} 
        categories={categoryList}
        // Corrected to category_id to match your schema definition
        currentCatId={currentAssignment?.category_id ?? null} 
      />
      
      <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
        <Link href="/" style={{ padding: '10px', color: 'gray', textDecoration: 'underline' }}>
          ← Back to Library
        </Link>
        <Link href={`/pdf/${id}`} style={{ padding: '10px', background: 'blue', color: 'white', borderRadius: '4px' }}>
          View PDF Now
        </Link>
      </div>
    </div>
  );
}