'use client';
import { deleteFileAction } from "@/app/actions";

export default function DeleteButton({ fileId }: { fileId: number }) {
  const handleDelete = async () => {
    if (confirm("Are you sure? This will permanently remove the file.")) {
      await deleteFileAction(fileId);
      window.location.reload(); // Refresh the list
    }
  };
  return <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>;
}