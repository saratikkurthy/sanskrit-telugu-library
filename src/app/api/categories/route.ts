import { db } from "@/db";
import { categories } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name) return new NextResponse("Name required", { status: 400 });
  
  await db.insert(categories).values({ name });
  return NextResponse.json({ success: true });
}