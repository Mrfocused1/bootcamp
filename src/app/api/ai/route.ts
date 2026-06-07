import { z } from "zod";
import { IS_MOCK, MOCK_LESSONS } from "@/lib/mock";

const BodySchema = z.object({
  lessonId: z.string().nullable(),
  message: z.string().min(1, "Message cannot be empty"),
});

/** Canned helpful answers by lesson topic for mock mode. */
function mockReply(lessonId: string | null, message: string): string {
  const lesson = lessonId ? MOCK_LESSONS.find((l) => l.id === lessonId) : null;
  const topic = lesson ? lesson.topics[0] ?? lesson.title : "this course";

  // Acknowledge what was asked and provide a 2-sentence helpful canned answer.
  const _ = message; // referenced to avoid lint unused-var
  return (
    `Great question about ${topic}! ` +
    `In live mode I'd connect to the AI assistant here to give you a personalised answer. ` +
    `For now: focus on the key concepts covered in this lesson and try applying them hands-on — ` +
    `that's the fastest way to make them stick.`
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { lessonId, message } = parsed.data;

  if (IS_MOCK) {
    const reply = mockReply(lessonId, message);
    return Response.json({ reply }, { status: 200 });
  }

  // Real mode stub — wire up server-side AI call here.
  // TODO: confirm model id via claude-api skill
  //
  // Steps for real implementation:
  // 1. Rate-limit per user (e.g. check a redis counter or DB row).
  // 2. Build a scoped system prompt + lesson context from the DB.
  // 3. Call the Anthropic API server-side (key from process.env.ANTHROPIC_API_KEY).
  //    Example:
  //      import Anthropic from "@anthropic-ai/sdk";
  //      const client = new Anthropic();
  //      const msg = await client.messages.create({
  //        model: "<confirmed-model-id>",   // TODO: confirm via claude-api skill
  //        max_tokens: 1024,
  //        system: systemPrompt,
  //        messages: [{ role: "user", content: message }],
  //      });
  //      const reply = msg.content[0].type === "text" ? msg.content[0].text : "";
  // 4. Persist the exchange to ai_messages for the current user.

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Placeholder until real AI integration is configured.
  const reply = "AI assistant is not yet configured for this environment.";

  await supabase.from("ai_messages").insert([
    { user_id: user.id, lesson_id: lessonId, role: "user", content: message },
    { user_id: user.id, lesson_id: lessonId, role: "assistant", content: reply },
  ]);

  return Response.json({ reply }, { status: 200 });
}
