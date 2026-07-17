import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, ShoppingBag } from "lucide-react";

const ANGOLA_NAMES = [
  "João M.", "Domingos K.", "Pedro A.", "Mateus L.", "Augusto F.",
  "Adilson C.", "Nelson B.", "Edmilson P.", "Carlos N.", "Hélder S.",
  "Edmar T.", "Bruno V.", "Eduardo R.", "Manuel D.", "Osvaldo J.",
  "Anderson M.", "Wilson G.", "Yuri C.", "Kelson A.", "Mário T.",
];
const ANGOLA_CITIES = [
  "Luanda", "Benguela", "Huambo", "Lobito", "Lubango",
  "Cabinda", "Malanje", "Namibe", "Soyo", "Uíge",
];

type Notif = { id: number; name: string; city: string };

function useLiveViewers() {
  const [count, setCount] = useState(586);
  useEffect(() => {
    const i = setInterval(() => {
      setCount((c) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const next = c + delta;
        return Math.max(540, Math.min(640, next));
      });
    }, 4000);
    return () => clearInterval(i);
  }, []);
  return count;
}

function useSalesNotifications() {
  const [notif, setNotif] = useState<Notif | null>(null);
  useEffect(() => {
    let idCounter = 0;
    const trigger = () => {
      idCounter += 1;
      setNotif({
        id: idCounter,
        name: ANGOLA_NAMES[Math.floor(Math.random() * ANGOLA_NAMES.length)],
        city: ANGOLA_CITIES[Math.floor(Math.random() * ANGOLA_CITIES.length)],
      });
    };
    const i = setInterval(trigger, 40000);
    const t = setTimeout(trigger, 2500);
    return () => {
      clearInterval(i);
      clearTimeout(t);
    };
  }, []);
  return notif;
}

function LiveViewersBar({ count }: { count: number }) {
  return (
    <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-[#1a0508]/80 backdrop-blur px-4 py-2.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
      </span>
      <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-red-400">Ao vivo</span>
      <Users className="size-4 text-slate-300 ml-1" />
      <span className="text-sm md:text-base font-bold text-white tabular-nums">{count}</span>
      <span className="text-xs md:text-sm text-slate-300">pessoas assistindo agora</span>
    </div>
  );
}

function SalesToast({ notif }: { notif: Notif | null }) {
  if (!notif) return null;
  return (
    <div
      key={notif.id}
      className="notif-anim fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm"
    >
      <div className="flex items-center gap-3 rounded-xl border border-[#3ab9ff]/40 bg-[#070b16]/95 backdrop-blur px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3ab9ff] to-[#0077ff]">
          <ShoppingBag className="size-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {notif.name} de {notif.city} 🇦🇴
          </p>
          <p className="text-xs text-slate-400">acabou de adquirir agora mesmo</p>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold uppercase">✓ Pago</span>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "O Truque do Sal Azul" },
      { name: "description", content: "Assiste ao vídeo até ao fim." },
    ],
  }),
});

function Index() {
  const viewers = useLiveViewers();
  const notif = useSalesNotifications();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04060d] text-slate-100">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="absolute inset-0 radial-glow" aria-hidden />

        <div className="relative z-10 max-w-3xl mx-auto px-5 pt-6 pb-20 md:pt-10 md:pb-28">
          <LiveViewersBar count={viewers} />

          <div className="relative mx-auto rounded-2xl border-neon p-2 md:p-3 bg-[#070b16]">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#0077ff]/40 via-[#3ab9ff]/30 to-[#0077ff]/40 blur-xl -z-10" aria-hidden />
            <div className="relative w-full overflow-hidden rounded-xl bg-black">
              <div
                id="ifr_6a5975e72f1742aeb47bda4a_wrapper"
                style={{ margin: "0 auto", width: "100%", maxWidth: 400 }}
                dangerouslySetInnerHTML={{
                  __html: `<div style="position: relative; padding: 196.2962962962963% 0 0 0;" id="ifr_6a5975e72f1742aeb47bda4a_aspect"><iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_6a5975e72f1742aeb47bda4a" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" referrerpolicy="origin" onload="this.onload=null, this.src='https://scripts.converteai.net/dc9cda6f-deb3-40d3-9c45-9f5c791bcef7/players/6a5975e72f1742aeb47bda4a/v4/embed.html'+(location.search||'?')+'&vl='+encodeURIComponent(location.href)"></iframe></div>`,
                }}
              />
            </div>
          </div>
        </div>

        <SalesToast notif={notif} />
      </section>
    </div>
  );
}
