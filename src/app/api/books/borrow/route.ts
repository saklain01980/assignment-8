import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Book from "@/lib/models/Book";
import Borrow from "@/lib/models/Borrow";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, userName, userEmail, bookId } = body;

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "User ID and Book ID are required" },
        { status: 400 }
      );
    }

    const book = await Book.findOne({ bookId });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.available_quantity <= 0) {
      return NextResponse.json(
        { error: "Book is not available for borrowing" },
        { status: 400 }
      );
    }

    // Check if user already borrowed this book
    const existingBorrow = await Borrow.findOne({
      userId,
      bookId,
      status: "borrowed",
    });

    if (existingBorrow) {
      return NextResponse.json(
        { error: "You have already borrowed this book" },
        { status: 400 }
      );
    }

    // Create borrow record
    const borrow = new Borrow({
      userId,
      userName: userName || "User",
      userEmail: userEmail || "",
      bookId,
      bookTitle: book.title,
      borrowDate: new Date(),
      status: "borrowed",
    });

    await borrow.save();

    // Decrease available quantity
    book.available_quantity -= 1;
    await book.save();

    return NextResponse.json({
      message: "Book borrowed successfully",
      borrow,
      availableQuantity: book.available_quantity,
    });
  } catch (error) {
    console.error("Borrow error:", error);
    return NextResponse.json(
      { error: "Failed to borrow book" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const borrows = await Borrow.find({ userId }).sort({ borrowDate: -1 });

    return NextResponse.json(borrows);
  } catch (error) {
    console.error("Fetch borrows error:", error);
    return NextResponse.json(
      { error: "Failed to fetch borrow records" },
      { status: 500 }
    );
  }
}
