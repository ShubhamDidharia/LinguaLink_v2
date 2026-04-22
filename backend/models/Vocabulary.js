import mongoose from 'mongoose'

const { Schema } = mongoose

const VocabularySchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    word: { type: String, required: true },
    meaning: { type: String, required: true },
    language: { type: String, required: true },
    examples: { type: [String], default: [] },
    synonyms: { type: [String], default: [] },
    addedVia: { type: String, enum: ['manual', 'ai-dictionary'], default: 'manual' },
    tags: { type: [String], default: [] }, // For organizing vocab
  },
  { timestamps: true }
)

// Index for efficient querying
VocabularySchema.index({ workspaceId: 1 })
VocabularySchema.index({ userId: 1, language: 1 })

export default mongoose.model('Vocabulary', VocabularySchema)
