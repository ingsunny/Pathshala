import jwt from "jsonwebtoken";

export const SESSION_COOKIE = "pathshala_session";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

export function createSessionToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
}

export function readSession(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function safeUser(user) {
  const data = user?.toObject ? user.toObject() : { ...user };
  delete data.password;
  return data;
}
