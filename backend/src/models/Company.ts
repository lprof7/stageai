import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  email: string;
  passwordHash: string;
  description?: string;
  location?: string;
  logoUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    logoUrl: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<ICompany>('Company', companySchema);
