import mongoose, { Document, Schema } from "mongoose";

export interface ICertificate extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  certificateId: string; // Unique certificate ID
  issuedAt: Date;
  completionPercentage: number;
  status: "ACTIVE" | "REVOKED";
  _destroy: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    issuedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completionPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "REVOKED"],
      default: "ACTIVE",
    },
    _destroy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CertificateSchema.index({ user: 1, course: 1 });
CertificateSchema.index({ certificateId: 1 });
CertificateSchema.index({ _destroy: 1 });
CertificateSchema.index({ status: 1 });

// Generate unique certificate ID
CertificateSchema.pre("save", async function (next) {
  if (!this.certificateId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.certificateId = `CERT-${timestamp}-${random}`;
  }
  next();
});

const Certificate = mongoose.models.Certificate || mongoose.model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;
