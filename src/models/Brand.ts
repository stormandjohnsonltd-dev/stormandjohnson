import { Schema, models, model, Model } from "mongoose";

export interface IBrand {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    logo: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Brand: Model<IBrand> =
  (models.Brand as Model<IBrand>) || model<IBrand>("Brand", BrandSchema);
