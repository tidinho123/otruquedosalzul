import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { Sparkles, Clock, Users, ShoppingBag } from "lucide-react";

const OFFER_DURATION_MS = 10 * 60 * 1000;
const REVEAL_DELAY_MS = 6 * 60 * 1000;
const CHECKOUT_URL = "https://pay.kursinha.com/c/6a242b9ce4492a7f37ba9430";

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

function useOfferReveal(triggerReveal: boolean) {
  const [revealed, setRevealed] = useState(false);
  const [revealAt, setRevealAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (triggerReveal && !revealed) {
      setRevealed(true);
      setRevealAt(Date.now());
    }
  }, [triggerReveal, revealed]);

  useEffect(() => {
    if (!revealed) return;
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [revealed]);

  const remaining = revealAt ? Math.max(0, OFFER_DURATION_MS - (now - revealAt)) : OFFER_DURATION_MS;
  return { revealed, remaining };
}

function formatMMSS(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function OfferBlock({ remaining }: { remaining: number }) {
  const expired = remaining <= 0;
  return (
    <div className="fade-in-up mt-2 flex flex-col items-center gap-4 w-full">
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm md:text-base text-slate-400 line-through">De 9.000 Kz</span>
        <span className="text-3xl md:text-5xl font-extrabold text-white glow-text">
          Hoje por <span className="text-[#3ab9ff]">5.000 Kz</span>
        </span>
      </div>

      <div className="inline-flex items-center gap-2 rounded-xl border border-[#3ab9ff]/40 bg-[#0a0f1f]/80 backdrop-blur px-4 py-2 text-sm md:text-base">
        <Clock className="size-4 text-[#3ab9ff]" />
        <span className="text-slate-300">Esta oferta expira em</span>
        <span className="font-mono font-bold text-[#3ab9ff] tabular-nums tracking-wider text-lg">
          {formatMMSS(remaining)}
        </span>
      </div>

      <a
        href={expired ? "#" : CHECKOUT_URL}
        aria-disabled={expired}
        className={`btn-cta inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#3ab9ff] to-[#0077ff] text-white font-extrabold tracking-wide transition-transform hover:scale-[1.03] shadow-[0_10px_40px_rgba(58,185,255,0.45)] px-10 py-5 text-lg md:text-xl ${
          expired ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <Sparkles className="size-5" />
        {expired ? "OFERTA ENCERRADA" : "QUERO ACESSO AGORA"}
      </a>
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
  const [videoEnded, setVideoEnded] = useState(false);
  const { revealed, remaining } = useOfferReveal(videoEnded);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const viewers = useLiveViewers();
  const notif = useSalesNotifications();

  useEffect(() => {
    if (!iframeRef.current) return;
    const player = new Player(iframeRef.current);
    const onEnded = () => setVideoEnded(true);
    const onTime = (data: { seconds: number; duration: number }) => {
      if (data.duration > 0 && data.seconds >= data.duration - 10) {
        setVideoEnded(true);
      }
    };
    player.on("ended", onEnded);
    player.on("timeupdate", onTime);
    return () => {
      player.off("ended", onEnded);
      player.off("timeupdate", onTime);
    };
  }, []);

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
              <div className="relative w-full" style={{ paddingBottom: "196.3%" }}>
                <iframe
                  ref={iframeRef}
                  src="https://player.vimeo.com/video/1197000161?title=0&byline=0&portrait=0&badge=0&autopause=0&loop=1"
                  frameBorder={0}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  title="VSL"
                />
              </div>
            </div>
          </div>

          {revealed && (
            <div className="mt-10 flex justify-center">
              <OfferBlock remaining={remaining} />
            </div>
          )}
        </div>

        <SalesToast notif={notif} />
      </section>
    </div>
  );
}
