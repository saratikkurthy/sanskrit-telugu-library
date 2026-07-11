import { NextResponse } from 'next/server';
import { db } from "@/db";
import { library_files } from "@/db/schema";
import { inArray } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fileIds = formData.getAll('fileIds').map(id => Number(id));
    const categoryId = Number(formData.get('categoryId'));

    console.log("Bulk Assign - Received IDs:", fileIds);
    console.log("Bulk Assign - Target Category:", categoryId);

    if (fileIds.length > 0 && categoryId) {
      const result = await db.update(library_files)
        .set({ category_id: categoryId })
        .where(inArray(library_files.id, fileIds));
        
      console.log("Database update result:", result);
    } else {
      console.log("Bulk Assign - Missing IDs or Category");
    }

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error("Bulk Assign Error:", error);
    return new NextResponse("Error processing assignment", { status: 500 });
  }
}