"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteArticle, setArticleStatus } from "@/lib/articles";
import { deleteGuide, setGuideStatus } from "@/lib/guides";
import { deleteHack, setHackStatus } from "@/lib/hacks";
import { deleteTipp, setTippStatus } from "@/lib/tipps";
import { ADMIN_COOKIE, isAdminAuthenticated, sessionToken } from "@/lib/admin-auth";

export async function login(formData: FormData) {
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (
    !adminPassword ||
    typeof password !== "string" ||
    password !== adminPassword
  ) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, sessionToken(adminPassword), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin/news");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

async function requireAuth() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function approveArticle(slug: string) {
  await requireAuth();
  await setArticleStatus(slug, "published");
  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
  revalidatePath("/admin/news");
}

export async function rejectArticle(slug: string) {
  await requireAuth();
  await deleteArticle(slug);
  revalidatePath("/admin/news");
}

export async function approveGuide(slug: string) {
  await requireAuth();
  await setGuideStatus(slug, "published");
  revalidatePath("/missionsanleitungen");
  revalidatePath(`/missionsanleitungen/${slug}`);
  revalidatePath("/admin/missionsanleitungen");
}

export async function rejectGuide(slug: string) {
  await requireAuth();
  await deleteGuide(slug);
  revalidatePath("/admin/missionsanleitungen");
}

export async function approveHack(slug: string) {
  await requireAuth();
  await setHackStatus(slug, "published");
  revalidatePath("/hacks-und-tricks");
  revalidatePath(`/hacks-und-tricks/${slug}`);
  revalidatePath("/admin/hacks-und-tricks");
}

export async function rejectHack(slug: string) {
  await requireAuth();
  await deleteHack(slug);
  revalidatePath("/admin/hacks-und-tricks");
}

export async function approveTipp(slug: string) {
  await requireAuth();
  await setTippStatus(slug, "published");
  revalidatePath("/tipps");
  revalidatePath(`/tipps/${slug}`);
  revalidatePath("/admin/tipps");
}

export async function rejectTipp(slug: string) {
  await requireAuth();
  await deleteTipp(slug);
  revalidatePath("/admin/tipps");
}
