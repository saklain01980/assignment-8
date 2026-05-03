import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Book from "@/lib/models/Book";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const limit = parseInt(searchParams.get("limit") || "0");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    let booksQuery = Book.find(query).sort({ createdAt: -1 });

    if (limit > 0) {
      booksQuery = booksQuery.limit(limit);
    }

    const books = await booksQuery;

    return NextResponse.json(books);
  } catch (error) {
    console.error("Books fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}
