import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const { Schema } = mongoose

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    interests: { type: [String], default: [] },
    languagesKnown: { type: [String], default: [] },
    languagesLearning: { type: [String], default: [] },
    subscription: { type: Boolean, default: false }
  },
  { timestamps: true }
)

// mongoose middleware used to hash password before saving user document( before it is persisted).
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

export default mongoose.model('User', UserSchema)
