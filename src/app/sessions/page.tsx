"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Session = {
  id: number;
  startedAt: string;
  duration: number; // seconds
  note?: string | null;
};

export default function SessionsPage() {
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0); // seconds
  const tickRef = useRef<number | null>(null);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/sessions", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar sessões");
        const data: Session[] = await res.json();
        if (!cancelled) setSessions(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    if (startTime == null) return;
    const tick = () => {
      const now = Date.now();
      const seconds = Math.max(0, Math.floor((now - startTime) / 1000));
      setElapsed(seconds);
      tickRef.current = requestAnimationFrame(tick);
    };
    tickRef.current = requestAnimationFrame(tick);
    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
    };
  }, [running, startTime]);

  const formatted = useMemo(() => formatDuration(elapsed), [elapsed]);

  const start = () => {
    setStartTime(Date.now());
    setElapsed(0);
    setRunning(true);
  };

  const stopAndSave = async () => {
    if (!running || startTime == null) return;
    const duration = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    try {
      setSaving(true);
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration, note: note.trim() || undefined }),
      });
      if (!res.ok) throw new Error("Falha ao guardar sessão");
      const created: Session = await res.json();
      setSessions((prev) => [created, ...prev]);
      setNote("");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
      setRunning(false);
      setStartTime(null);
      setElapsed(0);
    }
  };

  const deleteSession = async (id: number) => {
    const previous = sessions;
    try {
      setDeletingId(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao apagar sessão");
    } catch (e) {
      setSessions(previous);
      alert((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Sessões</h1>

      <div className="p-4 rounded border border-zinc-800 bg-zinc-950/40">
        <div className="text-4xl font-mono tabular-nums text-center mb-3">{formatted}</div>
        <div className="flex items-center gap-2 justify-center">
          {!running ? (
            <button
              className="px-3 py-2 rounded bg-green-700 hover:bg-green-600"
              onClick={start}
            >
              Iniciar
            </button>
          ) : (
            <button
              className="px-3 py-2 rounded bg-red-700 hover:bg-red-600 disabled:opacity-50"
              onClick={stopAndSave}
              disabled={saving}
            >
              Parar & Guardar
            </button>
          )}
          <input
            className="flex-1 min-w-0 bg-transparent border border-zinc-700 rounded px-2 py-2 outline-none focus:border-zinc-500"
            placeholder="Nota opcional"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-zinc-400">A carregar…</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : sessions.length === 0 ? (
        <p className="text-zinc-400">Sem sessões ainda.</p>
      ) : (
        <ul className="divide-y divide-zinc-800">
          {sessions.map((s) => (
            <li key={s.id} className="py-3 flex items-center gap-3 justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium">
                  {formatDuration(s.duration)}
                </div>
                <div className="text-xs text-zinc-500">
                  {new Date(s.startedAt).toLocaleString()}
                  {s.note ? ` · ${s.note}` : ""}
                </div>
              </div>
              <button
                className="px-2 py-1 text-sm rounded border border-red-700 text-red-300 hover:bg-red-950 disabled:opacity-50"
                onClick={() => deleteSession(s.id)}
                disabled={deletingId === s.id}
              >
                {deletingId === s.id ? "A apagar…" : "Apagar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [hours, minutes, seconds].map((n) => String(n).padStart(2, "0"));
  return `${parts[0]}:${parts[1]}:${parts[2]}`;
}


