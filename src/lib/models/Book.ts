import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBook extends Document {
  bookId: string;
  title: string;
  author: string;
  description: string;
  category: "Story" | "Tech" | "Science";
  available_quantity: number;
  image_url: string;
}

const BookSchema: Schema = new Schema(
  {
    bookId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Story", "Tech", "Science"],
    },
    available_quantity: { type: Number, required: true, default: 0 },
    image_url: { type: String, required: true },
  },
  { timestamps: true }
);

const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);

export default Book;
