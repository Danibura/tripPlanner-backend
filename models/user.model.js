import mongoose from "mongoose";
import bcrypt from "bcrypt";

const InvitationSchema = new mongoose.Schema({
  tripCode: { type: String, required: true },
  fromEmail: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  pfp: {
    type: Number,
    required: true,
    default: () => Math.floor(Math.random() * 10) + 1,
  },
  trips: {
    type: [String],
    required: false,
  },
  friends: {
    type: [String],
    required: false,
  },
  requests: {
    type: [String],
    required: false,
  },
  invitations: {
    type: [InvitationSchema],
    required: false,
  },
  resetToken: {
    type: String,
    required: false,
  },
  calendarCode: {
    type: String,
    required: false,
    default: () => Math.floor(Math.random() * 100000000),
  },
  showCalendar: {
    type: Boolean,
    required: false,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
