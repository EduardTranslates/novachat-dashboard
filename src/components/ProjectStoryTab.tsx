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
              some humans in their field, but it won't magically make them
              speak good Spanish or Catalan — a language that knows interference
              (and <em>intraference</em>) well enough.
            </p>
            <p>
              So instead of just{" "}
              <span className="text-slate-100 font-medium">
                LinkedRantIn'
              </span>{" "}
              about it, I did what any self-respecting{" "}
              <del className="text-slate-500 decoration-rose-400/70">
                language
              </del>{" "}
              nerd with a DIY mindset would do: I wrestled with Python, invented
              a fictional SaaS company (
              <strong className="text-white">NovaChat</strong>), built a real
              testing lab, and watched four real AI models play the weirdest
              Parcheesi game ever.
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
              laboratorio de pruebas real y puse a cuatro modelos reales de IA a
              jugar la partida de parchís más esperpéntica posible.
            </p>
          </div>
        )}

        {lang === "ca" && (
          <div className="space-y-3.5 text-sm md:text-[15px] text-slate-300 leading-relaxed">
            <p>
              Tothom parla de si la IA ens substituirà com a traductors, però a
              mi, personalment, m'interessava molt més obrir el capó,
              trobar l'avaria i saber on ens necessiten.
            </p>
            <p>
              Després de set anys en localització de programari, subtitulació i
              control de qualitat lingüística (LQA), tenia un pressentiment:
              afartar un xatbot amb tones de manuals d'usuari potser el fa
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
              , vaig fer l'única cosa que un autèntic{" "}
              <del className="text-slate-500 decoration-rose-400/70">
                lingüista
              </del>{" "}
              friki amb iniciativa podia fer: vaig batallar amb Python, em vaig
              inventar una empresa SaaS fictícia (
              <strong className="text-white">NovaChat</strong>), vaig muntar un
              laboratori de proves real i vaig mirar com quatre models reals
              d'IA jugaven la partida de parxís més estrambòtica possible.
            </p>
          </div>
        )}
      </section>

      {/* Section 2: How It Works (Aligned to the stable 3-Layer QA Architecture) */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6 md:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl border border-indigo-400/30 bg-indigo-500/10 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
            <Wrench className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-300">
              {lang === "en"
                ? "02 · 3 QA layers, zero jargon"
                : lang === "es"
                ? "02 · 3 capas de QA, sin jerga"
                : "02 · 3 capes de QA, sense argot"}
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
            ? "I like to picture it as a three-layer chocolate cake, but let's think of it as a three-layer quality-control conveyor belt for a multilingual customer support bot — tested across 6 runs (1 blind Flash-Lite baseline + 5 grounded runs across 4 models) with everyday and adversarial ES/CA prompts:"
            : lang === "es"
            ? "A mí me gusta imaginarlo como una tarta tres chocolates, pero mejor imagínatelo como un bot multilingüe de atención al cliente pasando por una cinta de control de calidad de tres capas —puesto a prueba en 6 ejecuciones (1 a ciegas con Flash-Lite + 5 con contexto en 4 modelos) con preguntas cotidianas y trampas en ES/CA:"
            : "A mi m'agrada imaginar-m'ho com un pastís de tres xocolates, però millor imagina-t'ho com un bot multilingüe d'atenció al client passant per una cinta de control de qualitat de tres capes —posat a prova en 6 execucions (1 a cegues amb Flash-Lite + 5 amb context en 4 models) amb preguntes quotidianes i trampes en ES/CA:"}
        </p>

        {lang === "en" && (
          <ol className="space-y-3">
            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  Layer 1 — Deterministic Rules (Python robot work):
                </strong>{" "}
                A small Python script checks the mechanical stuff humankind
                shouldn't waste time on: broken code variables, UI strings
                that exceed mobile character limits, approved glossary terms,
                missing Spanish{" "}
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
                  Layer 2 — Semantic Evaluation (Promptfoo + Calibrated LLM
                  Judge):
                </strong>{" "}
                Automated assertions and a rubric-calibrated judge verify policy
                compliance and grounding across real ES/CA support questions and
                cheeky adversarial traps — catching loopholes like hidden store
                credits or deceptive negations that brittle regexes miss.
              </div>
            </li>

            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  Layer 3 — Bilingual Human Review (the white-glove test):
                </strong>{" "}
                Finally, I sat down and read all 72 model replies myself, in an
                attempt to justify my linguistics studies. No skipping, no
                guessing — catching subtle grammar slips, dialectal drift, and
                policy extrapolations that require Product Owner escalation (
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-violet-200 text-xs">
                  QUERY
                </code>
                ), and seeing how much time we have left until an army of
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
                  Capa 1 — Reglas deterministas (trabajo robótico en Python):
                </strong>{" "}
                Un pequeño script de Python revisa lo mecánico en lo que la
                humanidad no debería perder el tiempo: variables de código
                rotas, cadenas de interfaz que superan el límite de caracteres
                en móvil, términos de glosario, signos de apertura{" "}
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
                  Capa 2 — Evaluación semántica (Promptfoo + Juez LLM
                  calibrado):
                </strong>{" "}
                Las aserciones automáticas y un juez calibrado con rúbrica
                comprueban el cumplimiento de políticas y datos en preguntas
                reales y trampas con mala leche, cazando escapatorias como
                créditos ocultos o negaciones engañosas que se les escapan a los
                regex.
              </div>
            </li>

            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  Capa 3 — Revisión humana bilingüe (la prueba del algodón):
                </strong>{" "}
                Por último, me senté a leer yo mismo las 72 respuestas, en un
                intento de justificar mis estudios de lingüística. Sin saltarme
                nada, sin suponer nada —detectando fallos sutiles de gramática,
                naturalidad y extrapolaciones que hay que escalar al Product
                Owner (
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-violet-200 text-xs">
                  QUERY
                </code>
                ), y midiendo cuánto tiempo nos queda hasta que un ejército de
                chatbots nos esclavice.
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
                  Capa 1 — Regles deterministes (feina robòtica en Python):
                </strong>{" "}
                Un petit script de Python revisa tot allò mecànic en què la
                humanitat no hauria de perdre el temps: variables de codi
                trencades, cadenes d'interfície que superen el límit de
                caràcters al mòbil, termes de glossari, signes d'obertura{" "}
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
                  Capa 2 — Avaluació semàntica (Promptfoo + Jutge LLM calibrat):
                </strong>{" "}
                Les assercions automàtiques i un jutge calibrat amb rúbrica
                verifiquen el compliment de polítiques i dades en preguntes
                reals i trampes amb mala bava, caçant escapatòries com crèdits
                ocults o negacions enganyoses que se li escapen al regex.
              </div>
            </li>

            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  Capa 3 — Revisió humana bilingüe (la prova del cotó):
                </strong>{" "}
                Finalment, em vaig asseure a llegir jo mateix totes 72
                respostes, en un intent de justificar els meus estudis de
                lingüística. Sense saltar-me res, sense suposar res —detectant
                relliscades subtils de gramàtica, naturalitat i extrapolacions
                que cal escalar al Product Owner (
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-violet-200 text-xs">
                  QUERY
                </code>
                ), i calculant quant de temps tenim fins que un exèrcit de
                xatbots ens esclavitzi.
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
                Without a manual, AIs become SmartA(I)sses: confidently wrong.
              </strong>{" "}
              In the ungrounded Flash-Lite baseline, the chatbot cheerfully
              invented a €12 Pro plan, promised a non-existent 50% student
              discount, or exiled users to Never-Menu Land (8 Critical
              hallucinations in 12 questions).
            </li>

            <li className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4">
              <strong className="text-emerald-200">
                Give them the facts, and critical factual hallucinations
                vanished in this test.
              </strong>{" "}
              Once real policies and the UI menu map were added to the prompt,
              Critical factual hallucinations dropped from 8 in the baseline to
              0 across all 5 grounded runs on 4 models.
            </li>

            <li className="rounded-xl border border-indigo-400/25 bg-indigo-500/[0.06] p-4">
              <strong className="text-indigo-200">
                “Large Language Model” doesn't necessarily mean
                “Precise Language Model.”
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
              ) abolished under the 2016 IEC spelling reform, when Gemini was
              still studying for its 3rd grade language tests.
            </li>

            <li className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
              <strong className="text-amber-200">
                The grand finale belonged to human review.
              </strong>{" "}
              Two sneaky Catalan grammar errors passed all automated checks
              (auto-PASS / human-FAIL): a misworded clitic pronoun (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                se'te cobrarà
              </code>{" "}
              →{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                se't cobrarà
              </code>
              ) and a model using the first-person plural “we write to
              support” (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                escrivim
              </code>
              ) instead of imperative “write to support” (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                escriu
              </code>
              ). Code catches what it's able to identify, but the human eye
              is essential to ensure accuracy and authenticity.
            </li>
          </ul>
        )}

        {lang === "es" && (
          <ul className="space-y-3 text-sm md:text-[15px] text-slate-300 leading-relaxed">
            <li className="rounded-xl border border-rose-500/25 bg-rose-500/[0.05] p-4">
              <strong className="text-rose-200">
                Sin manual, las IAs tienden a la cuñadIA: se equivocan con un
                descaro pasmoso.
              </strong>{" "}
              En la ejecución sin guía de Flash-Lite, el chatbot se inventaba
              alegremente un plan Pro de 12 €, prometía un falso descuento del
              50 % para estudiantes o desterraba a los usuarios al país de No
              Encaja Más (8 alucinaciones críticas en 12 preguntas).
            </li>

            <li className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4">
              <strong className="text-emerald-200">
                Dales los datos y las alucinaciones factuales críticas
                desaparecieron en esta prueba.
              </strong>{" "}
              En cuanto proporcioné a los modelos las reglas reales y el mapa de
              menús, las alucinaciones factuales críticas bajaron de 8 en la
              ejecución base a 0 en las 5 ejecuciones con contexto sobre 4
              modelos.
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
              ) abolidos en la reforma ortográfica del IEC de 2016, cuando
              Gemini todavía estaba estudiando para sus exámenes de lengua de
              3.º de primaria.
            </li>

            <li className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
              <strong className="text-amber-200">
                El broche de oro le tocó a la revisión humana.
              </strong>{" "}
              Dos furtivos errores de gramática catalana consiguieron burlar
              todo el código (aprobados en automático, suspendidos en revisión
              humana): un pronombre clítico mal formado (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                se'te cobrarà
              </code>{" "}
              →{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                se't cobrarà
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
                Sense manual, les IA tendeixen a la cunyadIA: s'equivoquen
                sense vergonya ni recança.
              </strong>{" "}
              A l'execució sense guiatge de Flash-Lite, el xatbot
              s'inventava de bon grat un pla Pro de 12 €, prometia un fals
              descompte del 50 % per a estudiants o desterrava els usuaris al
              país de Mai Menús (8 al·lucinacions crítiques en 12 preguntes).
            </li>

            <li className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4">
              <strong className="text-emerald-200">
                Dona'ls les dades i les al·lucinacions factuals crítiques
                van desaparèixer en aquesta prova.
              </strong>{" "}
              Tan bon punt vaig passar als models les regles reals i el mapa de
              menús, les al·lucinacions factuals crítiques van baixar de 8 a la
              prova base fins a 0 en totes 5 execucions amb context sobre 4
              models.
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
              ) abolits amb la reforma ortogràfica de l'IEC del 2016, quan
              Gemini encara estudiava per als seus exàmens de llengua de 3r de
              primària.
            </li>

            <li className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
              <strong className="text-amber-200">
                La cirereta del pastís li va tocar a la revisió humana.
              </strong>{" "}
              Dos errors furtius de gramàtica catalana van eludir tot el codi
              (aprovats en automàtic, suspesos en revisió humana): un pronom
              feble mal format (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                se'te cobrarà
              </code>{" "}
              →{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                se't cobrarà
              </code>
              ) i un model fent servir la primera persona del plural «escrivim
              al servei d'assistència» (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                escrivim
              </code>
              ) en lloc de l'imperatiu «escriu» (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                escriu
              </code>
              ). El codi caça allò que pot identificar, però l'ull humà
              continua sent cabdal per a garantir la precisió i
              l'autenticitat.
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
              En equips reals d'IA i localització, el temps és el recurs
              més valuós possible.
            </p>
            <p>
              Si poses traductors sènior a caçar dobles espais, variables
              trencades o errors obvis de glossari un per un, esgotes el seu
              temps i la seva salut mental. D'altra banda, si confies
              cegament en l'automatització total, una patinada gramatical o
              una frase antinatural poden acabar a la pantalla d'un usuari
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
          <div className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-violet-300 font-semibold">
              {lang === "en"
                ? "Scope, Honest Limits & Authorship"
                : lang === "es"
                ? "Alcance, límites razonables y autoría"
                : "L'abast, límits raonables i autoria"}
            </div>
            {lang === "en" && (
              <>
                <p className="text-xs md:text-sm text-slate-300">
                  NovaChat is a small, reproducible{" "}
                  <strong className="text-white">method demo</strong>, not a
                  massive market benchmark. I deliberately kept it to 12
                  carefully targeted bilingual cases (6 runs: 1 baseline + 5
                  grounded) so I could personally audit 100% of the 72 answers.
                  Because I wrote the questions, rules, and calibration traps
                  myself, treat the 20/20 judge score as calibration-set sanity
                  rather than a held-out benchmark.
                </p>
                <p className="text-xs text-slate-400 pt-1 border-t border-navy-800">
                  <strong className="text-slate-200">Authorship note:</strong> I
                  designed the MQM audit, test cases, adversarial traps,
                  bilingual glossary, judge rubric, and Python QA checks, and
                  audited 100% of model replies; AI coding assistance helped
                  accelerate the Next.js web interface scaffolding.
                </p>
              </>
            )}
            {lang === "es" && (
              <>
                <p className="text-xs md:text-sm text-slate-300">
                  NovaChat es una{" "}
                  <strong className="text-white">demostración de método</strong>{" "}
                  pequeña y reproducible, no un <em>benchmark</em> masivo de
                  mercado. Lo limité deliberadamente a 12 casos bilingües muy
                  medidos (6 ejecuciones: 1 base + 5 con contexto) para poder
                  auditar personalmente el 100 % de las 72 respuestas. Como las
                  preguntas, las reglas y las trampas de calibración las escribí
                  yo mismo, toma el 20/20 del juez como acuerdo en el conjunto
                  de calibración y no como un ranking universal.
                </p>
                <p className="text-xs text-slate-400 pt-1 border-t border-navy-800">
                  <strong className="text-slate-200">Nota de autoría:</strong>{" "}
                  Diseñé la auditoría MQM, los casos de prueba, las trampas
                  adversariales, el glosario bilingüe, la rúbrica del juez y las
                  reglas de Python, y audité el 100 % de las respuestas; utilicé
                  asistencia de IA de código para acelerar el montaje de la
                  interfaz web en Next.js.
                </p>
              </>
            )}
            {lang === "ca" && (
              <>
                <p className="text-xs md:text-sm text-slate-300">
                  NovaChat és una{" "}
                  <strong className="text-white">demostració de mètode</strong>{" "}
                  petita i reproduïble, no un <em>benchmark</em> massiu de
                  mercat. El vaig limitar deliberadament a 12 casos bilingües ben
                  escollits (6 execucions: 1 base + 5 amb context) per poder
                  auditar personalment el 100 % de les 72 respostes. Com que les
                  preguntes, les regles i les trampes de calibració les vaig
                  escriure jo mateix, pren-te el 20/20 del jutge com a acord al
                  conjunt de calibració i no com un rànquing universal.
                </p>
                <p className="text-xs text-slate-400 pt-1 border-t border-navy-800">
                  <strong className="text-slate-200">Nota d'autoria:</strong>{" "}
                  Vaig dissenyar l'auditoria MQM, els casos de prova, les
                  trampes adversarials, el glossari bilingüe, la rúbrica del
                  jutge i les regles de Python, i vaig auditar el 100 % de les
                  respostes; vaig fer servir assistència d'IA de codi per
                  accelerar l'estructura de la interfície web en Next.js.
                </p>
              </>
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
                  I'm <strong className="text-white">Eduard Aliod</strong>,
                  born and raised in Reus (Catalonia). A passionate musician and
                  full-time restless language geek who realized two months ago
                  that he wasn't geeky enough and that scrolling through
                  Netflix wasn't as fun as scrolling through syntax errors.
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
                  Soc l'
                  <strong className="text-white">Eduard Aliod</strong>, nascut i
                  criat a Reus (Catalunya). Músic apassionat i enderiat de la
                  llengua a temps complet, que fa un parell de mesos es va
                  adonar que encara no era prou friki i que vagarejar per
                  Netflix no molava tant com vagarejar entre errors de sintaxi.
                  Faig de pont entre la localització clàssica (subtitulació,
                  interfícies, adaptació musical), la transcreació i
                  l'avaluació d'IA (LQA, auditoria,{" "}
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