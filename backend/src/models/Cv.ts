import mongoose, { Schema, Document } from 'mongoose';

export interface ICv extends Document {
  studentId: mongoose.Types.ObjectId;
  name: string;
  fileUrl: string;
  fileId: string;
  extractedSkills: string[];
  improvementTips: string;
  createdAt: Date;
  updatedAt: Date;
}

const cvSchema = new Schema<ICv>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    name: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileId: { type: String, required: true },
    extractedSkills: [{ type: String }],
    improvementTips: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ICv>('Cv', cvSchema);
