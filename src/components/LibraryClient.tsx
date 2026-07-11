'use client';
import { useState } from 'react';
import Link from 'next/link';
import FavoriteButton from "@/components/FavoriteButton";

export default function LibraryClient({ results, categories, q, page, totalPages, limit, categoryId }: any) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const categoryParam = categoryId ? `&categoryId=${categoryId}` : '';

  // Function to handle the bulk assignment
  const handleBulkAssign = async () => {
    if (selectedIds.length === 0) return;
    
    // Replace '/api/bulk-assign' with your actual endpoint or Server Action
    const response = await fetch('/api/bulk-assign', {
      method: 'POST',
      body: JSON.stringify({ fileIds: selectedIds }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      alert("Files assigned successfully!");
      window.location.reload(); // Refresh to show changes
    }
  };

  return (
    <div>
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div style={{ background: '#eee', padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Selected {selectedIds.length} files</span>
          <button onClick={handleBulkAssign} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Assign Selected to Category
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
        {results.map((file: any) => (
          <div key={file.id} style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center', position: 'relative' }}>
            <input 
              type="checkbox" 
              checked={selectedIds.includes(file.id)}
              onChange={(e) => {
                setSelectedIds(e.target.checked ? [...selectedIds, file.id] : selectedIds.filter(id => id !== file.id));
              }} 
            />
            <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
              <FavoriteButton fileId={file.id} isFav={file.isFav} categoryId={null} />
            </div>
            <Link href={`/assign/${file.id}`}>
              <img src={file.thumbUrl} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>{file.file_name}</div>
            </Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href={`/?q=${q}&page=${Math.max(1, page - 1)}&limit=${limit}${categoryParam}`}>« Prev</Link>
        <span>Page {page} of {totalPages}</span>
        <Link href={`/?q=${q}&page=${Math.min(totalPages, page + 1)}&limit=${limit}${categoryParam}`}>Next »</Link>
      </div>
    </div>
  );
}