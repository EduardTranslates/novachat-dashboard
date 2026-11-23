"use client";

import React from "react";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Compass,
  Lightbulb,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import type { TabId } from "@/types/novachat";

interface ProjectStoryTabProps {
  onNavigateTab: (tab: TabId) => void;
}

export function ProjectStoryTab({ onNavigateTab }: ProjectStoryTabProps) {
  const skills = [
    "Bilingual LQA (ES/CA)",
    "MQM Framework",
    "AI Rubric & Eval Design",
    "LLM-as-a-Judge Calibration",
    "Python Automation",
    "Promptfoo",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-navy-800 via-navy-850 to-navy-900 p-6 md:p-8 shadow-xl shadow-black/20">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <BookOpen className="h-3.5 w-3.5" />
            Project Story · 30-Second Read
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            100% free of technobabble or ITmidating charts.
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Just the story of why I built a fake software company and tricked
            four AIs in Spanish and Catalan. Thus begins the tale of how I
            regained the ability to write in prose after all that{" "}
            <code className="px-1.5 py-0.5 rounded bg-navy-950 border border-navy-700 font-mono text-xs text-emerald-300">
              print(&quot;code&quot;)
            </code>
            .
          </p>
        </div>
      </section>

      {/* Section 1: The Goal */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6 md:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl border border-sky-500/30 bg-sky-500/10 flex items-center justify-center text-sky-300 shrink-0 mt-0.5">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-sky-400">
              01 · Why NovaChat exists
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              The Goal
            </h3>
          </div>
        </div>

        <div className="space-y-3.5 text-sm md:text-[15px] text-slate-300 leading-relaxed">
          <p>
            Everyone talks about AI replacing translators. Personally, I was
            much more interested in opening the hood and seeing where AI
            actually breaks.
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
            nerd with a DIY mindset would do: I wrestled with Python, invented a
            fictional SaaS company (<strong className="text-white">NovaChat</strong>
            ), built a real testing lab from scratch, and watched four real AI
            models play the weirdest Parcheesi game ever.
          </p>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6 md:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl border border-indigo-400/30 bg-indigo-500/10 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
            <Wrench className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-300">
              02 · No jargon, 3 simple steps
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              How It Works
            </h3>
          </div>
        </div>

        <p className="text-sm md:text-[15px] text-slate-300 leading-relaxed">
          I like to picture it as a three-layer chocolate cake, but let&apos;s
          think of it as a quality-control conveyor belt for a multilingual
          customer support bot:
        </p>

        <ol className="space-y-3">
          <li className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 flex items-start gap-3.5">
            <span className="h-6 w-6 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">
                The Checklist (for robot work):
              </strong>{" "}
              First, a small Python script checks the mechanical stuff humankind
              shouldn&apos;t waste time on: broken code variables, buttons that
              overflow on mobile screens, missing Spanish{" "}
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
              Spanish and Catalan. First <em>blind</em> (no company manual) and
              then <em>grounded</em> (with real user menus and refund rules),
              plus a few cheeky trick questions to see if they&apos;d fall for
              them (and fancy myself smarter than AI).
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
              slipped past it, and how much time we have left until chatbots
              enslave us.
            </div>
          </li>
        </ol>
      </section>

      {/* Section 3: What Happened */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6 md:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300">
              03 · The key findings
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              What Happened
            </h3>
          </div>
        </div>

        <ul className="space-y-3 text-sm md:text-[15px] text-slate-300 leading-relaxed">
          <li className="rounded-xl border border-rose-500/25 bg-rose-500/[0.05] p-4">
            <strong className="text-rose-200">
              Without a manual, AIs become SmartA(I)sses: wildly confident
              liars.
            </strong>{" "}
            Left on its own, the chatbot cheerfully invented a €12 Pro plan,
            promised a non-existent 50% student discount, and exiled users to
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
              Language, however, is a much trickier beast.
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
            still studying for its 3rd-grade language tests.
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
      </section>

      {/* Section 4: Why It Matters */}
      <section className="rounded-2xl border border-navy-700 bg-navy-800/90 p-6 md:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-300">
              04 · Because time matters
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              Why It Matters
            </h3>
          </div>
        </div>

        <div className="space-y-3.5 text-sm md:text-[15px] text-slate-300 leading-relaxed">
          <p>
            In real localization and AI teams, time is the scarcest resource on
            the table.
          </p>
          <p>
            If you ask senior linguists to hunt for double spaces, broken
            placeholders, or obvious glossary mistakes one by one, you burn
            their time and their sanity. On the flip side, if you trust full
            automation blindly, subtle grammar slips and unnatural phrasing
            might end up in front of an already doubtful user.
          </p>
          <p className="rounded-xl border border-sky-500/25 bg-sky-500/[0.06] p-4 text-slate-100 font-medium">
            NovaChat is my blueprint for the sweet spot in between: automate the
            predictable and save our brainpower for nuance, culture, and
            judgment.
          </p>
        </div>
      </section>

      {/* Footer Card: Honest Limits & The Human Behind It */}
      <section className="rounded-2xl border border-navy-700 bg-navy-850/95 p-6 md:p-7 space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <User className="h-4 w-4 text-sky-400" />
          Honest Limits &amp; The Human Behind It
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300 leading-relaxed">
          <div className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 space-y-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-violet-300 font-semibold">
              Scope &amp; Honest Limits
            </div>
            <p className="text-xs md:text-sm text-slate-300">
              NovaChat is a small, reproducible{" "}
              <strong className="text-white">method demo</strong>, not a massive
              market benchmark. I deliberately kept it to 12 carefully targeted
              bilingual cases (one per major risk area) so I could personally
              audit 100% of the answers. Because I wrote the questions, rules,
              and trick cases myself, treat the perfect scores as proof of
              method rather than a universal ranking of these models.
            </p>
          </div>

          <div className="rounded-xl border border-navy-700/80 bg-navy-900/60 p-4 space-y-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-sky-300 font-semibold">
              Who built this
            </div>
            <p className="text-xs md:text-sm text-slate-300">
              I&apos;m <strong className="text-white">Eduard Aliod</strong>,
              born and raised in Reus (Catalonia). A passionate musician and
              full-time restless language geek who realized two months ago that
              he wasn&apos;t geeky enough and that scrolling through Netflix
              wasn&apos;t as fun as scrolling through syntax errors. I bridge
              classic localization (subtitling, UI, musical adaptation) with
              transcreation and AI evaluation (LQA, auditing, red-teaming,
              multimodal).
            </p>
          </div>
        </div>

        {/* Skills in action */}
        <div className="pt-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Skills in action
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
            Want to inspect the 28 MQM defects, 72 recorded replies, and 20/20
            judge calibration?
          </p>
          <button
            onClick={() => {
              onNavigateTab("overview");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-500/45 bg-sky-500/20 hover:bg-sky-500/30 px-4 py-2.5 text-xs sm:text-sm font-semibold text-sky-100 transition-colors shrink-0"
          >
            Ready for the numbers? Explore the Executive Overview
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
