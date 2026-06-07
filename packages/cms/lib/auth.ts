import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.CMS_JWT_SECRET || "rizhi-cms-secret-change-me"
);
const COOKIE_NAME = "rizhi-cms-token";

export async function createToken(password: string): Promise<string | null> {
  const expected = process.env.CMS_PASSWORD;
  if (!expected || password !== expected) return null;

  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export function cookieName(): string {
  return COOKIE_NAME;
}
