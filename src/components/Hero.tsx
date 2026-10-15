"use client";

import React, { useState, useRef } from "react";
import Car from "./Car";
import StatCard from "./StatCard";
import { StatItem } from "@/types";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const STATS_DATA: StatItem[] = [
  {
    id: "box1",
    value: "58%",
    label: "Increase in pick up point use",
    sublabel: "Logistics Optimization",
  },
  {
    id: "box2",
    value: "23%",
    label: "Decreased in customer phone calls",
    sublabel: "Customer Self-Service",
  },
  {
    id: "box3",
    value: "27%",
    label: "Increase in pick up point use",
    sublabel: "Regional Adoption",
  },
  {
    id: "box4",
    value: "40%",
    label: "Decreased in customer phone calls",
    sublabel: "Friction Reduction",
  },
];

const WELCOME_LETTERS = ["W", "E", "L", "C", "O", "M", "E"];
const ITZ_LETTERS = ["I", "T", "Z"];
const FIZZ_LETTERS = ["F", "I", "Z", "Z"];

export const Hero: React.FC = () => {
  const [carVariant, setCarVariant] = useState<"mclaren" | "side-view">("mclaren");
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            "header",
            "#road",
            "#trail",
            "#car",
            "#car-mover",
            ".value-letter",
            ".text-box",
            "footer",
          ],
          { opacity: 1, x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1 }
        );
        const trailEl = document.getElementById("trail");
        if (trailEl) trailEl.style.width = "100%";
        return;
      }

      // 1. Establish initial animation states to prevent any FOUC
      gsap.set("header", { opacity: 0, y: -20 });
      gsap.set("#road", { opacity: 0, scaleY: 0.88 });
      gsap.set("#car", { opacity: 0, x: -40, scale: 0.92 });
      gsap.set("#car-mover", { x: 0 });
      gsap.set(".value-letter", { opacity: 0 });
      gsap.set(".text-box", { opacity: 0, y: 24 });
      gsap.set("footer", { opacity: 0 });

      const trailEl = document.getElementById("trail");
      if (trailEl) trailEl.style.width = "0px";

      // 2. High-performance, zero-layout-thrashing letter offset cache
      // Precomputed on mount and refreshed on every ScrollTrigger resize
      let letterOffsets: number[] = [];

      const measureLetterPositions = () => {
        const roadEl = document.getElementById("road");
        const moverEl = document.getElementById("car-mover");
        if (!roadEl || !moverEl) return;

        const letters = roadEl.querySelectorAll<HTMLElement>(".value-letter");
        if (letters.length === 0) return;

        const roadWidth = roadEl.clientWidth;
        const carWidth = moverEl.offsetWidth;
        const startOffset =
          window.innerWidth < 640 ? 8 : window.innerWidth < 768 ? 16 : 24;
        const endPadding = window.innerWidth < 640 ? 12 : 24;
        const maxTravel = Math.max(0, roadWidth - carWidth - startOffset - endPadding);

        // Leading edge starts at startOffset + carWidth * 0.8 and sweeps maxTravel
        const initialLeadingEdge = startOffset + carWidth * 0.8;
        // Calibrated reveal runway: reveals all 14 letters in sequence across the active travel span
        const activeSpan = Math.max(100, maxTravel * 0.65);

        letterOffsets = Array.from(letters).map((_, i) => {
          return initialLeadingEdge + 12 + (i / Math.max(1, letters.length - 1)) * activeSpan;
        });
      };

      // Fast update loop: operates on precalculated numbers without triggering DOM reflows
      const updateScrollReveals = (progress?: number) => {
        const roadEl = document.getElementById("road");
        const moverEl = document.getElementById("car-mover");
        const trail = document.getElementById("trail");
        if (!roadEl || !moverEl || !trail) return;

        const roadRect = roadEl.getBoundingClientRect();
        const moverRect = moverEl.getBoundingClientRect();

        // Car progress position along the road (car mid-section where trail emerges)
        const carProgressX = moverRect.left - roadRect.left + moverRect.width * 0.45;
        const clampedTrailWidth = Math.max(0, carProgressX);

        // Synchronize green trail width directly with the car position
        trail.style.width = `${clampedTrailWidth}px`;

        const letters = roadEl.querySelectorAll<HTMLElement>(".value-letter");

        // Edge case handling for initial or zero scroll
        if (progress !== undefined && progress <= 0.005) {
          trail.style.width = "0px";
          letters.forEach((l) => {
            if (l.style.opacity !== "0") l.style.opacity = "0";
          });
          return;
        }

        if (progress !== undefined && progress >= 0.995) {
          letters.forEach((l) => {
            if (l.style.opacity !== "1") l.style.opacity = "1";
          });
          return;
        }

        // Smooth progressive letter-by-letter reveal: calibrated fade window across car passage
        const carLeadingEdgeX = moverRect.left - roadRect.left + moverRect.width * 0.8;
        const fadeWindow = 28; // 28px smooth gradient transition per letter

        letters.forEach((letter, i) => {
          const targetOffset = letterOffsets[i];
          if (targetOffset !== undefined) {
            const delta = carLeadingEdgeX - targetOffset;
            let targetOpacity: number;
            if (delta <= 0) {
              targetOpacity = 0;
            } else if (delta >= fadeWindow) {
              targetOpacity = 1;
            } else {
              targetOpacity = delta / fadeWindow;
            }

            const formattedOpacity =
              targetOpacity === 0 ? "0" : targetOpacity === 1 ? "1" : targetOpacity.toFixed(2);
            if (letter.style.opacity !== formattedOpacity) {
              letter.style.opacity = formattedOpacity;
            }
          }
        });
      };

      // Refresh measurements once web fonts are fully loaded
      if (typeof document !== "undefined" && document.fonts?.ready) {
        document.fonts.ready.then(() => {
          measureLetterPositions();
        });
      }

      // 3. Page-load intro timeline for header, road, car entrance, and footer
      const introTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          measureLetterPositions();
          updateScrollReveals(0);
          ScrollTrigger.refresh();
        },
      });

      introTl
        .to("header", {
          opacity: 1,
          y: 0,
          duration: 0.7,
        })
        .to(
          "#road",
          {
            opacity: 1,
            scaleY: 1,
            duration: 0.75,
          },
          "-=0.4"
        )
        .to(
          "#car",
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.45"
        )
        .to(
          "footer",
          {
            opacity: 1,
            duration: 0.5,
          },
          "-=0.3"
        );

      // 4. Master ScrollTrigger timeline with tuned scrub physics (0.8s for ultra-smooth mouse and keypad glide)
      const masterScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2200",
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onRefresh: () => {
            measureLetterPositions();
            updateScrollReveals();
          },
          onUpdate: (self) => {
            updateScrollReveals(self.progress);
          },
        },
      });

      // Car movement across the full scroll distance
      masterScrollTl.to(
        "#car-mover",
        {
          x: () => {
            const roadEl = document.getElementById("road");
            const moverEl = document.getElementById("car-mover");
            if (!roadEl || !moverEl) return 0;

            const roadWidth = roadEl.clientWidth;
            const carWidth = moverEl.offsetWidth;

            const startOffset =
              window.innerWidth < 640 ? 8 : window.innerWidth < 768 ? 16 : 24;
            const endPadding = window.innerWidth < 640 ? 12 : 24;

            return Math.max(0, roadWidth - carWidth - startOffset - endPadding);
          },
          ease: "none",
          duration: 1,
        },
        0
      );

      // Progressive reveals for the four statistic cards synchronized to scroll checkpoints
      masterScrollTl.fromTo(
        "#box1",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.18 },
        0.12
      );

      masterScrollTl.fromTo(
        "#box2",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.18 },
        0.34
      );

      masterScrollTl.fromTo(
        "#box3",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.18 },
        0.56
      );

      masterScrollTl.fromTo(
        "#box4",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.18 },
        0.76
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="section relative min-h-screen w-full bg-[#0c0d10] text-zinc-100 flex flex-col justify-between overflow-x-hidden select-none"
    >
      {/* Background Architectural Grid Lines */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Ambient Lighting Gradients */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[250px] bg-zinc-800/10 blur-[100px] rounded-full" />

      {/* Top Navigation & Agency Brand Bar */}
      <header className="relative z-30 w-full px-6 py-6 sm:px-10 lg:px-16 flex items-center justify-between border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            <span className="text-xl sm:text-2xl font-black tracking-widest text-white">
              ITZFIZZ
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-zinc-500 font-medium pl-3 border-l border-zinc-800">
            Digital Motion Engineering
          </span>
        </div>

        {/* Car View Selector Pill */}
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-full p-1 shadow-inner text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCarVariant("mclaren")}
            className={`px-3 py-1.5 rounded-full transition-colors duration-200 ${
              carVariant === "mclaren"
                ? "bg-emerald-500 text-black shadow-md font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Authentic McLaren 720S top-view reference asset"
          >
            McLaren 720S
          </button>
          <button
            type="button"
            onClick={() => setCarVariant("side-view")}
            className={`px-3 py-1.5 rounded-full transition-colors duration-200 ${
              carVariant === "side-view"
                ? "bg-emerald-500 text-black shadow-md font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Side-view vector sports car asset"
          >
            Side Silhouette
          </button>
        </div>
      </header>

      {/* Main Track & Hero Canvas Stage */}
      <main className="track relative z-20 flex-1 flex flex-col justify-center items-center w-full px-4 sm:px-8 lg:px-16 py-8">
        <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Top Desktop Floating Stats Row (Stat #1 and Stat #3) */}
          <div className="w-full hidden lg:flex items-center justify-between px-6 pb-6 z-20">
            {/* Box 1 (58%) */}
            <div className="w-[300px] xl:w-[320px] ml-auto mr-16">
              <StatCard stat={STATS_DATA[0]} />
            </div>

            {/* Box 3 (27%) */}
            <div className="w-[300px] xl:w-[320px]">
              <StatCard stat={STATS_DATA[2]} />
            </div>
          </div>

          {/* Central Movement Road Track Container */}
          <div
            id="road"
            className="road relative w-full h-[190px] sm:h-[210px] md:h-[235px] lg:h-[260px] rounded-2xl bg-[#141518] border border-zinc-800/80 shadow-2xl overflow-hidden flex items-center justify-start group"
          >
            {/* Layer 0: Road Asphalt Texture and Speed Line Markers */}
            <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 z-0 pointer-events-none" />

            {/* Road Center Lane Guideline */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 border-b border-dashed border-zinc-600/40 z-0 pointer-events-none" />

            {/* Road Curb / Shoulder Accents */}
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500/20 via-zinc-800 to-emerald-500/20 z-0 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-emerald-500/20 via-zinc-800 to-emerald-500/20 z-0 pointer-events-none" />

            {/* Layer 1: Dynamic Green Trail Line / Surface (z-10) */}
            <div
              id="trail"
              className="trail absolute top-0 left-0 bottom-0 z-10 pointer-events-none will-change-[width] overflow-hidden"
              style={{ width: "0px" }}
            >
              {/* Energetic speed trail gradient wash */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/60 via-emerald-900/40 to-emerald-600/30" />
              {/* High-intensity speed streak across the lower track */}
              <div className="absolute inset-x-0 bottom-4 sm:bottom-6 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-emerald-300 shadow-[0_0_10px_#34d399]" />
              {/* Vertical laser leading edge attached to the car */}
              <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-emerald-400 via-emerald-300 to-emerald-400 shadow-[0_0_20px_#34d399,0_0_35px_rgba(16,185,129,0.7)]" />
            </div>

            {/* Layer 2: Headline WELCOME ITZFIZZ (z-20) */}
            {/* Art-directed Two-Level Racing Typographic Composition */}
            <div
              id="valueText"
              className="value-add absolute inset-0 z-20 flex flex-col justify-center items-start pl-6 sm:pl-10 md:pl-14 lg:pl-16 pr-6 sm:pr-10 md:pr-14 lg:pr-16 pointer-events-none select-none max-w-full"
            >
              <h1
                aria-label="WELCOME ITZFIZZ"
                className="font-headline italic flex flex-col items-start leading-[0.88] uppercase tracking-normal"
              >
                {/* Accessible screen-reader text */}
                <span className="sr-only">WELCOME ITZFIZZ</span>

                {/* Upper Level: WELCOME */}
                <div
                  aria-hidden="true"
                  className="headline-welcome flex items-center gap-2 sm:gap-3 mb-1 sm:mb-1.5"
                >
                  {/* Angled geometric racing accent */}
                  <span className="racing-accent flex items-center gap-1 select-none pointer-events-none">
                    <span className="h-[2px] w-3 sm:w-5 md:w-7 bg-gradient-to-r from-transparent to-emerald-400" />
                    <span className="h-2.5 sm:h-3 w-1 bg-emerald-400 -skew-x-12 rounded-[1px] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="h-2.5 sm:h-3 w-1 bg-emerald-500/50 -skew-x-12 rounded-[1px]" />
                  </span>

                  {/* WELCOME Letters */}
                  <span className="inline-flex tracking-[0.2em] sm:tracking-[0.24em] md:tracking-[0.28em] font-bold text-[clamp(0.95rem,2.1vw,1.85rem)] text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    {WELCOME_LETTERS.map((letter, index) => (
                      <span
                        key={`w-${index}`}
                        className="value-letter inline-block font-bold opacity-0 will-change-[opacity]"
                      >
                        {letter}
                      </span>
                    ))}
                  </span>

                  {/* Horizontal speed line accent */}
                  <span className="racing-accent hidden sm:inline-block h-[1.5px] w-8 sm:w-16 md:w-24 bg-gradient-to-r from-emerald-400/80 via-emerald-500/30 to-transparent rounded-full ml-1" />
                </div>

                {/* Lower Level: Complete ITZFIZZ Wordmark */}
                <div
                  aria-hidden="true"
                  className="headline-itzfizz relative inline-flex items-baseline font-black text-[clamp(2.4rem,6vw,5.25rem)] leading-none select-none tracking-normal"
                >
                  {/* Subtle emerald back-glow behind wordmark */}
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-48 sm:w-64 h-24 sm:h-32 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none -z-10" />

                  {/* ITZ in white */}
                  <span className="wordmark-itz inline-flex text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                    {ITZ_LETTERS.map((letter, index) => (
                      <span
                        key={`i-${index}`}
                        className="value-letter inline-block font-black opacity-0 will-change-[opacity]"
                      >
                        {letter}
                      </span>
                    ))}
                  </span>

                  {/* FIZZ in vivid emerald green */}
                  <span className="wordmark-fizz inline-flex text-[#00ff87] drop-shadow-[0_0_24px_rgba(0,255,135,0.4)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                    {FIZZ_LETTERS.map((letter, index) => (
                      <span
                        key={`f-${index}`}
                        className="value-letter inline-block font-black opacity-0 will-change-[opacity]"
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                </div>
              </h1>

              {/* Decorative baseline speed line with telemetry ticks */}
              <div
                aria-hidden="true"
                className="racing-speed-baseline relative flex items-center gap-2 mt-1.5 sm:mt-2.5 pointer-events-none select-none"
              >
                <div className="h-[2px] w-14 sm:w-24 md:w-32 bg-gradient-to-r from-emerald-400 via-emerald-500/50 to-transparent" />
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 bg-emerald-400 -skew-x-12 shadow-[0_0_6px_#34d399]" />
                  <div className="h-1.5 w-1.5 bg-emerald-500/60 -skew-x-12" />
                  <div className="h-1.5 w-1.5 bg-zinc-700/60 -skew-x-12" />
                </div>
              </div>
            </div>

            {/* Layer 3: Sports Car Visual Mover (z-30) */}
            {/* Glides directly above the headline letters (z-30 > z-20) and trail (z-10) */}
            <div
              id="car-mover"
              className="absolute z-30 top-1/2 -translate-y-1/2 left-2 sm:left-4 md:left-6 pointer-events-none will-change-transform"
            >
              <Car id="car" className="car" variant={carVariant} />
            </div>
          </div>

          {/* Bottom Desktop Floating Stats Row (Stat #2 and Stat #4) */}
          <div className="w-full hidden lg:flex items-center justify-between px-6 pt-6 z-20">
            {/* Box 2 (23%) */}
            <div className="w-[300px] xl:w-[320px] ml-auto mr-24">
              <StatCard stat={STATS_DATA[1]} />
            </div>

            {/* Box 4 (40%) */}
            <div className="w-[300px] xl:w-[320px]">
              <StatCard stat={STATS_DATA[3]} />
            </div>
          </div>

          {/* Mobile & Tablet Responsive Stats Grid (< lg display) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 lg:hidden z-20">
            {STATS_DATA.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>

        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="relative z-30 w-full px-6 py-4 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 border-t border-zinc-800/40 bg-zinc-950/30">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Itzfizz Motion Experience • Scroll down to drive the sports car</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Target Elements: #road • #car • #trail • #valueText • #box1-4</span>
          <span>© 2026 ITZFIZZ Digital</span>
        </div>
      </footer>
    </section>
  );
};

export default Hero;
