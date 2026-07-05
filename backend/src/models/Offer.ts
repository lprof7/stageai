import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
  companyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  paymentType: 'paid' | 'unpaid';
  employmentType: 'full_time' | 'part_time' | 'remote' | 'hybrid';
  requiredSkills: string[];
  durationMonths?: number;
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<IOffer>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    paymentType: { type: String, enum: ['paid', 'unpaid'], required: true },
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'remote', 'hybrid'],
      required: true,
    },
    requiredSkills: [{ type: String }],
    durationMonths: { type: Number },
    location: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOffer>('Offer', offerSchema);
