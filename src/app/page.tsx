import { db } from "@/db";
import { library_files, favorites, categories, file_activity } from "@/db/schema";
import { like, count, eq, and, asc, desc } from "drizzle-orm";
import crypto from 'crypto';
import path from 'path';
import Link from 'next/link';
import FavoriteButton from "@/components/FavoriteButton";
import CategorySidebar from "@/components/CategorySidebar";
import ScanButton from "@/components/ScanButton";
import { getLastScanned } from "@/app/actions/library";
import LibraryMenu from "@/components/LibraryMenu";


function getShardPath(filename: string) {
  const hash = crypto.createHash('md5').update(filename).digest('hex');
  return path.join(hash.substring(0, 2), hash.substring(2, 4));
}

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; limit?: string; categoryId?: string; sort?: string }> }) {
  const { q = "", page = "1", limit = "20", categoryId, sort = "name_asc" } = await searchParams;
  const currentPage = parseInt(page);
  const currentLimit = parseInt(limit);
  const offset = (currentPage - 1) * currentLimit;
  const catId = categoryId ? parseInt(categoryId) : null;
  const lastScanned = await getLastScanned();

  // --- 1. PREPARE FILTERS ---
  const filters = [];
  if (q) filters.push(like(library_files.file_name, `%${q}%`));
  if (catId) filters.push(eq(library_files.category_id, catId));
  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  let orderByClause;
  switch (sort) {
    case "name_desc": orderByClause = desc(library_files.file_name); break;
    case "size_asc": orderByClause = asc(library_files.file_size); break;
    case "size_desc": orderByClause = desc(library_files.file_size); break;
    case "time_desc": orderByClause = desc(library_files.created_at); break;
    case "name_asc":
    default: orderByClause = asc(library_files.file_name); break;
  }

  // --- 2. FETCH DATA IN PARALLEL ---
  const [totalResults, results, userFavorites, allCategories, mostVisited, recentFiles] = await Promise.all([
    db.select({ count: count() }).from(library_files).where(whereClause).get(),
    db.select().from(library_files).where(whereClause).orderBy(orderByClause).limit(currentLimit).offset(offset),
    db.select().from(favorites),
    db.select().from(categories),
    // Most Visited (using view_count column)
    db.select({ file_name: library_files.file_name, count: library_files.view_count })
      .from(library_files).orderBy(desc(library_files.view_count)).limit(5),
    // Recent Reads (using last_accessed column)
    db.select().from(library_files).orderBy(desc(library_files.last_accessed)).limit(5)
  ]);

  const totalPages = Math.ceil((totalResults?.count || 0) / currentLimit);

  // --- 3. RENDER ---
  return (
    <main style={{ display: 'flex', minHeight: '100vh' }}>
      {/*<CategorySidebar categories={allCategories} />*/}
      <div style={{ flex: 1, padding: "2rem" }}>

        {/* Stats Section */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <h1>Library</h1>
           <LibraryMenu />
        </div>
       
        <div style={{ textAlign: 'right' }}>
          <ScanButton />
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
            {/* Format the date to be human-readable */}
            Last scanned: {lastScanned ? lastScanned.toLocaleString() : "Never"}
          </p>
        </div>


        {/* Search, Filter, Sort Form */}
        <form method="GET" action="/" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <input name="q" defaultValue={q} placeholder="Search..." style={{ padding: '0.5rem' }} />
          <input type="hidden" name="categoryId" value={categoryId || ''} />
          <select name="limit" defaultValue={currentLimit} style={{ padding: '0.5rem' }}>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
          <select name="sort" defaultValue={sort} style={{ padding: '0.5rem' }}>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="size_asc">Size (Low-High)</option>
            <option value="size_desc">Size (High-Low)</option>
            <option value="time_desc">Newest First</option>
          </select>
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>Apply</button>
        </form>

        {/* BULK ASSIGNMENT FORM */}
        <form action="/api/bulk-assign" method="POST">
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select name="categoryId" required style={{ padding: '0.5rem' }}>
              <option value="">Select Category</option>
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button type="submit" style={{ padding: '0.5rem 1rem' }}>Assign Selected to Category</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {results.map((file) => {
              const shard = getShardPath(file.file_name);
              const thumbUrl = `/thumbnails/${shard.replace(/\\/g, '/')}/thumb_${file.file_name.replace('.pdf', '')}.1.png`;
              const isFav = userFavorites.some(f => f.file_id === file.id);
              return (
                <div key={file.id} style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center', position: 'relative' }}>
                  <input type="checkbox" name="fileIds" value={file.id} style={{ position: 'absolute', top: '5px', left: '5px' }} />
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
        </form>

        {/* Pagination */}
        {/* Pagination Section */}
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
          <Link href={`/?q=${q}&page=${Math.max(1, currentPage - 1)}&limit=${currentLimit}${categoryId ? `&categoryId=${categoryId}` : ''}&sort=${sort}`}>
            « Prev
          </Link>

          <span>Page {currentPage} of {totalPages}</span>

          {/* Page Jump Input */}
          <form method="GET" action="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="hidden" name="q" value={q} />
            <input type="hidden" name="limit" value={currentLimit} />
            <input type="hidden" name="categoryId" value={categoryId || ''} />
            <input type="hidden" name="sort" value={sort} />

            <label htmlFor="page">Jump to:</label>
            <input
              type="number"
              name="page"
              min="1"
              max={totalPages}
              defaultValue={currentPage}
              style={{ width: '50px', padding: '0.2rem' }}
            />
            <button type="submit" style={{ padding: '0.2rem 0.5rem' }}>Go</button>
          </form>

          <Link href={`/?q=${q}&page=${Math.min(totalPages, currentPage + 1)}&limit=${currentLimit}${categoryId ? `&categoryId=${categoryId}` : ''}&sort=${sort}`}>
            Next »
          </Link>
        </div>
      </div>
    </main>
  );
}