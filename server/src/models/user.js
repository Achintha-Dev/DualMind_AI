import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
      maxlength: 80,
    },
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    // null for Google OAuth users (no password)
    password: {
      type:   String,
      select: false, // never returned in queries by default
    },
    // Google OAuth
    googleId: {
      type:   String,
      unique:  true,
      sparse:  true, // allows multiple null values
    },
    avatar: {
      type: String, // URL from Google profile photo
    },
    provider: {
      type:    String,
      enum:    ['local', 'google'],
      default: 'local',
    },
  },
  { timestamps: true }
);

// Hash password before saving 
userSchema.pre('save', async function () {
  // Only hash if password was modified
  if (!this.isModified('password') || !this.password) return ;
  this.password = await bcrypt.hash(this.password, 12);
});

// Instance method: compare password 
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Never expose password in JSON responses 
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.googleId;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;