import jwt from "jsonwebtoken";

const SECRET = process.env["SESSION_SECRET"] ?? "dev-secret-change-me";
const EXPIRES_IN = "7d";

export interface JwtPayload {
  sub: string;
  email: string;
  role: "user" | "admin";
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}
