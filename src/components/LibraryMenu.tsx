import Link from 'next/link';

export default function LibraryMenu() {
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link href="/library/recent-added">Recently Added</Link>
      <Link href="/library/recent-reads">Recent Reads</Link>
      <Link href="/library/most-visited">Most Visited</Link>
      <Link href="/library/duplicates" style={{ color: 'red', fontWeight: 'bold' }}>
        View Duplicates
      </Link>
    </nav>
  );
}