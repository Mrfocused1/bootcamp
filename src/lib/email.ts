import { Resend } from "resend";
import { IS_MOCK } from "@/lib/mock";
import { getServerEnv } from "@/lib/env.server";

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
  mocked?: boolean;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (IS_MOCK) return { ok: true, mocked: true };

  try {
    const env = getServerEnv();
    const resend = new Resend(env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM,
      to: input.to,
      subject: input.subject,
      text: input.text,
      replyTo: input.replyTo ?? env.RESEND_FROM,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
