import crypto from "crypto";
import { cookies } from "next/headers";

const pw = () => process.env.ADMIN_PASSWORD || "admin123";
const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
export const token = () => crypto.createHmac("sha256", pw()).update("ssks-admin").digest("hex");
export const checkPassword = (p) => same(p, pw());
export function isAdmin() {
  const v = cookies().get("ssks_admin")?.value;
  return !!v && same(v, token());
}