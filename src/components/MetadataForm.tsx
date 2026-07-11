'use client';
import { updateFileMetadata } from "@/app/actions/updateFile";

export default function MetadataForm({ fileId, title, author, language }: any) {
  return (
    <form action={async (formData: FormData) => {
        await updateFileMetadata(fileId, formData);
        alert("Saved!");
    }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input name="title" defaultValue={title || ''} placeholder="Title" />
      <input name="author" defaultValue={author || ''} placeholder="Author" />
      <input name="language" defaultValue={language || ''} placeholder="Language" />
      <button type="submit">Save Changes</button>
    </form>
  );
}