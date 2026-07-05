import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  studentId: mongoose.Types.ObjectId;
  cvId: mongoose.Types.ObjectId;
  offerId: mongoose.Types.ObjectId;
  motivationLetter: string;
  matchPercentageSnapshot: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    cvId: { type: Schema.Types.ObjectId, ref: 'Cv', required: true },
    offerId: { type: Schema.Types.ObjectId, ref: 'Offer', required: true },
    motivationLetter: { type: String, required: true },
    matchPercentageSnapshot: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>('Application', applicationSchema);
