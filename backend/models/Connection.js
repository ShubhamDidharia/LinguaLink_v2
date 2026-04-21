import mongoose from 'mongoose'

const { Schema } = mongoose

const ConnectionSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected', 'blocked'], 
      default: 'pending' 
    },
    rejectedAt: { type: Date, default: null },
    acceptedAt: { type: Date, default: null }
  },
  { timestamps: true }
)

// Ensure unique connection request per sender-receiver pair
ConnectionSchema.index({ sender: 1, receiver: 1 }, { unique: true })

export default mongoose.model('Connection', ConnectionSchema)
