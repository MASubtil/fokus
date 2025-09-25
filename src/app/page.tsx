"use client";
import { useEffect, useState, FormEvent } from "react";

type Item = { id: number; name: string; createdAt: string };

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const r = await fetch("/api/items", { cache: "no-store" });
    setItems(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError("Escreve um nome");
    setLoading(true); setError(null);
    const r = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    if (!r.ok) setError((await r.json()).error || "Erro");
    else { setName(""); await load(); }
    setLoading(false);
  }

  return (
    <main className="min-h-dvh max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Itens</h1>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Novo item…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "A gravar…" : "Adicionar"}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}

      <ul className="divide-y">
        {items.map(it => (
          <li key={it.id} className="py-2 flex justify-between">
            <span>{it.name}</span>
            <span className="text-xs text-gray-500">
              {new Date(it.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-gray-500">Sem itens ainda.</li>}
      </ul>
    </main>
  );
}
