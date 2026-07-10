'use client';
import { useTransition } from 'react';
import { toggleFavoriteAction } from '@/app/actions';

export default function FavoriteButton({ fileId, isFav, categoryId }: { fileId: number, isFav: boolean, categoryId: number | null }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      onClick={() => startTransition(() => toggleFavoriteAction(fileId, categoryId))}
      disabled={isPending}
      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
    >
      {isFav ? '❤️' : '🤍'}
    </button>
  );
}