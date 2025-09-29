"use client";
import { useState, FormEvent } from "react";

export default function AddPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setErr("Escreve um nome");
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const r = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Erro");
      setName("");
      setMsg("Item adicionado ✅");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Adicionar item</h1>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 bg-transparent"
          placeholder="Novo item…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "A gravar..." : "Adicionar"}
        </button>
      </form>

      {msg && <p className="text-green-500">{msg}</p>}
      {err && <p className="text-red-500">{err}</p>}
      <p className="text-sm text-zinc-400">
        Dica: vê a lista em <a className="underline" href="/library">/library</a> (vamos criar já a seguir).
      </p>
    </section>
  );
}
