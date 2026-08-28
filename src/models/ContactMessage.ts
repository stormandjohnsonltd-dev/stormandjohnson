import { Schema, models, model, Model } from "mongoose";

export interface IContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const ContactMessage: Model<IContactMessage> =
  (models.ContactMessage as Model<IContactMessage>) || model<IContactMessage>("ContactMessage", ContactMessageSchema);

