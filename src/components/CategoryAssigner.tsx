'use client';
import { assignCategoryAction, createCategory } from '@/app/actions';
import { useState, useTransition } from 'react';

export default function CategoryAssigner({ fileId, currentCatId, categories }: {
  fileId: number,
  currentCatId: number | null,
  categories: { id: number, name: string }[]
}) {
  const [selectedCatId, setSelectedCatId] = useState<number | null>(currentCatId);
  const [newCatName, setNewCatName] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await assignCategoryAction(fileId, selectedCatId);
    });
  };

  const handleCreate = async () => {
    if (!newCatName.trim()) return;
    await createCategory(newCatName);
    setNewCatName(''); 
    // Note: Since you are in a Client Component, refreshing the page or 
    // using a router.refresh() here would update the dropdown list.
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Assignment Section */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select
          value={selectedCatId ?? ""}
          onChange={(e) => setSelectedCatId(e.target.value ? parseInt(e.target.value) : null)}
          style={{ padding: '0.5rem', borderRadius: '4px' }}
        >
          {/* This option effectively unassigns the category when saved */}
          <option value="">No Category</option>
          {categories?.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        
        <button 
          onClick={handleSave} 
          disabled={isPending}
          style={{ padding: '0.5rem 1rem', background: 'green', color: 'white', cursor: 'pointer' }}
        >
          {isPending ? "Saving..." : "Save Assignment"}
        </button>
      </div>

      {/* Inline Creation Section */}
      <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        <input 
          placeholder="New category name..."
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '5px' }}
        />
        <button onClick={handleCreate} style={{ padding: '0.5rem', cursor: 'pointer' }}>+ Quick Add</button>
      </div>
    </div>
  );
}