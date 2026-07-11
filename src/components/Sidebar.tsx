"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Category { id: number; name: string; }
interface SidebarProps {
    categories: Category[];
    onAddCategory: () => void;
}

export default function Sidebar({ categories, onAddCategory }: SidebarProps) {
    const pathname = usePathname();

    return (
        <nav style={{ width: '250px', padding: '1rem', borderRight: '1px solid #ccc' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>My Library</h2>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><Link href="/">🏠 Home</Link></li>
                <li><Link href="/library/recent-added">Recently Added</Link></li>
                <li><Link href="/library/recent-reads">Recent Reads</Link></li>
                <li><Link href="/library/most-visited">Most Visited</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/settings">Settings</Link></li>
            </ul>

            <hr />

            <h3>Categories</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><Link href="/">All PDFs</Link></li>
                {categories.map((cat) => (
                    <li key={cat.id}>
                        {/* THIS IS THE KEY CHANGE: 
                We point to the root ("/") and pass the categoryId parameter.
                Your page.tsx will automatically pick this up and filter the list.
            */}
                        <Link href={`/?categoryId=${cat.id}`}>
                            {cat.name}
                        </Link>
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: '1rem' }}>
                <input placeholder="Add new category..." />
                <button onClick={onAddCategory}>Add</button>
            </div>
        </nav>
    );
}