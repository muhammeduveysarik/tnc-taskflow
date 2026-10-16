import { useState, useEffect } from "react";
import { Plus, CheckCircle2, ListTodo, Trash2, Pencil } from "lucide-react";

export default function App() {
  const [gorevler, setGorevler] = useState(() => {
    try {
      const kayit = localStorage.getItem("taskflow_gorevler");
      return kayit ? JSON.parse(kayit) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("taskflow_gorevler", JSON.stringify(gorevler));
  }, [gorevler]);
  const [yeniGorev, setYeniGorev] = useState("");
  const [formAcik, setFormAcik] = useState(false);
  const [arama, setArama] = useState("");

  function gorevEkle(e) {
    e.preventDefault();
    if (!yeniGorev.trim()) return;

    setGorevler([
      ...gorevler,
      { id: crypto.randomUUID(), baslik: yeniGorev.trim(), tamamlandi: false }
    ]);
    setYeniGorev("");
    setFormAcik(false);
  }

  function gorevTamamla(id) {
    setGorevler(gorevler.map(g =>
      g.id === id ? { ...g, tamamlandi: !g.tamamlandi } : g
    ));
  }

  function gorevDuzenle(id) {
    const gorev = gorevler.find(g => g.id === id);
    if (!gorev) return;

    const yeniBaslik = window.prompt("Yeni g?rev ad?n? yaz:", gorev.baslik);
    if (yeniBaslik === null || !yeniBaslik.trim()) return;

    setGorevler(gorevler.map(g =>
      g.id === id ? { ...g, baslik: yeniBaslik.trim() } : g
    ));
  }

  function gorevSil(id) {
    setGorevler(gorevler.filter(g => g.id !== id));
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold">
            Task<span className="text-cyan-400">Flow</span>
          </h1>
          <span className="text-zinc-400">TNC Group Projesi</span>
        </header>

        <h2 className="text-4xl font-bold mb-3">Görevlerini yönet.</h2>
        <p className="text-zinc-400 mb-8">Planla, takip et ve tamamla.</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-2xl p-6">
            <ListTodo className="text-cyan-400 mb-4" />
            <p className="text-zinc-400">Toplam Görev</p>
            <p className="text-3xl font-bold">{gorevler.length}</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-6">
            <CheckCircle2 className="text-green-400 mb-4" />
            <p className="text-zinc-400">Tamamlanan</p>
            <p className="text-3xl font-bold">
              {gorevler.filter(g => g.tamamlandi).length}
            </p>
          </div>
        </div>

        <button
          onClick={() => setFormAcik(!formAcik)}
          className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 mb-6"
        >
          <Plus size={20} /> Yeni Görev
        </button>

        {formAcik && (
          <form onSubmit={gorevEkle} className="flex gap-3 mb-6">
            <input
              value={yeniGorev}
              onChange={e => setYeniGorev(e.target.value)}
              placeholder="Görev adını yaz..."
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
            />
            <button className="bg-cyan-400 text-black px-6 rounded-xl font-bold">
              Ekle
            </button>
          </form>
        )}

        <input
          type="search"
          value={arama}
          onChange={e => setArama(e.target.value)}
          placeholder="Görevlerde ara..."
          aria-label="Görevlerde ara"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 mb-5 outline-none focus:border-cyan-400"
        />

        <div className="space-y-3">
          {gorevler.filter(g => g.baslik.toLocaleLowerCase("tr-TR").includes(arama.toLocaleLowerCase("tr-TR"))).map(gorev => (
            <div
              key={gorev.id}
              className="bg-zinc-900 rounded-xl p-5 flex items-center justify-between gap-4"
            >
              <button
                onClick={() => gorevTamamla(gorev.id)}
                className={`text-left flex-1 ${
                  gorev.tamamlandi ? "line-through text-zinc-500" : ""
                }`}
              >
                {gorev.tamamlandi ? "✓ " : "○ "}
                {gorev.baslik}
              </button>

              <button
                onClick={() => gorevDuzenle(gorev.id)}
                aria-label="G?revi d?zenle"
                className="text-cyan-400 hover:text-cyan-300"
              >
                <Pencil size={20} />
              </button>

              <button
                onClick={() => gorevSil(gorev.id)}
                aria-label="Görevi sil"
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


