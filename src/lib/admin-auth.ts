import { createHash } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ll_admin";

export function sessionToken(password: string) {
  return createHash("sha256").update(`leonida-living-admin:${password}`).digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;
  return value === sessionToken(password);
}
