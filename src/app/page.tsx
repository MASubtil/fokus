export default function Home() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Bem-vindo ao Fokus</h1>
      <p className="text-zinc-400">
        Regista conteúdos que ajudam o foco e cronometra as tuas sessões.
      </p>
      <ul className="list-disc pl-6 text-zinc-300">
        <li>Adicionar itens (título, URL, tags)</li>
        <li>Listar e filtrar a biblioteca</li>
        <li>Iniciar e gravar sessões de foco</li>
      </ul>
    </section>
  );
}
