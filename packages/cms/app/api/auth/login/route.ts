import { NextResponse } from "next/server";
import { createToken, cookieName } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  const token = await createToken(password);

  if (!token) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
