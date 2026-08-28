import { Schema, models, model, Model } from "mongoose";

export interface IDistributor {
  name: string;
  businessName: string;
  email: string;
  whatsapp: string;
  state: string;
  city: string;
  status: "new" | "reviewing" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const DistributorSchema = new Schema<IDistributor>(
  {
    name: { type: String, required: true },
    businessName: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "reviewing", "approved", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const Distributor: Model<IDistributor> =
  (models.Distributor as Model<IDistributor>) || model<IDistributor>("Distributor", DistributorSchema);
