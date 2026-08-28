import { Schema, models, model, Model } from "mongoose";

export interface IAdmin {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin: Model<IAdmin> =
  (models.Admin as Model<IAdmin>) || model<IAdmin>("Admin", AdminSchema);
