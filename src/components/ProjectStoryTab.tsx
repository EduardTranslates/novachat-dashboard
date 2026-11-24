"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Compass,
  ExternalLink,
  Languages,
  Lightbulb,
  Linkedin,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import type { TabId } from "@/types/novachat";

interface ProjectStoryTabProps {
  linkedinUrl: string;
  onNavigateTab: (tab: TabId) => void;
}

type StoryLocale = "en" | "es" | "ca";

export function ProjectStoryTab({
  linkedinUrl,
  onNavigateTab,
}: ProjectStoryTabProps) {
  const [lang, setLang] = useState<StoryLocale>("en");

  const skills = [
    "Bilingual LQA (ES/CA)",
    "MQM Framework",
    "AI Rubric & Eval Design",
    "LLM-as-a-Judge Calibration",
    "Python Automation",
    "Promptfoo",
  ];

  const langOptions: { id: StoryLocale; short: string; label: string }[] = [
    { id: "en", short: "EN", label: "English" },
    { id: "es", short: "ES", label: "Español" },
    { id: "ca", short: "CA", label: "Català" },
  ];

  const headerCopy: Record<
    StoryLocale,
    {
      pill: string;
      headline: string;
      introBefore: string;
      codeToken: string;
      introAfter: string;
    }
  > = {
    en: {
      pill: "Project Story · 1-Minute Read",
      headline: "100% free of technobabble or ITmidating charts.",
      introBefore:
        "Just the story of why I built a fake software company and tricked four AIs in Spanish and Catalan. Thus begins the tale of how I regained the ability to write in prose after all that ",
      codeToken: 'print("code")',
      introAfter: ".",
    },
    es: {
      pill: "Historia del proyecto · Lectura en 1 minuto",
      headline: "100 % libre de paja técnica y dIAgramas.",
      introBefore:
        "O por qué me inventé una empresa de software y puse a prueba cuatro IAs en español y catalán. Un relato sobre recuperar la capacidad de escribir en prosa después de tanto ",
      codeToken: 'print("código")',
      introAfter: ".",
    },
    ca: {
      pill: "Història del projecte · Lectura en 1 minut",
      headline: "100 % lliure de palla tècnica i dIAgrames.",
      introBefore:
        "O per què em vaig inventar una empresa de programari i vaig posar a prova quatre IA en castellà i català. Un relat sobre recuperar la capacitat d'escriure en prosa després de tant ",
      codeToken: 'print("codi")',
      introAfter: ".",
    },
  };

  const hc = headerCopy[lang];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Hero + Trilingual Switcher */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-navy-800 via-navy-850 to-navy-900 p-6 md:p-8 shadow-xl shadow-black/20">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <BookOpen className="h-3.5 w-3.5" />
              {hc.pill}
            </div>

            {/* EN | ES | CA Switcher */}
            <div
              role="group"
              aria-label="Project Story language"
              className="inline-flex items-center gap-1 rounded-xl border border-navy-700 bg-navy-900/90 p-1"
            >
              <Languages className="h-3.5 w-3.5 text-slate-400 ml-1.5 mr-0.5 hidden sm:block" />
              {langOptions.map((opt) => {
                const active = lang === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setLang(opt.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      active
                        ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/45"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                    title={opt.label}
                  >
                    {opt.short}
                  </button>
                );
              })}
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            {hc.headline}
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            {hc.introBefore}
            <code className="px-1.5 py-0.5 rounded bg-navy-950 border border-navy-700 font-mono text-xs text-emerald-300">
              {hc.codeToken}
            </code>
            {hc.introAfter}
          </p>
        </div>
      </section>

      {/* Section 1: When It Began */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6 md:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl border border-sky-500/30 bg-sky-500/10 flex items-center justify-center text-sky-300 shrink-0 mt-0.5">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-sky-400">
              {lang === "en"
                ? "01 · Where the idea came from"
                : lang === "es"
                ? "01 · De dónde vino la idea"
                : "01 · D'on va sorgir la idea"}
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              {lang === "en"
                ? "When It Began"
                : lang === "es"
                ? "Cuándo empezó"
                : "Quan va començar tot"}
            </h3>
          </div>
        </div>

        {lang === "en" && (
          <div className="space-y-3.5 text-sm md:text-[15px] text-slate-300 leading-relaxed">
            <p>
              Everyone talks about AI replacing translators. Personally, I was
              much more interested in opening the hood, seeing where AI actually
              breaks, and where we are needed.
            </p>
            <p>
              After seven years in software localization, subtitling, and
              Linguistic Quality Assurance, I had a hunch: feeding AI chatbots
              huge cabinets of user manuals might make them more sufferable than
              some humans in their field, but it won&apos;t magically make them
              speak good Spanish or Catalan — a language that knows interference
              (and <em>intraference</em>) well enough.
            </p>
            <p>
              So instead of just{" "}
              <span className="text-slate-100 font-medium">
                LinkedRantIn&apos;
              </span>{" "}
              about it, I did what any self-respecting{" "}
              <del className="text-slate-500 decoration-rose-400/70">
                language
              </del>{" "}
              nerd with a DIY mindset would do: I wrestled with Python, invented
              a fictional SaaS company (
              <strong className="text-white">NovaChat</strong>), built a real
              testing lab from scratch, and watched four real AI models play the
              weirdest Parcheesi game ever.
            </p>
          </div>
        )}

        {lang === "es" && (
          <div className="space-y-3.5 text-sm md:text-[15px] text-slate-300 leading-relaxed">
            <p>
              Todos hablan sobre si la IA nos va a reemplazar como traductores,
              pero a mí me interesaba más abrir el capó, buscar el fallo y
              localizar exactamente dónde nos necesitan.
            </p>
            <p>
              Tras siete años en localización de software, subtitulación y
              control de calidad lingüística (LQA), tenía una corazonada: puede
              que atiborrar a un chatbot con toneladas de manuales de usuario lo
              haga más tolerable que muchos humanos en su sector, pero no va a
              conseguir que, por arte de magia, hable con naturalidad español o
              catalán —una lengua que conoce la interferencia (y la{" "}
              <em>intraferencia</em>) de sobra.
            </p>
            <p>
              Así que, en lugar de limitarme a los{" "}
              <span className="text-slate-100 font-medium">
                LinkedInproperios
              </span>
              , hice lo único que un verdadero{" "}
              <del className="text-slate-500 decoration-rose-400/70">
                lingüista
              </del>{" "}
              friki con iniciativa podía hacer: batallé con Python, me inventé
              una empresa SaaS ficticia (
              <strong className="text-white">NovaChat</strong>), monté un
              laboratorio de pruebas real desde cero y puse a cuatro modelos
              reales de IA a jugar la partida de parchís más esperpéntica
              posible.
            </p>
          </div>
        )}

        {lang === "ca" && (
          <div className="space-y-3.5 text-sm md:text-[15px] text-slate-300 leading-relaxed">
            <p>
              Tothom parla de si la IA ens substituirà com a traductors, però a
              mi, personalment, m&apos;interessava molt més obrir el capó,
              trobar l&apos;avaria i saber on ens necessiten.
            </p>
            <p>
              Després de set anys en localització de programari, subtitulació i
              control de qualitat lingüística (LQA), tenia un pressentiment:
              afartar un xatbot amb tones de manuals d&apos;usuari potser el fa
              més tolerable que molts humans al seu sector, però no aconseguirà
              per art de màgia que parli amb naturalitat ni castellà ni català
              —una llengua que coneix la interferència (i la{" "}
              <em>intraferència</em>) amb escreix.
            </p>
            <p>
              Així que, en comptes de limitar-me als{" "}
              <span className="text-slate-100 font-medium">
                LinkedInproperis
              </span>
              , vaig fer l&apos;única cosa que un autèntic{" "}
              <del className="text-slate-500 decoration-rose-400/70">
                lingüista
              </del>{" "}
              friki amb iniciativa podia fer: vaig batallar amb Python, em vaig
              inventar una empresa SaaS fictícia (
              <strong className="text-white">NovaChat</strong>), vaig muntar un
              laboratori de proves real des de zero i vaig mirar com quatre
              models reals d&apos;IA jugaven la partida de parxís més
              estrambòtica possible.
            </p>
          </div>
        )}
      </section>

      {/* Section 2: How It Works */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6 md:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl border border-indigo-400/30 bg-indigo-500/10 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
            <Wrench className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-300">
              {lang === "en"
                ? "02 · No jargon, 3 simple steps"
                : lang === "es"
                ? "02 · Sin jerga, en 3 sencillos pasos"
                : "02 · Sense argot, en 3 senzills passos"}
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              {lang === "en"
                ? "How It Works"
                : lang === "es"
                ? "Cómo funciona"
                : "Com funciona"}
            </h3>
          </div>
        </div>

        <p className="text-sm md:text-[15px] text-slate-300 leading-relaxed">
          {lang === "en"
            ? "I like to picture it as a three-layer chocolate cake, but let's think of it as a quality-control conveyor belt for a multilingual customer support bot:"
            : lang === "es"
            ? "A mí me gusta imaginarlo como una tarta tres chocolates, pero mejor imagínatelo como un bot multilingüe de atención al cliente pasando por una cinta transportadora en el área de control de calidad:"
            : "A mi m'agrada imaginar-m'ho com un pastís de tres xocolates, però millor imagina-t'ho com un bot multilingüe d'atenció al client passant per una cinta transportadora a l'àrea de control de qualitat:"}
        </p>

        {lang === "en" && (
          <ol className="space-y-3">
            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  The Checklist (for robot work):
                </strong>{" "}
                First, a small Python script checks the mechanical stuff
                humankind shouldn&apos;t waste time on: broken code variables,
                buttons that overflow on mobile screens, missing Spanish{" "}
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-sky-200 text-xs">
                  ¿
                </code>{" "}
                marks, or Catalan typos like writing{" "}
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-rose-200 text-xs">
                  intel.ligència
                </code>{" "}
                with a normal dot instead of a middle dot (
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                  l·l
                </code>
                ).
              </div>
            </li>

            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  The Stress Test (with real customer questions):
                </strong>{" "}
                Next, I asked four different AIs everyday support questions in
                Spanish and Catalan. First <em>blind</em> (no company manual)
                and then <em>grounded</em> (with real user menus and refund
                rules), plus a few cheeky trick questions to see if they&apos;d
                fall for them (and fancy myself smarter than AI).
              </div>
            </li>

            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  The Human Eye (or the white-glove test):
                </strong>{" "}
                Finally, I sat down and read every single AI reply myself, in an
                attempt to justify my linguistics studies. No skipping, no
                guessing. I wanted to see exactly what the code caught, what
                slipped past it, and how much time we have left until an army of
                chatbots enslaves us.
              </div>
            </li>
          </ol>
        )}

        {lang === "es" && (
          <ol className="space-y-3">
            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  El checklist (trabajo robótico):
                </strong>{" "}
                Primero, un pequeño script de Python revisa lo mecánico; todo en
                lo que la humanidad no debería perder el tiempo: variables de
                código rotas, botones que sobresalen de la pantalla del móvil,
                signos de apertura{" "}
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-sky-200 text-xs">
                  ¿
                </code>{" "}
                que faltan en español o erratas en catalán como escribir{" "}
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-rose-200 text-xs">
                  intel.ligència
                </code>{" "}
                con un punto normal en vez del punto volado (
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                  l·l
                </code>
                ).
              </div>
            </li>

            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  La prueba de estrés (con preguntas reales de clientes):
                </strong>{" "}
                Después, les hice a cuatro IAs varias preguntas de atención al
                cliente en español y catalán. Primero <em>a ciegas</em> (sin
                manual de empresa) y luego <em>con contexto</em> (con menús
                reales y políticas de reembolso), además de unas cuantas
                preguntas trampa con mala leche para ver si picaban (y sentirme
                más listo que la IA).
              </div>
            </li>

            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  El ojo humano (o la prueba del algodón):
                </strong>{" "}
                Por último, me senté a leer yo mismo cada una de las respuestas,
                en un intento de justificar mis estudios de lingüística. Sin
                saltarme nada, sin suponer nada. Quería ver exactamente qué
                cazaba el código, qué se le colaba y cuánto tiempo nos queda
                hasta que un ejército de chatbots nos esclavice.
              </div>
            </li>
          </ol>
        )}

        {lang === "ca" && (
          <ol className="space-y-3">
            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  El checklist (feina robòtica):
                </strong>{" "}
                Primer, un petit script de Python revisa tot allò mecànic en què
                la humanitat no hauria de perdre el temps: variables de codi
                trencades, botons que es desborden a la pantalla del mòbil,
                signes d&apos;obertura{" "}
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-sky-200 text-xs">
                  ¿
                </code>{" "}
                que falten en castellà o errades en català com escriure{" "}
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-rose-200 text-xs">
                  intel.ligència
                </code>{" "}
                amb un punt normal en comptes del punt volat (
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                  l·l
                </code>
                ).
              </div>
            </li>

            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  La prova d&apos;estrès (amb preguntes reals de clients):
                </strong>{" "}
                Després, vaig fer a quatre IA preguntes d&apos;atenció al client
                en castellà i català. Primer <em>a cegues</em> (sense manual
                d&apos;empresa) i després <em>amb context</em> (amb menús reals
                i polítiques de reemborsament), a més d&apos;unes quantes
                preguntes trampa amb mala bava per veure si hi queien (i
                creure&apos;m més llest que la IA).
              </div>
            </li>

            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  L&apos;ull humà (o la prova del cotó):
                </strong>{" "}
                Finalment, em vaig asseure a llegir jo mateix totes i cadascuna
                de les respostes, en un intent de justificar els meus estudis de
                lingüística. Sense saltar-me res, sense suposar res. Volia veure
                exactament què caçava el codi, què se li escapava i quant de
                temps tenim fins que un exèrcit de xatbots ens esclavitzi.
              </div>
            </li>
          </ol>
        )}
      </section>

      {/* Section 3: What Happened */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6 md:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300">
              {lang === "en"
                ? "03 · The key findings"
                : lang === "es"
                ? "03 · Hallazgos clave"
                : "03 · Troballes clau"}
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              {lang === "en"
                ? "What Happened"
                : lang === "es"
                ? "Qué pasó"
                : "Què va passar"}
            </h3>
          </div>
        </div>

        {lang === "en" && (
          <ul className="space-y-3 text-sm md:text-[15px] text-slate-300 leading-relaxed">
            <li className="rounded-xl border border-rose-500/25 bg-rose-500/[0.05] p-4">
              <strong className="text-rose-200">
                Without a manual, AIs become SmartA(I)sses: wildly confident
                liars.
              </strong>{" "}
              Left on its own, the chatbot cheerfully invented a €12 Pro plan,
              promised a non-existent 50% student discount, or exiled users to
              Never-Menu Land.
            </li>

            <li className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4">
              <strong className="text-emerald-200">
                Give them the facts, and the hallucinations vanish.
              </strong>{" "}
              The moment I handed the models real rules and a menu map, every
              single Critical factual hallucination disappeared.
            </li>

            <li className="rounded-xl border border-indigo-400/25 bg-indigo-500/[0.06] p-4">
              <strong className="text-indigo-200">
                &ldquo;Large Language Model&rdquo; doesn&apos;t necessarily mean
                &ldquo;Precise Language Model.&rdquo;
              </strong>{" "}
              Even with the right facts, Spanish kept sneaking into Catalan
              answers: mixing Spanish menu names into Catalan sentences, using
              Castilianisms like{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-indigo-200 text-xs">
                reembolsen
              </code>
              , and clinging to Catalan diacritic accents (such as{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-indigo-200 text-xs">
                vés
              </code>
              ) that the spelling reform abolished 10 years ago, when Gemini was
              still studying for its 3rd grade language tests.
            </li>

            <li className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
              <strong className="text-amber-200">
                The grand finale belonged to human review.
              </strong>{" "}
              Two sneaky Catalan grammar errors walked right past all the
              automated code: a misworded clitic pronoun (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                se&apos;te cobrarà
              </code>
              ) and a model using the first-person plural &ldquo;we write to
              support&rdquo; (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                escrivim
              </code>
              ) instead of &ldquo;write to support&rdquo; (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                escriu
              </code>
              ). Code catches what it&apos;s able to identify, but the human eye
              is essential to ensure accuracy and authenticity.
            </li>
          </ul>
        )}

        {lang === "es" && (
          <ul className="space-y-3 text-sm md:text-[15px] text-slate-300 leading-relaxed">
            <li className="rounded-xl border border-rose-500/25 bg-rose-500/[0.05] p-4">
              <strong className="text-rose-200">
                Sin manual, las IAs tienden a la cuñadIA: mienten con un descaro
                pasmoso.
              </strong>{" "}
              Sin una guía, el chatbot se inventaba alegremente un plan Pro de
              12 €, prometía un falso descuento del 50 % para estudiantes o
              desterraba a los usuarios al país de No Encaja Más.
            </li>

            <li className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4">
              <strong className="text-emerald-200">
                Dales los datos y las alucinaciones se esfuman.
              </strong>{" "}
              En cuanto proporcioné a los modelos las reglas reales y el mapa de
              menús, desaparecieron absolutamente todas las alucinaciones
              factuales críticas.
            </li>

            <li className="rounded-xl border border-indigo-400/25 bg-indigo-500/[0.06] p-4">
              <strong className="text-indigo-200">
                «Modelo Extenso de Lenguaje» no significa necesariamente «Modelo
                Exacto de Lenguaje».
              </strong>{" "}
              Incluso con los datos correctos, el español seguía colándose en
              las respuestas en catalán: mezclando nombres de menú en español
              dentro de frases en catalán, metiendo castellanismos como{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-indigo-200 text-xs">
                reembolsen
              </code>{" "}
              y aferrándose a acentos diacríticos (como{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-indigo-200 text-xs">
                vés
              </code>
              ) que la reforma ortográfica abolió hace diez años, cuando Gemini
              todavía estaba estudiando para sus exámenes de lengua de 3.º de
              primaria.
            </li>

            <li className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
              <strong className="text-amber-200">
                El broche de oro le tocó a la revisión humana.
              </strong>{" "}
              Dos furtivos errores de gramática catalana consiguieron burlar
              todo el código: un pronombre clítico mal formado (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                se&apos;te cobrarà
              </code>
              ) y un modelo usando la primera persona del plural «escribimos a
              soporte» (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                escrivim
              </code>
              ) en lugar del imperativo «escribe a soporte» (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                escriu
              </code>
              ). El código caza lo que puede identificar, pero el ojo humano
              sigue siendo imprescindible para garantizar precisión y
              naturalidad.
            </li>
          </ul>
        )}

        {lang === "ca" && (
          <ul className="space-y-3 text-sm md:text-[15px] text-slate-300 leading-relaxed">
            <li className="rounded-xl border border-rose-500/25 bg-rose-500/[0.05] p-4">
              <strong className="text-rose-200">
                Sense manual, les IA tendeixen a la cunyadIA: menteixen sense
                vergonya ni recança.
              </strong>{" "}
              Sense guiatge, el xatbot s&apos;inventava de bon grat un pla Pro
              de 12 €, prometia un fals descompte del 50 % per a estudiants o
              desterrava els usuaris al país de Mai Menús.
            </li>

            <li className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4">
              <strong className="text-emerald-200">
                Dona&apos;ls les dades i les al·lucinacions s&apos;esvaeixen.
              </strong>{" "}
              Tan bon punt vaig passar als models les regles reals i el mapa de
              menús, van desaparèixer absolutament totes les al·lucinacions
              factuals crítiques.
            </li>

            <li className="rounded-xl border border-indigo-400/25 bg-indigo-500/[0.06] p-4">
              <strong className="text-indigo-200">
                «Model de Llenguatge Extens» no vol dir necessàriament «Model de
                Llenguatge Excels».
              </strong>{" "}
              Fins i tot amb les dades correctes, el castellà es continuava
              colant a les respostes en català: barrejant noms de menú en
              castellà dins de frases en català, colant castellanismes com{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-indigo-200 text-xs">
                reembolsen
              </code>{" "}
              i arrapant-se als accents diacrítics (com{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-indigo-200 text-xs">
                vés
              </code>
              ) que la reforma ortogràfica va abolir fa deu anys, quan Gemini
              encara estudiava per als seus exàmens de llengua de 3r de
              primària.
            </li>

            <li className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
              <strong className="text-amber-200">
                La cirereta del pastís li va tocar a la revisió humana.
              </strong>{" "}
              Dos errors furtius de gramàtica catalana van eludir tot el codi:
              un pronom feble mal format (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                se&apos;te cobrarà
              </code>
              ) i un model fent servir la primera persona del plural «escrivim
              al servei d&apos;assistència» (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                escrivim
              </code>
              ) en lloc de l&apos;imperatiu «escriu» (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                escriu
              </code>
              ). El codi caça allò que pot identificar, però l&apos;ull humà
              continua sent cabdal per a garantir la precisió i
              l&apos;autenticitat.
            </li>
          </ul>
        )}
      </section>

      {/* Section 4: Why It Matters */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6 md:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-300">
              {lang === "en"
                ? "04 · Because time matters"
                : lang === "es"
                ? "04 · Porque el tiempo importa"
                : "04 · Perquè el temps importa"}
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              {lang === "en"
                ? "Why It Matters"
                : lang === "es"
                ? "Para qué sirve"
                : "Per a què serveix"}
            </h3>
          </div>
        </div>

        {lang === "en" && (
          <div className="space-y-3.5 text-sm md:text-[15px] text-slate-300 leading-relaxed">
            <p>
              In real localization and AI teams, time is the scarcest resource
              on the table.
            </p>
            <p>
              If you ask senior translators to hunt for double spaces, broken
              placeholders, or obvious glossary mistakes one by one, you burn
              their time and their sanity. On the flip side, if you trust full
              automation blindly, subtle grammar slips and unnatural phrasing
              might end up in front of an already doubtful user.
            </p>
            <p className="rounded-xl border border-sky-500/25 bg-sky-500/[0.06] p-4 text-slate-100 font-medium">
              NovaChat is my blueprint for the sweet spot in between: automate
              the predictable and save our brainpower for nuance, culture, and
              judgment.
            </p>
          </div>
        )}

        {lang === "es" && (
          <div className="space-y-3.5 text-sm md:text-[15px] text-slate-300 leading-relaxed">
            <p>
              En equipos reales de IA y localización, el tiempo es el recurso
              más valioso posible.
            </p>
            <p>
              Si pones a traductores sénior a cazar dobles espacios, variables
              rotas o fallos obvios de glosario uno por uno, acabas con su
              tiempo y su salud mental. Por otro lado, si confías ciegamente en
              la automatización total, un despiste gramatical o una frase
              antinatural pueden acabar en la pantalla de un usuario que ya
              venía con dudas de antes.
            </p>
            <p className="rounded-xl border border-sky-500/25 bg-sky-500/[0.06] p-4 text-slate-100 font-medium">
              NovaChat es mi hoja de ruta para trabajar en el punto óptimo:
              automatizar lo predecible y reservar nuestro intelecto para los
              matices, el criterio y la cultura.
            </p>
          </div>
        )}

        {lang === "ca" && (
          <div className="space-y-3.5 text-sm md:text-[15px] text-slate-300 leading-relaxed">
            <p>
              En equips reals d&apos;IA i localització, el temps és el recurs
              més valuós possible.
            </p>
            <p>
              Si poses traductors sènior a caçar dobles espais, variables
              trencades o errors obvis de glossari un per un, esgotes el seu
              temps i la seva salut mental. D&apos;altra banda, si confies
              cegament en l&apos;automatització total, una patinada gramatical o
              una frase antinatural poden acabar a la pantalla d&apos;un usuari
              que ja tenia dubtes abans.
            </p>
            <p className="rounded-xl border border-sky-500/25 bg-sky-500/[0.06] p-4 text-slate-100 font-medium">
              NovaChat és el meu full de ruta per a treballar al punt òptim:
              automatitzar allò previsible i reservar el nostre intel·lecte per
              als matisos, el criteri i la cultura.
            </p>
          </div>
        )}
      </section>

      {/* Footer Card: Honest Limits & The Human Behind It */}
      <section className="rounded-2xl border border-navy-700 bg-navy-850/95 p-6 md:p-7 space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <User className="h-4 w-4 text-sky-400" />
          {lang === "en"
            ? "Honest Limits & The Human Behind It"
            : lang === "es"
            ? "Límites razonables y el humano detrás de esto"
            : "Límits raonables i l'humà que hi ha al darrere"}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300 leading-relaxed">
          <div className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 space-y-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-violet-300 font-semibold">
              {lang === "en"
                ? "Scope & Honest Limits"
                : lang === "es"
                ? "Alcance y límites razonables"
                : "L'abast i límits raonables"}
            </div>
            {lang === "en" && (
              <p className="text-xs md:text-sm text-slate-300">
                NovaChat is a small, reproducible{" "}
                <strong className="text-white">method demo</strong>, not a
                massive market benchmark. I deliberately kept it to 12 carefully
                targeted bilingual cases (one per major risk area) so I could
                personally audit 100% of the answers. Because I wrote the
                questions, rules, and trick cases myself, treat the perfect
                scores as proof of method rather than a universal ranking of
                these models.
              </p>
            )}
            {lang === "es" && (
              <p className="text-xs md:text-sm text-slate-300">
                NovaChat es una{" "}
                <strong className="text-white">demostración de método</strong>{" "}
                pequeña y reproducible, no un <em>benchmark</em> masivo de
                mercado. Lo limité deliberadamente a 12 casos bilingües muy
                medidos (uno por cada área de riesgo principal) para poder
                auditar personalmente el 100 % de las respuestas. Como las
                preguntas, las reglas y los casos trampa los escribí yo mismo,
                toma las puntuaciones perfectas como prueba de método y no como
                una clasificación universal de estos modelos.
              </p>
            )}
            {lang === "ca" && (
              <p className="text-xs md:text-sm text-slate-300">
                NovaChat és una{" "}
                <strong className="text-white">demostració de mètode</strong>{" "}
                petita i reproduïble, no un <em>benchmark</em> massiu de mercat.
                El vaig limitar deliberadament a 12 casos bilingües ben escollits
                (un per cada àrea de risc principal) per poder auditar
                personalment el 100 % de les respostes. Com que les preguntes,
                les regles i els casos trampa els vaig escriure jo mateix,
                pren-te les puntuacions perfectes com a prova de mètode i no com
                un rànquing universal d&apos;aquests models.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="text-xs font-mono uppercase tracking-wider text-sky-300 font-semibold">
                {lang === "en"
                  ? "Who built this"
                  : lang === "es"
                  ? "Quién lo ha creado"
                  : "Qui ho ha creat"}
              </div>
              {lang === "en" && (
                <p className="text-xs md:text-sm text-slate-300">
                  I&apos;m <strong className="text-white">Eduard Aliod</strong>,
                  born and raised in Reus (Catalonia). A passionate musician and
                  full-time restless language geek who realized two months ago
                  that he wasn&apos;t geeky enough and that scrolling through
                  Netflix wasn&apos;t as fun as scrolling through syntax errors.
                  I bridge classic localization (subtitling, UI, musical
                  adaptation) with transcreation and AI evaluation (LQA,
                  auditing, red teaming, multimodal).
                </p>
              )}
              {lang === "es" && (
                <p className="text-xs md:text-sm text-slate-300">
                  Soy <strong className="text-white">Eduard Aliod</strong>,
                  nacido y criado en Reus (Cataluña). Músico apasionado y
                  obsesionado con la lengua a tiempo completo, que hace un par
                  de meses se dio cuenta de que todavía no era lo bastante friki
                  y de que vagar sin rumbo en Netflix no molaba tanto como vagar
                  entre errores de sintaxis. Tiendo puentes entre la
                  localización clásica (subtitulación, interfaces de usuario,
                  adaptación musical), la transcreación y la evaluación de IA
                  (LQA, auditorías, <em>red-teaming</em>, multimodal).
                </p>
              )}
              {lang === "ca" && (
                <p className="text-xs md:text-sm text-slate-300">
                  Soc l&apos;
                  <strong className="text-white">Eduard Aliod</strong>, nascut i
                  criat a Reus (Catalunya). Músic apassionat i enderiat de la
                  llengua a temps complet, que fa un parell de mesos es va
                  adonar que encara no era prou friki i que vagarejar per
                  Netflix no molava tant com vagarejar entre errors de sintaxi.
                  Faig de pont entre la localització clàssica (subtitulació,
                  interfícies, adaptació musical), la transcreació i
                  l&apos;avaluació d&apos;IA (LQA, auditoria,{" "}
                  <em>red-teaming</em>, multimodal).
                </p>
              )}
            </div>

            <div>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-sky-500/45 bg-sky-500/15 hover:bg-sky-500/25 px-3.5 py-2 text-xs font-semibold text-sky-200 transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5 text-sky-300" />
                {lang === "en"
                  ? "Connect on LinkedIn"
                  : lang === "es"
                  ? "Conectar en LinkedIn"
                  : "Connectar a LinkedIn"}
                <ExternalLink className="h-3 w-3 opacity-75" />
              </a>
            </div>
          </div>
        </div>

        {/* Skills in action */}
        <div className="pt-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            {lang === "en"
              ? "Skills in action"
              : lang === "es"
              ? "Habilidades en acción"
              : "Habilitats en acció"}
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-lg border border-navy-600 bg-navy-900 text-xs font-medium text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="pt-3 border-t border-navy-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            {lang === "en"
              ? "Want to test the live AI chatbot, run Python LQA checks, or inspect the 28 MQM defects and 72 recorded replies?"
              : lang === "es"
              ? "¿Quieres probar el chatbot en vivo, ejecutar el validador de Python o inspeccionar los 28 defectos MQM y las 72 respuestas grabadas?"
              : "Vols provar el xatbot en directe, executar el validador de Python o inspeccionar els 28 defectes MQM i les 72 respostes enregistrades?"}
          </p>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onNavigateTab("sandbox");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-400/45 bg-violet-500/20 hover:bg-violet-500/30 px-3.5 py-2.5 text-xs font-semibold text-violet-100 transition-colors"
            >
              {lang === "en"
                ? "Try the Live Chatbot"
                : lang === "es"
                ? "Probar el chatbot en vivo"
                : "Provar el xatbot en directe"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                onNavigateTab("overview");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-500/45 bg-sky-500/20 hover:bg-sky-500/30 px-4 py-2.5 text-xs sm:text-sm font-semibold text-sky-100 transition-colors"
            >
              {lang === "en"
                ? "Explore the Executive Overview"
                : lang === "es"
                ? "Explorar el resumen ejecutivo"
                : "Explorar el resum executiu"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
