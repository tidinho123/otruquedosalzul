import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import Player from "@vimeo/player";
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

const OFFER_DURATION_MS = 10 * 60 * 1000; // 10 min
const REVEAL_DELAY_MS = 6 * 60 * 1000;   // mostrar CTA após 6 min

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

function OfferBlock({ remaining, size = "lg" }: { remaining: number; size?: "lg" | "md" }) {
  const expired = remaining <= 0;
  return (
    <div className="fade-in-up mt-2 flex flex-col items-center gap-4 w-full">
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm md:text-base text-slate-400 line-through">De 9.000 Kz</span>
        <span className="text-3xl md:text-5xl font-extrabold text-white glow-text">
          Hoje por <span className="text-[#3ab9ff]">5.000 Kz</span>
        </span>
        <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
          Poupas 4.000 Kz só hoje
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
        className={`btn-cta inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#3ab9ff] to-[#0077ff] text-white font-extrabold tracking-wide transition-transform hover:scale-[1.03] shadow-[0_10px_40px_rgba(58,185,255,0.45)] ${
          size === "lg" ? "px-10 py-5 text-lg md:text-xl" : "px-8 py-4 text-base md:text-lg"
        } ${expired ? "opacity-60 pointer-events-none" : ""}`}
      >
        <Sparkles className="size-5" />
        {expired ? "OFERTA ENCERRADA" : "QUERO ACESSO AGORA"}
      </a>
      {!expired && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-slate-300">Acesso na hora, mal o pagamento entra</p>
          <p className="text-xs text-slate-400">Pagamento seguro • 7 dias de garantia</p>
        </div>
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

const CHECKOUT_URL = "https://pay.kursinha.com/c/6a242b9ce4492a7f37ba9430";

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
  { icon: TrendingUp, title: "Mais tempo na hora H", desc: "Técnicas e hábitos simples que homens em Angola estão a usar para não acabar à pressa — e finalmente sentir o que é levar até ao fim com calma." },
  { icon: Zap, title: "Mais firmeza, mais presença", desc: "Trabalha o que muita gente ignora: circulação, respiração e controlo. O resultado fala por si — e ela vai sentir antes de tu dizeres alguma coisa." },
  { icon: Flame, title: "Aquele 'fogo' que tinhas voltou", desc: "Volta o desejo, volta a confiança. Sem ansiedade no peito antes de cada relação." },
  { icon: HeartPulse, title: "Ela vai querer mais — ou voltar a querer", desc: "Seja tua companheira de anos ou alguém novo, o olhar dela muda. Sem ter que dizer uma palavra." },
  { icon: Leaf, title: "Só com coisas de mercado", desc: "Receitas e hábitos com ingredientes que se compram a 1.500 Kz no mercado do bairro. Sem farmácia, sem importado, sem comprimido azul." },
  { icon: ShieldCheck, title: "Ninguém precisa de saber", desc: "Lês no telefone, fazes em casa. Discreto do início ao fim — só ela vai sentir a diferença quando for a hora." },
];

const depoimentos = [
  {
    nome: "Adilson, 38 — Viana",
    inicial: "A",
    cor: "from-sky-500 to-indigo-700",
    texto: "Mano, vou ser sincero: já estava a pensar que era da idade. Comprei mais por desespero. Em 12 dias ela perguntou-me 'o que é que se passa contigo?'. Não contei nada. Deixei ela achar que era amor.",
  },
  {
    nome: "Hélder, 45 — Benguela",
    inicial: "H",
    cor: "from-cyan-500 to-blue-700",
    texto: "Já tinha gasto mais de 40 mil em comprimido azul, chá chinês, tudo. Nada funcionava direito. Isto aqui foi a primeira coisa que mudou alguma coisa a sério. Hoje ela pensa que eu tenho outra — é tudo dela.",
  },
  {
    nome: "Nelson, 41 — Talatona",
    inicial: "N",
    cor: "from-blue-500 to-violet-700",
    texto: "Eu evitava ir cedo para a cama, fingia trabalho no telemóvel. Tinha vergonha de olhar para ela. Hoje sou eu que apago a luz primeiro. Ela voltou a sorrir de manhã. Isso não tem preço.",
  },
  {
    nome: "Edmilson, 33 — Huambo",
    inicial: "E",
    cor: "from-sky-600 to-cyan-500",
    texto: "Por 5 mil kwanzas? Mano, gasto mais que isso numa cerveja com os amigos. Salvou o meu casamento. Não tenho mais nada a dizer.",
  },
];

const faq = [
  {
    q: "Como é que eu recebo isso?",
    a: "Assim que o pagamento entra, chega no teu email o acesso. Abres no telemóvel, no computador, onde for. É tudo digital — não vem caixa nem encomenda para casa.",
  },
  {
    q: "E se não funcionar comigo?",
    a: "Tens 7 dias. Se abrires e achares que não é para ti, mandas uma mensagem e devolvemos o dinheiro. Não vamos ficar a fazer perguntas chatas.",
  },
  {
    q: "Preciso comprar comprimido ou alguma coisa cara?",
    a: "Não. O que está lá usa coisas normais de mercado. Nada de farmácia, nada de importado.",
  },
  {
    q: "Alguém vai descobrir que eu comprei isto?",
    a: "Só se tu quiseres. A cobrança chega com nome neutro e o material fica no teu email. Ninguém precisa saber.",
  },
  {
    q: "Quanto tempo demora a notar diferença?",
    a: "Depende de cada um. A maioria fala em mudança nas primeiras 2 a 3 semanas, desde que apliques a sério. Não é mágica — é constância.",
  },
];

function Index() {
  // Mostrar a oferta imediatamente — não esperar pelo fim do vídeo.
  // (Esperar matava a conversão: lead saía antes de ver o preço/CTA.)
  const { revealed, remaining } = useOfferReveal(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowStickyCTA(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04060d] text-slate-100">
      <LiveNotifications />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="absolute inset-0 radial-glow" aria-hidden />
        <Particles />

        <div className="relative z-10 max-w-6xl mx-auto px-5 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 backdrop-blur px-4 py-1.5 text-xs md:text-sm text-red-300 font-semibold fade-in-up">
            <Flame className="size-3.5 text-red-400" />
            Atenção: se já acabaste antes do tempo ou sentiste que "faltou alguma coisa", lê isto até ao fim
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] fade-in-up">
            "Acabei em <span className="glow-text text-[#3ab9ff]">2 minutos</span> e vi a cara dela mudar…
            <br className="hidden md:block" />
            <span className="text-white"> nunca mais quero passar por isso."</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-slate-300 fade-in-up">
            Acabar à pressa, sentir que ficou a desejar, ver o olhar dela mudar no meio da relação… isso destrói qualquer homem por dentro.
            E o pior: <span className="text-white font-semibold">quanto mais tu pensas nisso, pior fica</span>. Vira ansiedade, vira evitar a cama, vira desculpa de "estou cansado".
            Mas a verdade é que <span className="text-white font-semibold">isto tem solução — e não passa por comprimido azul, médico ou conversa com ninguém</span>.
            Carrega no play abaixo e vê o que muito homem aqui em Angola anda a fazer em casa para durar mais e voltar a sentir-se homem na hora H.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5"><Lock className="size-3.5" /> Pagamento seguro</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> 7 dias de garantia</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="size-3.5" /> Recebes na hora</span>
          </div>
        </div>


        {/* VSL */}
        <div className="relative z-10 max-w-3xl mx-auto px-5 pb-20 md:pb-28">
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
                  title="O Truque do Sal Azul - VSL"
                />
              </div>
            </div>
          </div>

          {revealed && (
            <div className="mt-10 flex justify-center">
              <OfferBlock remaining={remaining} size="lg" />
            </div>
          )}

        </div>
      </section>


      {/* BENEFÍCIOS */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[#3ab9ff] font-semibold text-sm uppercase tracking-widest">O que vais levar</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold">
              Não é milagre. É só o que <span className="text-[#3ab9ff]">ninguém te contou</span> ainda.
            </h2>
            <p className="mt-4 text-slate-400">
              São hábitos e receitas simples que funcionam aqui em Angola, com o que tu tens à mão. Sem complicação.
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
              O que os outros homens andam a dizer
            </h2>
            <p className="mt-4 text-slate-400">Mensagens reais de quem já passou pelo mesmo que tu.</p>
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
            <p className="mt-6 text-sm uppercase tracking-widest text-[#3ab9ff] font-semibold">
              7 dias de garantia
            </p>
            <h3 className="mt-3 text-2xl md:text-3xl font-bold">
              Se não for para ti, devolvemos o teu dinheiro. Ponto.
            </h3>
            <p className="mt-4 text-slate-300">
              Tens uma semana inteira para ver o material com calma. Se achares que não vale a pena,
              mandas uma mensagem e o reembolso é feito. <span className="text-white font-semibold">Não vamos
              discutir contigo nem pedir explicações.</span> O risco fica connosco.
            </p>

            {revealed && (
              <div className="mt-8 flex justify-center">
                <OfferBlock remaining={remaining} size="lg" />
              </div>
            )}

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 md:py-24 bg-[#06080f]">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[#3ab9ff] font-semibold text-sm uppercase tracking-widest">Perguntas que aparecem sempre</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold">
              Antes de fechares a página
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-[#1b2742] bg-[#0a0f1f] p-5 open:border-[#3ab9ff]/60 transition-colors"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-white">
                  <span>{item.q}</span>
                  <span className="text-[#3ab9ff] text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>

          {revealed && (
            <div className="mt-12 flex justify-center">
              <OfferBlock remaining={remaining} size="lg" />
            </div>
          )}
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
