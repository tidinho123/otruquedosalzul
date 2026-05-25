import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  Flame,
  Leaf,
  HeartPulse,
  TrendingUp,
  CheckCircle2,
  Star,
  Lock,
  Zap,
  Clock,
} from "lucide-react";

const REVEAL_DELAY_MS = 6 * 60 * 1000; // 6 min
const OFFER_DURATION_MS = 10 * 60 * 1000; // 10 min

function useOfferReveal() {
  const [revealed, setRevealed] = useState(false);
  const [revealAt, setRevealAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setTimeout(() => {
      setRevealed(true);
      setRevealAt(Date.now());
    }, REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

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

function OfferBlock({ remaining, size = "lg" }: { remaining: number; size?: "lg" | "md" }) {
  const expired = remaining <= 0;
  return (
    <div className="fade-in-up mt-2 flex flex-col items-center gap-4 w-full">
      <div className="flex items-baseline gap-3">
        <span className="text-sm md:text-base text-slate-400 line-through">de 9.000 Kz</span>
        <span className="text-3xl md:text-4xl font-extrabold text-white glow-text">
          por <span className="text-[#3ab9ff]">4.989 Kz</span>
        </span>
      </div>

      <div className="inline-flex items-center gap-2 rounded-xl border border-[#3ab9ff]/40 bg-[#0a0f1f]/80 backdrop-blur px-4 py-2 text-sm md:text-base">
        <Clock className="size-4 text-[#3ab9ff]" />
        <span className="text-slate-300">A oferta termina em</span>
        <span className="font-mono font-bold text-[#3ab9ff] tabular-nums tracking-wider text-lg">
          {formatMMSS(remaining)}
        </span>
      </div>

      <a
        href={expired ? "#" : CHECKOUT_URL}
        aria-disabled={expired}
        className={`btn-cta inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#3ab9ff] to-[#0077ff] text-white font-extrabold tracking-wide transition-transform hover:scale-[1.03] ${
          size === "lg" ? "px-10 py-5 text-lg md:text-xl" : "px-8 py-4 text-base md:text-lg"
        } ${expired ? "opacity-60 pointer-events-none" : ""}`}
      >
        <Sparkles className="size-5" />
        {expired ? "OFERTA ENCERRADA" : "QUERO ACESSAR AGORA"}
      </a>
      {!expired && (
        <p className="text-xs text-slate-400">Acesso imediato • Pagamento seguro</p>
      )}
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "O Truque do Sal Azul — Receitas Naturais para Desempenho Masculino" },
      {
        name: "description",
        content:
          "Descubra o método natural com receitas, hábitos e estratégias para mais confiança, disposição e desenvolvimento masculino. Acesso imediato.",
      },
    ],
  }),
});

const CHECKOUT_URL = "#CHECKOUT";

const NOMES = [
  "João", "Carlos", "Mateus", "Pedro", "André", "Lucas", "Miguel",
  "Daniel", "Bruno", "Hélder", "Adilson", "Nelson", "Edmilson", "Kiala",
  "Mário", "Tiago", "Ricardo", "Eduardo", "Wilson",
];
const PROVINCIAS = [
  "Luanda", "Benguela", "Huambo", "Huíla", "Malanje",
  "Uíge", "Cabinda", "Kwanza Sul", "Bié", "Namibe",
];
const ACOES = [
  "acabou de adquirir em",
  "comprou há instantes em",
  "garantiu o acesso em",
  "fez o pedido em",
];

function Particles() {
  const items = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        dur: 10 + Math.random() * 18,
        delay: Math.random() * 12,
        opacity: 0.25 + Math.random() * 0.5,
      })),
    [],
  );
  return (
    <div className="particles" aria-hidden>
      {items.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

function LiveNotifications() {
  const [notif, setNotif] = useState<{ id: number; nome: string; acao: string; prov: string } | null>(
    null,
  );

  useEffect(() => {
    let id = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const show = () => {
      id += 1;
      const nome = NOMES[Math.floor(Math.random() * NOMES.length)];
      const prov = PROVINCIAS[Math.floor(Math.random() * PROVINCIAS.length)];
      const acao = ACOES[Math.floor(Math.random() * ACOES.length)];
      setNotif({ id, nome, acao, prov });
      timeout = setTimeout(() => {
        setNotif(null);
        timeout = setTimeout(show, 1800);
      }, 5000);
    };
    timeout = setTimeout(show, 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-50 pointer-events-none">
      {notif && (
        <div
          key={notif.id}
          className="notif-anim flex items-center gap-3 rounded-xl bg-[#0a0f1f]/95 backdrop-blur-md border border-[#1b2742] px-4 py-3 shadow-2xl max-w-[320px]"
          style={{ boxShadow: "0 10px 40px rgba(0,170,255,0.18)" }}
        >
          <div className="shrink-0 size-9 rounded-full bg-emerald-500/15 grid place-content-center">
            <CheckCircle2 className="size-5 text-emerald-400" />
          </div>
          <div className="text-sm leading-tight">
            <div className="font-semibold text-white">{notif.nome}</div>
            <div className="text-slate-300 text-xs">
              {notif.acao} <span className="text-[#3ab9ff]">{notif.prov}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const beneficios = [
  { icon: TrendingUp, title: "Mais Confiança", desc: "Postura, presença e segurança no dia a dia." },
  { icon: Flame, title: "Mais Disposição", desc: "Energia renovada do despertar até a noite." },
  { icon: Leaf, title: "Rotina Natural", desc: "Receitas simples com ingredientes acessíveis." },
  { icon: HeartPulse, title: "Melhor Autocuidado", desc: "Hábitos sustentáveis para o longo prazo." },
  { icon: Sparkles, title: "Desenvolvimento Pessoal", desc: "Disciplina, foco e bem-estar masculino." },
  { icon: ShieldCheck, title: "Método Discreto", desc: "100% digital, acessível em qualquer dispositivo." },
];

const depoimentos = [
  {
    nome: "Adilson M.",
    inicial: "A",
    cor: "from-sky-500 to-indigo-700",
    texto: "Em poucas semanas notei diferença na disposição. Vale cada centavo.",
  },
  {
    nome: "Hélder P.",
    inicial: "H",
    cor: "from-cyan-500 to-blue-700",
    texto: "Receitas simples, ingredientes que tenho em casa. Recomendo demais.",
  },
  {
    nome: "Nelson K.",
    inicial: "N",
    cor: "from-blue-500 to-violet-700",
    texto: "Conteúdo direto ao ponto. Senti mais confiança e foco no trabalho.",
  },
  {
    nome: "Edmilson S.",
    inicial: "E",
    cor: "from-sky-600 to-cyan-500",
    texto: "Achei que era mais uma promessa, mas o material é sério e funciona.",
  },
];

function Index() {
  const { revealed, remaining } = useOfferReveal();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04060d] text-slate-100">
      <LiveNotifications />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="absolute inset-0 radial-glow" aria-hidden />
        <Particles />

        <div className="relative z-10 max-w-6xl mx-auto px-5 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1b2742] bg-[#0a0f1f]/70 backdrop-blur px-4 py-1.5 text-xs md:text-sm text-slate-300 fade-in-up">
            <Zap className="size-3.5 text-[#3ab9ff]" />
            Método Natural • Acesso Digital Imediato
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] fade-in-up">
            Descubra o <span className="glow-text text-[#3ab9ff]">Método Natural</span> que Está
            Chamando Atenção Entre Homens que Querem
            <br className="hidden md:block" /> Mais Confiança e Desempenho
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-slate-300 fade-in-up">
            Aprenda receitas naturais, hábitos e estratégias que ajudam na{" "}
            <span className="text-white font-semibold">disposição</span>,{" "}
            <span className="text-white font-semibold">resistência</span> e{" "}
            <span className="text-white font-semibold">desenvolvimento masculino</span>.
          </p>

          {revealed && (
            <div className="mt-10 flex justify-center">
              <OfferBlock remaining={remaining} size="md" />
            </div>
          )}

          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5"><Lock className="size-3.5" /> Compra Segura</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> Entrega Imediata</span>
          </div>
        </div>


        {/* VSL */}
        <div className="relative z-10 max-w-3xl mx-auto px-5 pb-20 md:pb-28">
          <div className="relative mx-auto rounded-2xl border-neon p-2 md:p-3 bg-[#070b16]">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#0077ff]/40 via-[#3ab9ff]/30 to-[#0077ff]/40 blur-xl -z-10" aria-hidden />
            <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ aspectRatio: "4 / 3" }}>
              <iframe
                src="https://player.vimeo.com/video/1195416694?title=0&byline=0&portrait=0&badge=0&autopause=0&loop=1&muted=0"
                className="absolute inset-0 h-full w-full"
                frameBorder={0}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="O Truque do Sal Azul - VSL"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <a
              href={CHECKOUT_URL}
              className="btn-cta inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#3ab9ff] to-[#0077ff] px-10 py-5 text-lg md:text-xl font-extrabold tracking-wide text-white transition-transform hover:scale-[1.03]"
            >
              QUERO ACESSAR AGORA
            </a>
            <p className="text-xs text-slate-400">Acesso vitalício • Conteúdo 100% digital</p>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[#3ab9ff] font-semibold text-sm uppercase tracking-widest">Benefícios</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold">
              O que você desbloqueia com o método
            </h2>
            <p className="mt-4 text-slate-400">
              Um passo a passo prático para homens que querem evolução real.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beneficios.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-[#1b2742] bg-gradient-to-b from-[#0a0f1f] to-[#070b16] p-6 transition-all hover:border-[#3ab9ff]/60 hover:-translate-y-1"
              >
                <div className="size-12 rounded-xl bg-[#0e1a33] grid place-content-center border border-[#1b2742] group-hover:glow-neon transition-shadow">
                  <Icon className="size-6 text-[#3ab9ff]" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="relative py-20 md:py-28 bg-[#06080f]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[#3ab9ff]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-5 fill-[#3ab9ff] text-[#3ab9ff]" />
              ))}
              <span className="text-white font-semibold ml-2">4.9 / 5</span>
            </div>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold">
              O que homens reais estão dizendo
            </h2>
            <p className="mt-4 text-slate-400">Avaliações verificadas da comunidade.</p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {depoimentos.map((d) => (
              <div
                key={d.nome}
                className="rounded-2xl border border-[#1b2742] bg-[#0a0f1f] p-6 hover:border-[#3ab9ff]/60 transition-colors"
              >
                <div className="flex items-center gap-1 text-[#3ab9ff] mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-[#3ab9ff] text-[#3ab9ff]" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">"{d.texto}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div
                    className={`size-10 rounded-full bg-gradient-to-br ${d.cor} grid place-content-center font-bold text-white`}
                  >
                    {d.inicial}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{d.nome}</div>
                    <div className="text-xs text-slate-500">Cliente verificado</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="relative py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-5">
          <div className="relative rounded-3xl border-neon bg-gradient-to-b from-[#0a0f1f] to-[#070b16] p-8 md:p-12 text-center">
            <div className="mx-auto size-16 rounded-2xl bg-[#0e1a33] grid place-content-center glow-neon">
              <ShieldCheck className="size-8 text-[#3ab9ff]" />
            </div>
            <h3 className="mt-6 text-2xl md:text-3xl font-bold">
              Conteúdo Digital Entregue Imediatamente
            </h3>
            <p className="mt-4 text-slate-300">
              Assim que confirmar o pagamento, você recebe o acesso ao material completo.
              Estude no seu ritmo, em qualquer dispositivo, quantas vezes quiser.
            </p>

            <a
              href={CHECKOUT_URL}
              className="btn-cta mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#3ab9ff] to-[#0077ff] px-10 py-4 text-lg font-extrabold tracking-wide text-white transition-transform hover:scale-[1.03]"
            >
              QUERO ACESSAR AGORA
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#10182b] bg-[#04060d] py-10">
        <div className="max-w-6xl mx-auto px-5 flex flex-col items-center gap-4 text-center">
          <div className="text-lg font-bold tracking-wide">
            <span className="text-white">O Truque do </span>
            <span className="text-[#3ab9ff] glow-text">Sal Azul</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <a href="#" className="hover:text-[#3ab9ff] transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-[#3ab9ff] transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-[#3ab9ff] transition-colors">Contato</a>
          </div>
          <p className="max-w-2xl text-xs text-slate-500 leading-relaxed">
            Este conteúdo possui caráter informativo e educativo. Resultados podem variar de
            pessoa para pessoa e não substituem orientação médica profissional.
          </p>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} O Truque do Sal Azul. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
