import express from "express";

import {
  getUsers,
  register,
  login,
  refToken,
  logout,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);

router.post("/register", register);

router.post("/login", login);

router.post("/token", refToken);

router.post("/logout", logout);
export default router;
