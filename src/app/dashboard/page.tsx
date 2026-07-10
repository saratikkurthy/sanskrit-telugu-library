import { db } from "@/db";
import { library_files, categories } from "@/db/schema";
import FavoriteButton from "@/components/FavoriteButton";

export default async function Dashboard() {
  const filesList = await db.select().from(library_files);
  const catsList = await db.select().from(categories);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#7c2d12' }}>Library Manager</h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2>Create Category</h2>
        <form action="/api/categories" method="POST" style={{ display: 'flex', gap: '0.5rem' }}>
          <input name="name" placeholder="Category Name" style={{ padding: '0.5rem' }} />
          <button type="submit" style={{ padding: '0.5rem 1rem', background: '#7c2d12', color: 'white', border: 'none' }}>Add</button>
        </form>
      </section>

      <section>
        <h2>Mark Favorites</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filesList.map((file) => (
            <div key={file.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #eee' }}>
              <span>{file.file_name}</span>
              <FavoriteButton fileId={file.id} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}