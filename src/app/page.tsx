"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Register useGSAP plugin
gsap.registerPlugin(useGSAP);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const pulseOrbRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [animStatus, setAnimStatus] = useState<"running" | "paused">("running");
  const [animSpeed, setAnimSpeed] = useState<number>(1);
  const [clickCount, setClickCount] = useState<number>(0);

  const { contextSafe } = useGSAP(
    () => {
      // 1. Initial Staggered Entrance
      const tlIntro = gsap.timeline({ defaults: { ease: "power3.out" } });

      tlIntro
        .from(".anim-badge", {
          opacity: 0,
          y: -20,
          duration: 0.8,
        })
        .from(
          ".anim-heading-char",
          {
            opacity: 0,
            y: 40,
            rotateX: -45,
            stagger: 0.04,
            duration: 0.9,
          },
          "-=0.4"
        )
        .from(
          ".anim-subtext",
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".anim-card",
          {
            opacity: 0,
            y: 30,
            stagger: 0.15,
            duration: 0.8,
          },
          "-=0.4"
        )
        .from(
          ".anim-playground",
          {
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
          },
          "-=0.3"
        );

      // 2. Continuous Looping Playground Timeline
      const loopTl = gsap.timeline({ repeat: -1, yoyo: true });
      loopTl
        .to(pulseOrbRef.current, {
          scale: 1.25,
          rotate: 180,
          borderRadius: "38%",
          boxShadow: "0 0 60px 20px rgba(56, 189, 248, 0.4)",
          duration: 2.2,
          ease: "sine.inOut",
        })
        .to(pulseOrbRef.current, {
          scale: 0.95,
          rotate: 360,
          borderRadius: "50%",
          boxShadow: "0 0 35px 10px rgba(168, 85, 247, 0.3)",
          duration: 2.2,
          ease: "sine.inOut",
        });

      timelineRef.current = loopTl;
    },
    { scope: containerRef }
  );

  // Context-safe interactive hover effect
  const handleCardMouseEnter = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -6,
      scale: 1.02,
      borderColor: "rgba(56, 189, 248, 0.5)",
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const handleCardMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      borderColor: "rgba(255, 255, 255, 0.08)",
      duration: 0.3,
      ease: "power2.out",
    });
  });

  // Context-safe interactive burst on click
  const handleOrbClick = contextSafe(() => {
    setClickCount((prev) => prev + 1);
    gsap.fromTo(
      pulseOrbRef.current,
      { scale: 0.8, rotate: "-=30" },
      {
        scale: 1.3,
        rotate: "+=180",
        duration: 0.5,
        ease: "elastic.out(1.2, 0.4)",
        onComplete: () => {
          gsap.to(pulseOrbRef.current, { scale: 1, duration: 0.4 });
        },
      }
    );
  });

  const toggleTimeline = () => {
    if (!timelineRef.current) return;
    if (timelineRef.current.paused()) {
      timelineRef.current.play();
      setAnimStatus("running");
    } else {
      timelineRef.current.pause();
      setAnimStatus("paused");
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (!timelineRef.current) return;
    timelineRef.current.timeScale(speed);
    setAnimSpeed(speed);
  };

  const restartAnimation = () => {
    if (!timelineRef.current) return;
    timelineRef.current.restart();
    setAnimStatus("running");
  };

  const helloChars = "Hello, World!".split("");

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between"
    >
      {/* Ambient background glow layers */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-cyan-500/15 via-purple-600/10 to-transparent blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-emerald-500/10 blur-[130px]" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 font-bold text-white shadow-lg shadow-cyan-500/20">
            TG
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            ToolkitGO
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            GSAP & Next.js Operational
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-6 py-8 text-center">
        {/* Animated Badge */}
        <div className="anim-badge mb-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md shadow-inner">
          <span className="text-cyan-400 font-mono">v1.0.0</span>
          <span className="text-slate-600">•</span>
          <span>Next.js 16 + Tailwind CSS v4 + GSAP 3</span>
        </div>

        {/* Animated Heading with letter-by-letter reveal */}
        <h1 className="flex flex-wrap justify-center text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
          {helloChars.map((char, index) => (
            <span
              key={index}
              className={`anim-heading-char inline-block ${
                char === " " ? "w-4 sm:w-6" : ""
              } bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm`}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="anim-subtext mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl leading-relaxed">
          Welcome to your high-performance web toolkit. Bootstrapped with Next.js App Router, Tailwind CSS, and powered by GreenSock animation physics.
        </p>

        {/* Tech Stack Cards */}
        <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            className="anim-card glow-card flex flex-col items-start p-6 rounded-2xl transition-all cursor-pointer text-left"
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-sm font-semibold">
              01
            </div>
            <h2 className="text-lg font-semibold text-slate-100">Next.js App Router</h2>
            <p className="mt-2 text-sm text-slate-400">
              Modern React 19 architecture with Server & Client components, Turbopack, and typed routes.
            </p>
          </div>

          <div
            className="anim-card glow-card flex flex-col items-start p-6 rounded-2xl transition-all cursor-pointer text-left"
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-sm font-semibold">
              02
            </div>
            <h2 className="text-lg font-semibold text-slate-100">Tailwind CSS v4</h2>
            <p className="mt-2 text-sm text-slate-400">
              Next-generation CSS engine featuring instant compilation and clean modern tokens.
            </p>
          </div>

          <div
            className="anim-card glow-card flex flex-col items-start p-6 rounded-2xl transition-all cursor-pointer text-left"
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-purple-400 font-mono text-sm font-semibold">
              03
            </div>
            <h2 className="text-lg font-semibold text-slate-100">GSAP & Agent Skills</h2>
            <p className="mt-2 text-sm text-slate-400">
              Industry-standard animation powerhouse with 8 installed skills for timelines and micro-interactions.
            </p>
          </div>
        </div>

        {/* Interactive GSAP Timeline Playground */}
        <div
          ref={heroCardRef}
          className="anim-playground glow-card mt-10 w-full max-w-4xl rounded-2xl p-8 border border-slate-800/80"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6 text-left">
            <div>
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <span>Interactive GSAP Timeline Controller</span>
                <span className="rounded bg-cyan-950 px-2 py-0.5 text-xs font-mono text-cyan-300 border border-cyan-800">
                  useGSAP
                </span>
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Click the interactive orb to trigger physics elasticity or modulate timeline playback in real time.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="btn-toggle-anim"
                onClick={toggleTimeline}
                className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors"
              >
                {animStatus === "running" ? "⏸ Pause" : "▶ Play"}
              </button>
              <button
                id="btn-restart-anim"
                onClick={restartAnimation}
                className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors"
              >
                ↺ Restart
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-around gap-8">
            {/* The Animated GSAP Orb */}
            <div className="flex flex-col items-center">
              <div
                ref={pulseOrbRef}
                onClick={handleOrbClick}
                className="h-28 w-28 cursor-pointer rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 shadow-xl flex items-center justify-center select-none active:scale-95 transition-transform"
                title="Click to trigger GSAP spring elastic burst!"
              >
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Tap me
                </span>
              </div>
              <span className="mt-3 text-xs text-slate-500 font-mono">
                Elastic Bursts: {clickCount}
              </span>
            </div>

            {/* Timeline Speed Multipliers */}
            <div className="flex flex-col items-start gap-3 text-left">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Timeline Speed Multiplier:
              </span>
              <div className="flex gap-2">
                {[0.5, 1, 2, 4].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                      animSpeed === speed
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Current Status: <span className="font-mono text-cyan-400 capitalize">{animStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-6xl px-6 py-8 text-center text-xs text-slate-500 border-t border-slate-900">
        <p>Built with Next.js, Tailwind CSS & GreenSock GSAP • ToolkitGO Workspace</p>
      </footer>
    </div>
  );
}
