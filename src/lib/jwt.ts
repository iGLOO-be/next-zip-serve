import { SignJWT, jwtVerify } from "jose";

const alg = "HS256";
const secret = process.env.JWT_SECRET;

if (!secret) console.warn("JWT_SECRET is not set. JWTs will not be verified.");

type PayloadType = { value: string };

export async function verifyString(jwt: string): Promise<string> {
  if (!secret) return jwt;
  const { payload } = await jwtVerify<PayloadType>(
    jwt,
    new TextEncoder().encode(secret)
  );
  return payload.value;
}

export async function encryptString(value: string): Promise<string> {
  if (!secret) return value;
  const payload: PayloadType = { value };
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(secret));
}
