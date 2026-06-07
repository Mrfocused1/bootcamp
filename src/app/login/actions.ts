"use server";

import { redirect } from "next/navigation";
import { IS_MOCK } from "@/lib/mock";

export async function signIn(formData: FormData): Promise<never> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";

  // Basic validation: non-empty and contains "@"
  if (!email || !email.includes("@")) {
    redirect("/login?error=1");
  }

  if (IS_MOCK) {
    redirect("/");
  }

  // Real path: send magic link via Supabase
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  redirect("/login?sent=1");
}
