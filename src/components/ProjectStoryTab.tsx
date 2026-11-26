"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Compass,
  ExternalLink,
  Info,
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

  const repoReadmeUrl =
    "https://github.com/EduardTranslates/novachat-es-ca-lqa#readme";

  const skills = [
    "Bilingual LQA (ES/CA)",
    "MQM Framework",
    "AI Rubric & Eval Design",
    "LLM-as-a-Judge Calibration",
    "Python Automation",
    "Promptfoo",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Hero Banner */}
      <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-navy-800 via-navy-850 to-emerald-950/20 p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200">
            <BookOpen className="h-3.5 w-3.5" />
            {lang === "en"
              ? "Project Story · 2-Minute Read"
              : lang === "es"
              ? "Historia del proyecto · Lectura en 2 minutos"
              : "Història del projecte · Lectura en 2 minuts"}
          </div>

          {/* Language Selector */}
          <div
            className="inline-flex items-center gap-1 rounded-xl border border-navy-700 bg-navy-900/90 p-1"
            role="group"
            aria-label="Project story language"
          >
            <Languages className="h-3.5 w-3.5 text-slate-400 ml-2 mr-1" />
            {(
              [
                { id: "en", label: "EN" },
                { id: "es", label: "ES" },
                { id: "ca", label: "CA" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLang(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  lang === opt.id
                    ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
          {lang === "en"
            ? "100% free of technobabble or ITmidating charts."
            : lang === "es"
            ? "100 % libre de paja técnica y dIAgramas."
            : "100 % lliure de palla tècnica i dIAgrames."}
        </h2>

        {lang === "en" && (
          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
            Just the story of why I built a fake software company and tested
            four AIs in Spanish and Catalan. Thus begins the tale of how I
            regained the ability to write in prose after all that{" "}
            <code className="px-1.5 py-0.5 rounded bg-navy-950 border border-navy-700 text-emerald-300 text-xs">
              print(&quot;code&quot;)
            </code>
            .
          </p>
        )}
        {lang === "es" && (
          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
            O por qué me inventé una empresa de software y puse a prueba cuatro
            IAs en español y catalán. Un relato sobre recuperar la capacidad de
            escribir en prosa después de tanto{" "}
            <code className="px-1.5 py-0.5 rounded bg-navy-950 border border-navy-700 text-emerald-300 text-xs">
              print(&quot;código&quot;)
            </code>
            .
          </p>
        )}
        {lang === "ca" && (
          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
            O per què em vaig inventar una empresa de programari i vaig posar a
            prova quatre IA en castellà i català. Un relat sobre recuperar la
            capacitat d&apos;escriure en prosa després de tant{" "}
            <code className="px-1.5 py-0.5 rounded bg-navy-950 border border-navy-700 text-emerald-300 text-xs">
              print(&quot;codi&quot;)
            </code>
            .
          </p>
        )}

        {/* Reader Note with Hyperlinked README */}
        <div className="rounded-xl border border-navy-700/90 bg-navy-900/75 px-4 py-3 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
          <Info className="h-4 w-4 text-emerald-300 shrink-0 mt-0.5" />
          {lang === "en" && (
            <p>
              <strong className="text-slate-100">Reader note:</strong> This
              walkthrough is written in plain, accessible language for all
              readers—and doubles as a live sample of EN / ES / CA
              transcreation. For the full methodology, metrics, and raw audit
              data, check the{" "}
              <button
                type="button"
                onClick={() => {
                  onNavigateTab("overview");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200 font-medium"
              >
                Executive Overview
              </button>{" "}
              or{" "}
              <a
                href={repoReadmeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200 font-medium inline-flex items-center gap-1"
              >
                click here
                <ExternalLink className="h-3 w-3" />
              </a>{" "}
              to read the technical documentation on GitHub.
            </p>
          )}
          {lang === "es" && (
            <p>
              <strong className="text-slate-100">Nota al lector:</strong> Este
              relato está escrito en un lenguaje cercano y divulgativo para todo
              tipo de lectores —y sirve también como muestra en vivo de
              transcreación en EN / ES / CA. Para ver la metodología completa,
              las métricas y los datos brutos de la auditoría, consulta el{" "}
              <button
                type="button"
                onClick={() => {
                  onNavigateTab("overview");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200 font-medium"
              >
                Resumen Ejecutivo
              </button>{" "}
              o{" "}
              <a
                href={repoReadmeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200 font-medium inline-flex items-center gap-1"
              >
                haz clic aquí
                <ExternalLink className="h-3 w-3" />
              </a>{" "}
              para leer la documentación técnica en GitHub.
            </p>
          )}
          {lang === "ca" && (
            <p>
              <strong className="text-slate-100">Nota al lector:</strong> Aquest
              relat està escrit en un llenguatge planer i divulgatiu per a tota
              mena de lectors —i serveix també com a mostra en directe de
              transcreació en EN / ES / CA. Per veure la metodologia completa,
              les mètriques i les dades brutes de l&apos;auditoria, consulta el{" "}
              <button
                type="button"
                onClick={() => {
                  onNavigateTab("overview");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200 font-medium"
              >
                Resum Executiu
              </button>{" "}
              o{" "}
              <a
                href={repoReadmeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200 font-medium inline-flex items-center gap-1"
              >
                fes clic aquí
                <ExternalLink className="h-3 w-3" />
              </a>{" "}
              per llegir la documentació tècnica a GitHub.
            </p>
          )}
        </div>
      </section>

      {/* Section 1: When It Began */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6 md:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl border border-sky-500/30 bg-sky-500/10 flex items-center justify-center text-sky-300 shrink-0 mt-0.5">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-sky-300">
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
              huge cabinets of user manuals might make them more sufferable
              than some humans in their field, but it won&apos;t magically make
              them speak good Spanish or Catalan — a language that knows
              interference (and <em>intraference</em>) well enough.
            </p>
            <p>
              So instead of just{" "}
              <strong className="text-white">LinkedRantIn&apos;</strong> about
              it, I did what any self-respecting{" "}
              <s className="text-slate-500">language</s> nerd with a DIY
              mindset would do: I wrestled with Python, invented a fictional
              SaaS company (<strong className="text-white">NovaChat</strong>),
              built a real testing lab, and watched four real AI models play the
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
              haga más tolerable que algunos humanos en su sector, pero no va a
              conseguir que, por arte de magia, hable con naturalidad español o
              catalán —una lengua que conoce la interferencia (y la{" "}
              <em>intraferencia</em>) de sobra.
            </p>
            <p>
              Así que, en lugar de limitarme a los{" "}
              <strong className="text-white">LinkedInproperios</strong>, hice lo
              único que un verdadero{" "}
              <s className="text-slate-500">lingüista</s> friki con iniciativa
              podía hacer: batallé con Python, me inventé una empresa SaaS
              ficticia (<strong className="text-white">NovaChat</strong>), monté
              un laboratorio de pruebas real y puse a cuatro modelos reales de IA
              a jugar la partida de parchís más esperpéntica posible.
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
              més tolerable que alguns humans al seu sector, però no aconseguirà
              per art de màgia que parli amb naturalitat ni castellà ni català
              —una llengua que coneix la interferència (i la{" "}
              <em>intraferència</em>) amb escreix.
            </p>
            <p>
              Així que, en comptes de limitar-me als{" "}
              <strong className="text-white">LinkedInproperis</strong>, vaig fer
              l&apos;única cosa que un autèntic{" "}
              <s className="text-slate-500">lingüista</s> friki amb iniciativa
              podia fer: vaig batallar amb Python, em vaig inventar una empresa
              SaaS fictícia (<strong className="text-white">NovaChat</strong>),
              vaig muntar un laboratori de proves real i vaig mirar com quatre
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

        {lang === "en" && (
          <p className="text-sm md:text-[15px] text-slate-300 leading-relaxed">
            I like to picture it as a three-layer chocolate cake, or better yet,
            a three-stage quality-control conveyor belt for a multilingual
            customer support bot — which I put through 6 runs across four AI
            models using everyday questions and a few cheeky tricks of my own:
          </p>
        )}
        {lang === "es" && (
          <p className="text-sm md:text-[15px] text-slate-300 leading-relaxed">
            A mí me gusta imaginarlo como una tarta tres chocolates, o mejor aún,
            como una cinta de control de calidad en tres fases para un bot
            multilingüe de atención al cliente —que puse a prueba en 6 rondas
            con cuatro modelos de IA usando preguntas frecuentes y alguna que
            otra triquiñuela de un servidor:
          </p>
        )}
        {lang === "ca" && (
          <p className="text-sm md:text-[15px] text-slate-300 leading-relaxed">
            A mi m&apos;agrada imaginar-m&apos;ho com un pastís de tres
            xocolates, o encara millor, com una cinta de control de qualitat en
            tres fases per a un bot multilingüe d&apos;atenció al client —que
            vaig posar a prova en 6 tandes amb quatre models d&apos;IA fent
            servir preguntes freqüents i alguns tripijocs d&apos;un servidor:
          </p>
        )}

        {lang === "en" && (
          <ol className="space-y-3">
            <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">
                  Layer 1 — The Checklist (robot work):
                </strong>{" "}
                A small Python script checks the mechanical stuff humankind
                shouldn&apos;t waste time on: broken code variables, UI text
                that overflows mobile screens, approved glossary terms, missing
                Spanish{" "}
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
                  Layer 2 — The Stress Test (with an AI referee):
                </strong>{" "}
                Next, I set up a realistic scenario with four different models
                facing real customer questions and a few cheeky tricks of my
                own.
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
                guessing — catching subtle grammar slips, unnatural phrasing,
                and extrapolations that need a human Product Owner&apos;s call (
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-violet-200 text-xs">
                  QUERY
                </code>
                ), while measuring how much time we have left until an army of
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
                  Capa 1 — El checklist (el trabajo robótico):
                </strong>{" "}
                Un pequeño script de Python revisa lo mecánico en lo que la
                humanidad no debería perder el tiempo: variables de código
                rotas, textos de interfaz que se desbordan en móvil, términos de
                glosario, signos de apertura{" "}
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
                  Capa 2 — La prueba de estrés (con una IA como árbitro):
                </strong>{" "}
                Después, planteé un escenario realista con cuatro modelos
                diferentes enfrentándose a dudas reales de un cliente y a las
                triquiñuelas de un servidor.
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
                falta de naturalidad y extrapolaciones que requieren consultar
                al Product Owner (
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-violet-200 text-xs">
                  QUERY
                </code>
                ), mientras medía cuánto tiempo nos queda hasta que un ejército
                de chatbots nos esclavice.
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
                  Capa 1 — El checklist (la feina robòtica):
                </strong>{" "}
                Un petit script de Python revisa tot allò mecànic en què la
                humanitat no hauria de perdre el temps: variables de codi
                trencades, textos d&apos;interfície que es desborden al mòbil,
                termes de glossari, signes d&apos;obertura{" "}
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
                  Capa 2 — La prova d&apos;estrès (amb una IA com a àrbitre):
                </strong>{" "}
                Després, vaig plantejar un escenari realista amb quatre models
                diferents enfrontant-se a dubtes reals d&apos;un client i als
                tripijocs d&apos;un servidor.
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
                Finalment, em vaig asseure a llegir jo mateix les 72 respostes,
                en un intent de justificar els meus estudis de lingüística.
                Sense saltar-me res, sense suposar res —detectant relliscades
                subtils de gramàtica, manca de naturalitat i extrapolacions que
                cal consultar al Product Owner (
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-violet-200 text-xs">
                  QUERY
                </code>
                ); calculant quant de temps ens queda fins que ens esclavitzi
                un exèrcit de xatbots.
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

            <li className="rounded-xl border border-indigo-400/25 bg-indigo-500/[0.06] p-4 space-y-2">
              <p>
                <strong className="text-indigo-200">
                  &ldquo;Large Language Model&rdquo; doesn&apos;t necessarily
                  mean &ldquo;Precise Language Model.&rdquo;
                </strong>{" "}
                Even with the right facts, three distinct problems kept
                surfacing:
              </p>
              <p>
                <strong className="text-white">First,</strong> Spanish kept
                bleeding into Catalan—mixing Spanish menu names into Catalan
                sentences.
              </p>
              <p>
                <strong className="text-white">Second,</strong> Spanish-specific
                forms (Castilianisms like{" "}
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-indigo-200 text-xs">
                  reembolsen
                </code>
                ) appeared where Catalan was required.
              </p>
              <p>
                <strong className="text-white">Third,</strong> models clung to
                Catalan diacritics (
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-indigo-200 text-xs">
                  vés
                </code>
                ) abolished in the 2016 IEC spelling reform—Gemini was still in
                language school when that rule changed.
              </p>
            </li>

            <li className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
              <strong className="text-amber-200">
                The grand finale belonged to human review.
              </strong>{" "}
              Two sneaky Catalan grammar errors walked right past all automated
              checks: a clitic pronoun twisting the wrong way (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                se&apos;te cobrarà
              </code>{" "}
              when it should be{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                se&apos;t cobrarà
              </code>
              ), and a model defaulting to first-person plural—telling users
              &ldquo;we&apos;re writing to support you&rdquo; (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                escrivim
              </code>
              ) instead of commanding them to do it themselves (
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
                Con los datos, las alucinaciones críticas desaparecieron.
              </strong>{" "}
              En cuanto proporcioné a los modelos las reglas reales y el mapa de
              menús, las alucinaciones factuales críticas bajaron de 8 en la
              ejecución base a 0 en las 5 ejecuciones con contexto sobre 4
              modelos.
            </li>

            <li className="rounded-xl border border-indigo-400/25 bg-indigo-500/[0.06] p-4 space-y-2">
              <p>
                <strong className="text-indigo-200">
                  «Modelo Extenso de Lenguaje» no implica necesariamente
                  «Modelo Exacto de Lenguaje».
                </strong>{" "}
                Incluso con los datos correctos, seguían apareciendo tres
                problemas evidentes:
              </p>
              <p>
                <strong className="text-white">Primero,</strong> se colaban
                términos en español en la versión en catalán, mezclando nombres
                de menú en español dentro de frases en catalán.
              </p>
              <p>
                <strong className="text-white">Segundo,</strong> se colaban
                castellanismos (como{" "}
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-indigo-200 text-xs">
                  reembolsen
                </code>
                ) donde tocaba escribir en catalán.
              </p>
              <p>
                <strong className="text-white">Tercero,</strong> los modelos se
                aferraban a acentos diacríticos (
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-indigo-200 text-xs">
                  vés
                </code>
                ) abolidos en la reforma ortográfica del IEC de 2016 —cuando
                Gemini todavía estaba en la escuela de idiomas.
              </p>
            </li>

            <li className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
              <strong className="text-amber-200">
                El broche de oro le tocó a la revisión humana.
              </strong>{" "}
              Dos furtivos errores de gramática catalana consiguieron burlar
              todo el código: un pronombre clítico retorcido al revés (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                se&apos;te cobrarà
              </code>{" "}
              cuando debería ser{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                se&apos;t cobrarà
              </code>
              ) y un modelo tirando de primera persona del plural —diciéndoles a
              los usuarios «escribimos a soporte» (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                escrivim
              </code>
              ) en lugar de darles la orden de hacerlo ellos mismos (
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
                Sense manual, les IA tendeixen a la cunyadIA: s&apos;equivoquen
                sense vergonya ni recança.
              </strong>{" "}
              A l&apos;execució sense guiatge de Flash-Lite, el xatbot
              s&apos;inventava de bon grat un pla Pro de 12 €, prometia un fals
              descompte del 50 % per a estudiants o desterrava els usuaris al
              país de Mai Menús (8 al·lucinacions crítiques en 12 preguntes).
            </li>

            <li className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4">
              <strong className="text-emerald-200">
                Amb les dades, les al·lucinacions crítiques van desaparèixer.
              </strong>{" "}
              Tan bon punt vaig passar als models les regles reals i el mapa de
              menús, les al·lucinacions factuals crítiques van baixar de 8 a la
              prova base fins a 0 en totes 5 execucions amb context sobre 4
              models.
            </li>

            <li className="rounded-xl border border-indigo-400/25 bg-indigo-500/[0.06] p-4 space-y-2">
              <p>
                <strong className="text-indigo-200">
                  «Model de Llenguatge Extens» no implica necessàriament «Model
                  de Llenguatge Excels».
                </strong>{" "}
                Fins i tot amb les dades correctes, continuaven apareixent tres
                problemes evidents:
              </p>
              <p>
                <strong className="text-white">Primer,</strong> es colaven
                termes en castellà a la versió en català, barrejant noms de
                menú en castellà enmig de frases en català.
              </p>
              <p>
                <strong className="text-white">Segon,</strong> es colaven
                castellanismes (com{" "}
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-indigo-200 text-xs">
                  reembolsen
                </code>
                ) allà on tocava escriure en català.
              </p>
              <p>
                <strong className="text-white">Tercer,</strong> els models
                s&apos;arrapaven a accents diacrítics (
                <code className="px-1.5 py-0.5 rounded bg-navy-950 text-indigo-200 text-xs">
                  vés
                </code>
                ) abolits en la reforma ortogràfica de l&apos;IEC del 2016 —quan
                Gemini encara anava a l&apos;escola d&apos;idiomes.
              </p>
            </li>

            <li className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
              <strong className="text-amber-200">
                La revisió humana hi va posar la cirereta.
              </strong>{" "}
              Dos errors furtius de gramàtica catalana van eludir tot el codi:
              un pronom feble regirat (
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-amber-200 text-xs">
                se&apos;te cobrarà
              </code>{" "}
              quan hauria de ser{" "}
              <code className="px-1.5 py-0.5 rounded bg-navy-950 text-emerald-200 text-xs">
                se&apos;t cobrarà
              </code>
              ) i un model tirant de primera persona del plural —dient als
              usuaris «escrivim al servei d&apos;assistència» en lloc de
              donar-los l&apos;ordre de fer-ho ells mateixos (
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
              the predictable and humanize the unpredictable.
            </p>
          </div>
        )}

        {lang === "es" && (
          <div className="space-y-3.5 text-sm md:text-[15px] text-slate-300 leading-relaxed">
            <p>
              En equipos reales de IA y localización, el tiempo es el recurso
              más valioso.
            </p>
            <p>
              Si pones a traductores sénior a cazar dobles espacios, variables
              rotas o errores de glosario uno por uno, acabas con su tiempo y su
              salud mental. Por otro lado, si confías ciegamente en la
              automatización total, un usuario que ya venía con dudas de antes
              puede acabar con un despiste gramatical o una frase antinatural en
              su pantalla.
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
              més valuós.
            </p>
            <p>
              Si poses traductors sènior a caçar dobles espais, variables
              trencades o errors de glossari un per un, esgotes el seu temps i
              la seva salut mental. D&apos;altra banda, si confies cegament en
              l&apos;automatització total, un usuari que ja venia amb dubtes
              abans pot acabar amb una patinada gramatical o una frase
              antinatural a la seva pantalla.
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
                  massive market benchmark. I chose 12 cases precisely because I
                  wanted to personally audit 100% of the 72 answers. Quality
                  first, quantity later. And since I wrote the questions, rules,
                  and traps myself, treat the scores as a proof of method rather
                  than an indisputable model ranking.
                </p>
                <p className="text-xs text-slate-400 pt-1 border-t border-navy-800">
                  <strong className="text-slate-200">Authorship note:</strong> I
                  designed the MQM audit, test cases, adversarial traps,
                  bilingual glossary, judge rubric, and Python checks, and
                  audited 100% of model replies; I used AI coding tools to
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
                  mercado. Elegí 12 casos precisamente porque quería auditar
                  personalmente el 100 % de las 72 respuestas. Calidad primero,
                  cantidad después. Y como las preguntas, las reglas y las
                  trampas las escribí yo mismo, tómate las puntuaciones como una
                  prueba de método y no como un ranking de modelos indiscutible.
                </p>
                <p className="text-xs text-slate-400 pt-1 border-t border-navy-800">
                  <strong className="text-slate-200">Nota de autoría:</strong>{" "}
                  Diseñé la auditoría MQM, los casos de prueba, las trampas
                  adversarias, el glosario bilingüe, la rúbrica del juez y las
                  comprobaciones en Python, y audité el 100 % de las respuestas;
                  utilicé herramientas de IA como apoyo a la programación para
                  acelerar el montaje de la interfaz web en Next.js.
                </p>
              </>
            )}
            {lang === "ca" && (
              <>
                <p className="text-xs md:text-sm text-slate-300">
                  NovaChat és una{" "}
                  <strong className="text-white">demostració de mètode</strong>{" "}
                  petita i reproduïble, no un <em>benchmark</em> massiu de
                  mercat. Vaig triar 12 casos precisament perquè volia auditar
                  personalment les 72 respostes. Qualitat primer, quantitat
                  després. I com que les preguntes, les regles i les trampes les
                  vaig escriure jo mateix, pren-te les puntuacions com una prova
                  de mètode i no com un rànquing de models indiscutible.
                </p>
                <p className="text-xs text-slate-400 pt-1 border-t border-navy-800">
                  <strong className="text-slate-200">Nota d&apos;autoria:</strong>{" "}
                  Vaig dissenyar l&apos;auditoria MQM, els casos de prova, les
                  trampes adversàries, el glossari bilingüe, la rúbrica del
                  jutge i les comprovacions en Python, i vaig auditar el 100 %
                  de les respostes; vaig fer servir eines d&apos;IA com a suport
                  a la programació per accelerar l&apos;estructura de la
                  interfície web en Next.js.
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
                  nacido y criado en Reus (Cataluña). Músico apasionado e
                  inveterado friki lingüístico, que hace un par de meses se dio
                  cuenta de que todavía no era lo bastante friki y de que vagar
                  sin rumbo por Netflix no molaba tanto como vagar entre errores
                  de sintaxis. Tiendo puentes entre la localización clásica
                  (subtitulación, interfaces de usuario, adaptación musical), la
                  transcreación y la evaluación de IA (LQA, auditorías,{" "}
                  <em>red-teaming</em>, multimodal).
                </p>
              )}
              {lang === "ca" && (
                <p className="text-xs md:text-sm text-slate-300">
                  Soc l&apos;
                  <strong className="text-white">Eduard Aliod</strong>, nascut i
                  criat a Reus (Catalunya). Músic apassionat i friki lingüístic
                  inveterat, que fa un parell de mesos es va adonar que encara
                  no era prou friki i que vagarejar per Netflix no molava tant
                  com vagarejar entre errors de sintaxi. Faig de pont entre la
                  localització clàssica (subtitulació, interfícies, adaptació
                  musical), la transcreació i l&apos;avaluació d&apos;IA (LQA,
                  auditoria, <em>red-teaming</em>, multimodal).
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