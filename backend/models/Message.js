import mongoose from 'mongoose'

const { Schema } = mongoose

const MessageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 2000 },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null }
  },
  { timestamps: true }
)

// Index for efficient chat retrieval
MessageSchema.index({ sender: 1, receiver: 1, createdAt: 1 })
MessageSchema.index({ receiver: 1, isRead: 1 })

export default mongoose.model('Message', MessageSchema)
