import { db } from "@/db";
import { library_files } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = await db.select().from(library_files).where(eq(library_files.id, parseInt(id))).get();

  if (!file || !file.file_path) return new NextResponse("Not Found", { status: 404 });

  try {
    const stats = statSync(file.file_path);
    const stream = createReadStream(file.file_path);

    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": stats.size.toString(),
      },
    });
  } catch (error) {
    return new NextResponse("Error reading file", { status: 500 });
  }
}