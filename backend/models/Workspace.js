import mongoose from 'mongoose'

const { Schema } = mongoose

const WorkspaceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    language: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }, // Soft delete - allows recreation
  },
  { timestamps: true }
)

// Unique constraint: one workspace folder per language per user
WorkspaceSchema.index({ userId: 1, language: 1 }, { unique: true, sparse: true })

export default mongoose.model('Workspace', WorkspaceSchema)
