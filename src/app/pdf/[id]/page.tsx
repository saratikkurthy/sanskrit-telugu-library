import { db } from "@/db";
import { library_files, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import CategoryAssigner from "@/components/CategoryAssigner";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  console.log("--- DEBUG: PAGE ROUTE IS HIT ---");
  console.log("I AM RENDERING THE PAGE FILE"); // <-- Add this
  const { id } = await params;
  const file = await db.select().from(library_files).where(eq(library_files.id, parseInt(id))).get();
  const allCategories = await db.select().from(categories);

  if (!file) return <div>Not Found</div>;

  return (
    <main style={{ padding: '1rem' }}>
      {/* THIS IS THE MISSING PIECE: */}
      <div style={{ padding: '1rem', background: '#f0f0f0', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <strong>Assign PDF to Category:</strong>
        <CategoryAssigner 
          fileId={file.id} 
          currentCatId={file.category_id} 
          categories={allCategories} 
        />
      </div>

      {/* Your existing PDF viewer */}
      <iframe src={`/api/pdf/${id}`} style={{ width: '100%', height: '80vh', border: 'none' }} />
    </main>
  );
}