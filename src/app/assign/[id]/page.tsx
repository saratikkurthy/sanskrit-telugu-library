import CategoryAssigner from "@/components/CategoryAssigner";
import MetadataForm from "@/components/MetadataForm"; // Import the client form
import Link from "next/link";
import { db } from "@/db";
import { categories, library_files } from "@/db/schema";
import { eq } from "drizzle-orm";// At the top of your component or imported from your actions file
import { logActivity } from "@/app/actions/activity";
import ViewButton from "@/components/ViewButton";

export default async function AssignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fileId = Number(id);

  const categoryList = await db.select().from(categories);
  const file = await db.select().from(library_files).where(eq(library_files.id, fileId)).get();

  const handleView = async (id: number) => {
    await logActivity(id);
    // Assuming your PDFs are served from a specific URL or route
    window.open(`/pdf/${id}`, '_blank');
  };

  if (!file) return <div>File not found.</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Step 1: Categorize Document {id}</h1>

      <CategoryAssigner
        fileId={fileId}
        categories={categoryList}
        currentCatId={file.category_id ?? null}
      />

      <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
        <h3>Step 2: Update Metadata</h3>
        <MetadataForm
          fileId={fileId}
          title={file.title}
          author={file.author}
          language={file.language}
        />
      </div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link href="/" style={{ padding: '10px', color: 'gray', textDecoration: 'underline' }}>
          ← Back to Library
        </Link>
        
        {/* Replace the Link/button with your new Client Component */}
        <ViewButton fileId={file.id} />
      </div>
    </div>
   
  );
}