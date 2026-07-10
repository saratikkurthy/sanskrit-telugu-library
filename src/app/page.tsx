import { db } from "@/db";
import { library_files, favorites, categories } from "@/db/schema";
import { like, count, eq, and } from "drizzle-orm"; // Added 'and', 'eq'
import Link from 'next/link';
import crypto from 'crypto';
import path from 'path';
import { redirect } from 'next/navigation';
import FavoriteButton from "@/components/FavoriteButton";
import CategorySidebar from "@/components/CategorySidebar";

function getShardPath(filename: string) {
  const hash = crypto.createHash('md5').update(filename).digest('hex');
  return path.join(hash.substring(0, 2), hash.substring(2, 4));
}

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; limit?: string; categoryId?: string }> }) {
  const { q = "", page = "1", limit = "20", categoryId } = await searchParams;
  const currentPage = parseInt(page);
  const currentLimit = parseInt(limit);
  const offset = (currentPage - 1) * currentLimit;
  const catId = categoryId ? parseInt(categoryId) : null;

  // Build filters dynamically
  const filters = [];
  if (q) filters.push(like(library_files.file_name, `%${q}%`));
  if (catId) filters.push(eq(library_files.category_id, catId));
  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  const totalResults = await db.select({ count: count() }).from(library_files).where(whereClause).get();
  const totalPages = Math.ceil((totalResults?.count || 0) / currentLimit);
  const results = await db.select().from(library_files).where(whereClause).limit(currentLimit).offset(offset);
  
  const userFavorites = await db.select().from(favorites);
  const allCategories = await db.select().from(categories);

  async function jumpToPage(formData: FormData) {
    'use server';
    const target = formData.get('targetPage');
    const q = formData.get('q');
    const limit = formData.get('limit');
    const catId = formData.get('categoryId');
    redirect(`/?q=${q}&page=${target}&limit=${limit}${catId ? `&categoryId=${catId}` : ''}`);
  }

  return (
    <main style={{ display: 'flex', minHeight: '100vh' }}>
      <CategorySidebar categories={allCategories} />
      
      <div style={{ flex: 1, padding: "2rem" }}>
        <h1>Library</h1>
        <form method="GET" action="/" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <input name="q" defaultValue={q} placeholder="Search..." style={{ padding: '0.5rem' }} />
          <input type="hidden" name="categoryId" value={categoryId || ''} />
          <select name="limit" defaultValue={currentLimit} style={{ padding: '0.5rem' }}>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>Apply</button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {results.map((file) => {
            const shard = getShardPath(file.file_name);
            const thumbUrl = `/thumbnails/${shard.replace(/\\/g, '/')}/thumb_${file.file_name.replace('.pdf', '')}.1.png`;
            const isFav = userFavorites.some(f => f.file_id === file.id);

            return (
              <div key={file.id} style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                  <FavoriteButton fileId={file.id} isFav={isFav} categoryId={null} />
                </div>
                <Link href={`/assign/${file.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={thumbUrl} alt={file.file_name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>{file.file_name}</div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Pagination logic updated to preserve categoryId */}
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
          <Link href={`/?q=${q}&page=${Math.max(1, currentPage - 1)}&limit=${currentLimit}${categoryId ? `&categoryId=${categoryId}` : ''}`}>« Prev</Link>
          <span>Page {currentPage} of {totalPages}</span>
          <Link href={`/?q=${q}&page=${Math.min(totalPages, currentPage + 1)}&limit=${currentLimit}${categoryId ? `&categoryId=${categoryId}` : ''}`}>Next »</Link>
        </div>
      </div>
    </main>
  );
}