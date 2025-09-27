"use client";

import { useEffect, useMemo, useState } from "react";

type Item = { id: number; name: string; createdAt: string };

export default function LibraryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState<string>("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/items", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar itens");
        const data: Item[] = await res.json();
        if (!cancelled) setItems(data);
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

  const startEdit = (item: Item) => {
    setEditingId(item.id);
    setDraftName(item.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftName("");
  };

  const saveEdit = async (id: number) => {
    if (!draftName.trim()) return;
    try {
      setSavingId(id);
      const res = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: draftName.trim() }),
      });
      if (!res.ok) throw new Error("Falha ao guardar");
      const updated: Item = await res.json();
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
      setEditingId(null);
      setDraftName("");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSavingId(null);
    }
  };

  const deleteItem = async (id: number) => {
    const previous = items;
    try {
      setDeletingId(id);
      // Optimistic removal
      setItems((prev) => prev.filter((it) => it.id !== id));
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao apagar");
    } catch (e) {
      // rollback
      setItems(previous);
      alert((e as Error).message);
    } finally {
      setDeletingId(null);
      if (editingId === id) cancelEdit();
    }
  };

  const empty = useMemo(() => !loading && items.length === 0, [loading, items]);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Biblioteca</h1>
      {loading ? (
        <p className="text-zinc-400">A carregar…</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : empty ? (
        <p className="text-zinc-400">
          Sem itens. Vai a <a className="underline" href="/add">/add</a>.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-800">
          {items.map((it) => {
            const isEditing = editingId === it.id;
            const isSaving = savingId === it.id;
            const isDeleting = deletingId === it.id;
            return (
              <li key={it.id} className="py-3 flex items-center gap-3 justify-between">
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      className="w-full bg-transparent border border-zinc-700 rounded px-2 py-1 outline-none focus:border-zinc-500"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(it.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      disabled={isSaving}
                      autoFocus
                    />
                  ) : (
                    <span className="truncate">{it.name}</span>
                  )}
                  <span className="block text-xs text-zinc-500">
                    {new Date(it.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        className="px-2 py-1 text-sm rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50"
                        onClick={() => saveEdit(it.id)}
                        disabled={isSaving}
                      >
                        Guardar
                      </button>
                      <button
                        className="px-2 py-1 text-sm rounded border border-zinc-700 hover:bg-zinc-900"
                        onClick={cancelEdit}
                        disabled={isSaving}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-2 py-1 text-sm rounded bg-zinc-800 hover:bg-zinc-700"
                        onClick={() => startEdit(it)}
                        disabled={isDeleting}
                      >
                        Editar
                      </button>
                      <button
                        className="px-2 py-1 text-sm rounded border border-red-700 text-red-300 hover:bg-red-950 disabled:opacity-50"
                        onClick={() => deleteItem(it.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "A apagar…" : "Apagar"}
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
