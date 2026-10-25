import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    course: { type: String, trim: true, maxlength: 120, default: '' },
    college: { type: String, trim: true, maxlength: 120, default: '' },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    verificationTokenHash: { type: String, select: false },
    verificationExpires: { type: Date, select: false },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true },
)

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

userSchema.statics.hashPassword = (plain) => bcrypt.hash(plain, 12)

/** Shape the frontend's `Seller` type expects. */
userSchema.methods.toSeller = function () {
  return { id: String(this._id), name: this.name, course: this.course, college: this.college }
}

/** Shape returned to the logged-in user. */
userSchema.methods.toAccount = function () {
  return {
    id: String(this._id),
    name: this.name,
    email: this.email,
    course: this.course,
    college: this.college,
    avatar: this.avatar,
    role: this.role,
    isVerified: this.isVerified,
  }
}

export const User = mongoose.model('User', userSchema)
