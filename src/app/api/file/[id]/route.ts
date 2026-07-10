import { db } from "@/db";
import { library_files } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = await db.select().from(library_files).where(eq(library_files.id, parseInt(id))).get();

  if (!file) return new NextResponse("Not Found", { status: 404 });

  return new NextResponse(`
    <html>
      <body style="margin:0; padding:0; font-family: sans-serif;">
        <h1 style="padding: 10px; font-size: 1.2rem;">${file.file_name}</h1>
        <iframe src="/api/pdf/${id}" style="width:100%; height:90vh; border:none;"></iframe>
      </body>
    </html>
  `, { headers: { "Content-Type": "text/html" } });
}