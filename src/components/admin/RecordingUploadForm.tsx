"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createRecordingUploadUrl, confirmRecording } from "@/app/(app)/admin/actions";

type Cohort = { id: string; name: string };

function readDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    try {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => {
        URL.revokeObjectURL(v.src);
        resolve(Number.isFinite(v.duration) ? v.duration : 0);
      };
      v.onerror = () => resolve(0);
      v.src = URL.createObjectURL(file);
    } catch {
      resolve(0);
    }
  });
}

function putWithProgress(url: string, file: File, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)));
    xhr.onerror = () => reject(new Error("Upload failed (network/CORS). Check the bucket CORS rules."));
    xhr.send(file);
  });
}

export function RecordingUploadForm({ cohorts }: { cohorts: Cohort[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [cohortId, setCohortId] = useState(cohorts[0]?.id ?? "");
  const [dayIndex, setDayIndex] = useState(1);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!cohortId || !title.trim() || !file) {
      setMsg({ kind: "err", text: "Pick a cohort, a title and a video file." });
      return;
    }
    setBusy(true);
    setMsg(null);
    setPct(0);
    try {
      const duration = await readDuration(file);
      const presign = await createRecordingUploadUrl({
        cohortId,
        dayIndex,
        fileName: file.name,
        contentType: file.type || "video/mp4",
      });
      if (!presign.ok || !presign.key) throw new Error(presign.error ?? "Could not start upload.");

      if (!presign.mock && presign.uploadUrl) {
        await putWithProgress(presign.uploadUrl, file, setPct);
      } else {
        setPct(100); // mock mode: skip the real upload
      }

      const saved = await confirmRecording({
        cohortId,
        dayIndex,
        title: title.trim(),
        key: presign.key,
        durationSeconds: duration,
      });
      if (!saved.ok) throw new Error(saved.error ?? "Could not save the recording.");

      setMsg({ kind: "ok", text: "Recording uploaded ✓" });
      setTitle("");
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch (err) {
      setMsg({ kind: "err", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  const field = "rounded-xl border-2 border-ua-ink/15 bg-white px-3 py-2 text-sm text-ua-ink outline-none focus:border-ua-blue";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)]"
    >
      <h2 className="text-xl font-black text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
        Upload a recording
      </h2>
      <p className="mt-1 text-sm text-ua-ink/60">
        Pick the cohort and day, give it a title, and drop in the Zoom <span className="font-mono">.mp4</span>.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-ua-ink/50">Cohort</span>
          <select value={cohortId} onChange={(e) => setCohortId(e.target.value)} className={field}>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-ua-ink/50">Day</span>
          <select value={dayIndex} onChange={(e) => setDayIndex(Number(e.target.value))} className={field}>
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>Day {d}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-xs font-bold uppercase tracking-widest text-ua-ink/50">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Day 1 — live session replay"
            className={field}
          />
        </label>
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-xs font-bold uppercase tracking-widest text-ua-ink/50">Video file</span>
          <input ref={fileRef} type="file" accept="video/*" className={`${field} file:mr-3 file:rounded-md file:border-0 file:bg-ua-ink file:px-3 file:py-1 file:text-ua-bg`} />
        </label>
      </div>

      {busy && (
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-ua-ink/10">
            <div className="h-full rounded-full bg-ua-blue transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-ua-ink/60">{pct < 100 ? `Uploading… ${pct}%` : "Finishing…"}</p>
        </div>
      )}

      {msg && (
        <p className={`mt-4 rounded-xl px-4 py-2 text-sm font-medium ${msg.kind === "ok" ? "bg-ua-green text-ua-ink" : "bg-ua-pink text-ua-ink"}`}>
          {msg.text}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-5 inline-flex items-center rounded-full bg-ua-ink px-6 py-2.5 text-sm font-bold text-ua-bg transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        style={{ fontFamily: "var(--font-epilogue)" }}
      >
        {busy ? "Uploading…" : "Upload recording →"}
      </button>
    </form>
  );
}
