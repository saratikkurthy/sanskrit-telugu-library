"use client"; // This tells Next.js this is a Client Component

import { logActivity } from "@/app/actions/activity";

export default function ViewButton({ fileId }: { fileId: number }) {
  const handleView = async () => {
    await logActivity(fileId);
    window.open(`/pdf/${fileId}`, '_blank');
  };

  return (
    <button 
      onClick={handleView}
      style={{ 
        padding: '10px', 
        backgroundColor: 'blue', 
        color: 'white', 
        borderRadius: '4px', 
        cursor: 'pointer',
        border: 'none'
      }}
    >
      View PDF Now
    </button>
  );
}