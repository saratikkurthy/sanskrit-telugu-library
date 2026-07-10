'use client';
import { createCategory } from '@/app/actions';
import Link from 'next/link';

export default function CategorySidebar({ categories }: { categories: { id: number, name: string }[] }) {
  return (
    <nav style={{ padding: '1rem', borderRight: '1px solid #ddd', minWidth: '220px', background: '#fafafa' }}>
      {/* SECTION 1: The 'All' Reset Link */}
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>Navigation</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '2rem' }}>
        <li>
          <Link href="/" style={{ textDecoration: 'none', color: '#000', fontWeight: 'bold' }}>
            All PDFs
          </Link>
        </li>
      </ul>

      {/* SECTION 2: The actual Categories list */}
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>Categories</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {categories.map((cat) => (
          <li key={cat.id} style={{ marginBottom: '0.25rem' }}>
            <Link href={`/?categoryId=${cat.id}`} style={{ textDecoration: 'none', color: '#555' }}>
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
      

      {/* Creation Form */}
      <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
        <form action={async (formData) => {
          const name = formData.get('name') as string;
          if (name) await createCategory(name);
        }} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input name="name" placeholder="Add new category..." required style={{ padding: '0.4rem', border: '1px solid #ccc' }} />
          <button type="submit" style={{ padding: '0.4rem', cursor: 'pointer' }}>Add</button>
        </form>
      </div>
    </nav>
  );
}