'use server';

import { db } from "@/db";
import { categories, library_files, favorites } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCategory(name: string) {
  await db.insert(categories).values({ name });
  revalidatePath('/');
}

export async function assignCategoryAction(fileId: number, categoryId: number | null) {
  await db.update(library_files)
    .set({ category_id: categoryId })
    .where(eq(library_files.id, fileId));
  revalidatePath('/');
}
// Note: assignCategoryToFile is identical to assignCategoryAction, 
// you can keep both or delete one to clean up your code.
export async function assignCategoryToFile(fileId: number, categoryId: number | null) {
  await db.update(library_files)
    .set({ category_id: categoryId })
    .where(eq(library_files.id, fileId));
  revalidatePath('/');
}

export async function toggleFavoriteAction(fileId: number, categoryId: number | null) {
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
}