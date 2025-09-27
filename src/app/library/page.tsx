type Item = { id: number; name: string; createdAt: string };

export default async function LibraryPage() {
  const res = await fetch("http://localhost:3000/api/items", { cache: "no-store" });
  const items: Item[] = await res.json();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Biblioteca</h1>
      {items.length === 0 ? (
        <p className="text-zinc-400">
          Sem itens. Vai a <a className="underline" href="/add">/add</a>.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-800">
          {items.map((it) => (
            <li key={it.id} className="py-3 flex items-center justify-between">
              <span>{it.name}</span>
              <span className="text-xs text-zinc-500">
                {new Date(it.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

