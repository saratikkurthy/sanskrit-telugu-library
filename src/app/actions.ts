'use server';

import { db } from "@/db";
import { categories, library_files, favorites } from "@/db/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCategory(name: string) {
  if (!name.trim()) return;
  await db.insert(categories).values({ name: name.trim() });
  revalidatePath('/');
}

export async function assignCategoryAction(fileId: number, categoryId: number | null) {
  await db.update(library_files)
    .set({ category_id: categoryId })
    .where(eq(library_files.id, fileId));
  revalidatePath('/');
}

export async function bulkAssignCategory(formData: FormData) {
  const categoryIdStr = formData.get("categoryId") as string;
  const fileIds = formData.getAll("fileIds").map(id => parseInt(id as string));

  if (fileIds.length > 0) {
    const categoryId = categoryIdStr === "" ? null : parseInt(categoryIdStr);
    await db.update(library_files)
      .set({ category_id: categoryId })
      .where(inArray(library_files.id, fileIds));
  }
  revalidatePath('/');
}

export async function deleteFileAction(fileId: number) {
  await db.delete(library_files).where(eq(library_files.id, fileId));
  revalidatePath('/library/duplicates');
}

export async function toggleFavoriteAction(fileId: number, categoryId: number | null) {
  try {
    const existing = await db.select().from(favorites)
      .where(
        categoryId
          ? and(eq(favorites.file_id, fileId), eq(favorites.category_id, categoryId))
          : and(eq(favorites.file_id, fileId), isNull(favorites.category_id))
      )
      .get();

    if (existing) {
      await db.delete(favorites).where(eq(favorites.id, existing.id));
    } else {
      await db.insert(favorites).values({
        file_id: fileId,
        is_global: !categoryId,
        category_id: categoryId,
      });
    }
    revalidatePath('/');
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
    throw new Error("Could not toggle favorite status.");
  }
}