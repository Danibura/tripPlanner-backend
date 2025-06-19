import User from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import RefreshToken from "../models/RefreshToken.js";
dotenv.config();
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.log("Error in fetching users");
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

const register = async (req, res) => {
  const { name, birthday, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(401).json({ message: "User already registered" });

    const user = new User({ name, birthday, email, password });
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await RefreshToken.create({ token: refreshToken, userId: user._id });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(201).json({
      message: "Registration completed",
      user: safeUser,
      accessToken,
      refreshToken,
    });
    res.status(201).json({ message: "Registration completed" });
  } catch (err) {
    res.status(500).json({ message: "Error during registration" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({ token: refreshToken, userId: user._id });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json({
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};

const refToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  const tokenInDb = await RefreshToken.findOne({ token: refreshToken });
  if (!tokenInDb) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(403);

      const user = await User.findById(decoded.id);
      if (!user) return res.sendStatus(404);

      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    }
  );
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  await RefreshToken.deleteOne({ token: refreshToken });
  res.sendStatus(204);
};

const updateUser = async (req, res) => {
  const { email } = req.params;
  const updatedUser = req.body;
  try {
    const newUser = await User.findOneAndUpdate({ email: email }, updatedUser, {
      new: true,
    });
    if (!newUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    await RefreshToken.create({ token: refreshToken, userId: newUser._id });

    const safeUser = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    res.status(201).json({
      message: "Registration completed",
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.params;
  try {
    await User.findOneAndDelete({ email: email });
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });

    const resetToken = Math.random().toString(36).substring(2);
    user.resetToken = resetToken;
    await user.save();
    const resetUrl = `https://trip-planner-rust-gamma.vercel.app/reset-password/${resetToken}`;
    res.status(200).json({ success: true, resetUrl });
  } catch (error) {
    return res.status(500).json({ success: false, message: "USER NOT FOUND" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;
    if (!resetToken || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }
    const user = await User.findOne({ resetToken });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Token not valid" });
    user.password = password;
    user.resetToken = undefined;
    await user.save();
    res.status(200).json({ success: true, message: "Password changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export {
  getUsers,
  getUserByEmail,
  register,
  login,
  refToken,
  logout,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
};
