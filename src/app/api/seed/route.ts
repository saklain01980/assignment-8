import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Book from "@/lib/models/Book";
import booksData from "@/lib/data/books.json";

export async function GET() {
  try {
    await connectDB();
    
    const existingCount = await Book.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({ message: "Database already seeded", count: existingCount });
    }

    const books = booksData.map((book) => ({
      bookId: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      available_quantity: book.available_quantity,
      image_url: book.image_url,
    }));

    await Book.insertMany(books);

    return NextResponse.json({ message: "Database seeded successfully", count: books.length });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
