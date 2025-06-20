import express from "express";

import {
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
  getUserByCalendar,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/email/:email", getUserByEmail);

router.post("/register", register);

router.post("/login", login);

router.post("/token", refToken);

router.post("/logout", logout);

router.put("/:email", updateUser);

router.delete("/:email", deleteUser);

router.post("/forgotPassword", forgotPassword);

router.post("/resetPassword", resetPassword);

router.get("/calendar/:calendarCode", getUserByCalendar);
export default router;
