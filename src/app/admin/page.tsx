import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const instant = false;

export default async function AdminIndexPage() {
  redirect((await isAdminAuthenticated()) ? "/admin/news" : "/admin/login");
}
