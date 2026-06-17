"use server";
import { redirect } from "next/navigation";
import { IS_MOCK } from "@/lib/mock";

export async function signOut(): Promise<void> {
  if (!IS_MOCK) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
