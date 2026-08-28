import { Schema, models, model, Model } from "mongoose";

export interface ICompany {
  name: string;
  tagline: string;
  about: string;
  mission?: string;
  vision?: string;
  officeLine: string;
  whatsappNumbers: string[];
  email: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    about: { type: String, required: true },
    mission: { type: String },
    vision: { type: String },
    officeLine: { type: String, required: true },
    whatsappNumbers: [{ type: String }],
    email: { type: String, required: true },
    address: { type: String },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
    },
  },
  { timestamps: true }
);

export const Company: Model<ICompany> =
  (models.Company as Model<ICompany>) || model<ICompany>("Company", CompanySchema);
