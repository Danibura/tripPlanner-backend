import express from "express";

import {
  getUsers,
  getUserByEmail,
  register,
  login,
  refToken,
  logout,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/email/:email", getUserByEmail);

router.post("/register", register);

router.post("/login", login);

router.post("/token", refToken);

router.post("/logout", logout);
export default router;
