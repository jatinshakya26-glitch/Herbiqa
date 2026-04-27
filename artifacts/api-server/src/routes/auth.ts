import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { signToken } from "../lib/jwt";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

const COOKIE_NAME = "herbiqa_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function setAuthCookie(res: import("express").Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

router.post("/auth/signup", async (req, res): Promise<void> => {
  const { email, password, name } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string" ||
    !email.includes("@") ||
    password.length < 6 ||
    name.trim().length === 0
  ) {
    res.status(400).json({
      error:
        "Provide a valid email, a name, and a password of at least 6 characters.",
    });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    res.status(409).json({ error: "An account with this email already exists." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: normalizedEmail,
    passwordHash,
    name: name.trim(),
    role: "user",
  });

  const token = signToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  setAuthCookie(res, token);

  res.status(201).json({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = signToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  setAuthCookie(res, token);

  res.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const user = await User.findById(req.user!.sub);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  res.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

export default router;
