import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBorrow extends Document {
  userId: string;
  userName: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  borrowDate: Date;
  returnDate?: Date;
  status: "borrowed" | "returned";
}

const BorrowSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    bookId: { type: String, required: true },
    bookTitle: { type: String, required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed",
    },
  },
  { timestamps: true }
);

const Borrow: Model<IBorrow> =
  mongoose.models.Borrow || mongoose.model<IBorrow>("Borrow", BorrowSchema);

export default Borrow;
