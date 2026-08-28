import { Schema, models, model, Types, Model } from "mongoose";

export interface IEnquiry {
  product: Types.ObjectId;
  productName: string;
  name: string;
  email: string;
  phone: string;
  quantity: number;
  deliveryAddress: string;
  message?: string;
  status: "new" | "contacted" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    deliveryAddress: { type: String, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["new", "contacted", "completed", "cancelled"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const Enquiry: Model<IEnquiry> =
  (models.Enquiry as Model<IEnquiry>) || model<IEnquiry>("Enquiry", EnquirySchema);
