'use server';
import { db } from "@/db";
import { library_files } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateFileMetadata(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  const language = formData.get('language') as string;

  try {
    await db.update(library_files)
      .set({ title, author, language })
      .where(eq(library_files.id, id));

    revalidatePath(`/file/${id}`);
    revalidatePath(`/assign/${id}`);
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error("Update failed:", error);
    return { success: false, error: "Failed to update" };
  }
}