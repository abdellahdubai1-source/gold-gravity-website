"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(
  locale: string,
  values: { email: string; password: string }
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });
  if (error) {
    return { success: false, error: "Invalid email or password." };
  }
  return { success: true };
}

export async function signOut(locale: string) {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}/admin/login`);
}
