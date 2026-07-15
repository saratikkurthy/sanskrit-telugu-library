"use client";
import Link from 'next/link';
import { useState } from 'react';

interface Category { id: number; name: string; }
interface SidebarProps {
    categories: Category[];
    // Update the prop signature to accept a string
    onAddCategory: (name: string) => Promise<void>;
}

export default function Sidebar({ categories, onAddCategory }: SidebarProps) {
    const [newName, setNewName] = useState("");

    const handleAdd = async () => {
        if (!newName.trim()) return;
        await onAddCategory(newName);
        setNewName(""); // Clear input after success
    };

    return (
        <nav style={{ width: '250px', padding: '1rem', borderRight: '1px solid #ccc' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>My Library</h2>
            {/* ... (Your existing list code) ... */}
            
            <h3>Categories</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><Link href="/">All PDFs</Link></li>
                {categories.map((cat) => (
                    <li key={cat.id}>
                        <Link href={`/?categoryId=${cat.id}`}>{cat.name}</Link>
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: '1rem' }}>
                <input 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Add new category..." 
                />
                <button onClick={handleAdd}>Add</button>
            </div>
        </nav>
    );
}