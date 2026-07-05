import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  location?: string;
  education?: string;
  bio?: string;
  profilePictureUrl?: string;
  onboardingMethod: 'upload' | 'manual';
  role: 'student' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    education: { type: String },
    bio: { type: String },
    profilePictureUrl: { type: String },
    onboardingMethod: { type: String, enum: ['upload', 'manual'], required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
  },
  { timestamps: true }
);

export default mongoose.model<IStudent>('Student', studentSchema);
