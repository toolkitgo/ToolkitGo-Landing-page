"use client";

import Image from "next/image";
import { ArrowDown, Check } from "lucide-react";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap/config";
import { SectionMotion } from "@/components/motion/SectionMotion";
import type { BookingSequenceProps } from "@/types/motion";

/** Four illustrated chapters: a horizontal scroll film on desktop, flowing scenes on mobile. */
export function BookingSequence({ steps, children }: BookingSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(() => {
    const scope = containerRef.current;
    if (!scope) return;
    const stage = scope.querySelector<HTMLElement>(".journey-stage");
    const track = scope.querySelector<HTMLOListElement>(".journey-track");
    const chapters = Array.from(scope.querySelectorAll<HTMLElement>(".journey-chapter"));
    if (!stage || !track) return;

    const media = gsap.matchMedia();
    media.add({
      all: "(min-width: 0px)",
      wide: "(min-width: 900px) and (min-height: 620px)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      if (context.conditions?.reduced) return;

      const revealScene = (chapter: HTMLElement) => {
        const sequence = gsap.timeline({ defaults: { ease: "power3.out" } });
        sequence.fromTo(chapter.querySelectorAll(".journey-reveal"),
          { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.09 }, 0);
        sequence.fromTo(chapter.querySelector(".journey-orbit"),
          { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 }, 0);
        sequence.fromTo(chapter.querySelector(".journey-illustration"),
          { y: 60, x: 50, scale: 0.92, opacity: 0 },
          { y: 0, x: 0, scale: 1, opacity: 1, duration: 0.85 }, 0.08);
        sequence.fromTo(chapter.querySelector(".journey-caption"),
          { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.55);
        return sequence;
      };

      if (!context.conditions?.wide) {
        // Natural touch scrolling; the original illustrations remain fully readable.
        chapters.forEach((chapter) => {
          const entrance = revealScene(chapter);
          ScrollTrigger.create({ animation: entrance, trigger: chapter, start: "clamp(top 85%)", once: true });
          gsap.fromTo(chapter.querySelector(".journey-numeral"), { x: 24 }, {
            x: -24, ease: "none",
            scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: 0.7 },
          });
        });
        return;
      }

      // Pin the heading and stage together. GSAP restores the full static layout on cleanup.
      gsap.set([scope, stage], { attr: { "data-motion-mode": "horizontal" } });
      gsap.set(scope, { attr: { "data-scroll-driven": "true" } });
      gsap.set(track, { x: 0 });
      const progress = scope.querySelector(".journey-progress-fill");
      const railNumbers = scope.querySelectorAll(".journey-rail-number");
      gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
      let refreshing = false;
      const syncChapter = (position: number) => {
        const index = Math.min(steps.length - 1, Math.floor(position * steps.length));
        if (activeRef.current !== index) {
          activeRef.current = index;
          setActiveStep(index);
        }
      };

      // The first scene reveals while entering, before the horizontal story starts.
      const entrance = revealScene(chapters[0]);
      ScrollTrigger.create({ animation: entrance, trigger: scope, start: "top 85%", end: "top 96px", scrub: 0.6 });
      const story = gsap.timeline({
        scrollTrigger: {
          id: "booking-story", trigger: scope, pin: true, start: "top 96px",
          end: () => `+=${Math.min(window.innerHeight * 2.6, 2400)}`,
          scrub: 0.8, invalidateOnRefresh: true, refreshPriority: 1,
          onRefreshInit: () => { refreshing = true; },
          onRefresh: (trigger) => { refreshing = false; syncChapter(trigger.progress); },
        },
        onUpdate: () => { if (!refreshing) syncChapter(story.progress()); },
      });
      story.to(progress, { scaleX: 1, duration: steps.length, ease: "none" }, 0);
      chapters.forEach((chapter, index) => {
        const arrival = Math.max(0, index - 0.35);
        story.fromTo(chapter.querySelector(".journey-numeral"), { x: 60, scale: 0.92 },
          { x: -60, scale: 1.06, duration: 1.3, ease: "none", immediateRender: false }, arrival);
        story.fromTo(railNumbers[index], { scale: 1 },
          { scale: 1.08, duration: 0.2, immediateRender: false }, index);
        if (index < steps.length - 1) story.to(railNumbers[index], { scale: 1, duration: 0.2 }, index + 0.8);
        if (index === 0) return;
        story.addLabel(`chapter-${index + 1}`, index)
          .fromTo(track, { x: () => -stage.clientWidth * (index - 1) }, {
            x: () => -stage.clientWidth * index, duration: 0.7, ease: "sine.inOut", immediateRender: false,
          }, arrival)
          .to(chapters[index - 1].querySelector(".journey-copy"), { x: -36, opacity: 0, duration: 0.4 }, arrival);
        const scene = revealScene(chapter);
        scene.duration(0.8);
        story.add(scene, arrival + 0.08);
      });
      ScrollTrigger.refresh();
    });

    return () => media.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="booking-journey booking-scene">
      <SectionMotion>{children}</SectionMotion>
      <div className="journey-stage">
        <ol className="journey-track" aria-label="The four steps to getting your service done">
          {steps.map((step, index) => (
            <li className="journey-chapter" key={step.image} data-chapter={index + 1}>
              <span className="journey-numeral" aria-hidden="true">0{index + 1}</span>
              <div className="journey-copy">
                <div className="journey-clip"><p className="journey-kicker journey-reveal"><span aria-hidden="true" />Step 0{index + 1} of 0{steps.length}</p></div>
                <h3>{step.titleLines.map((line) => <span className="journey-clip" key={line}><span className="journey-reveal">{line}</span></span>)}</h3>
                <div className="journey-clip"><p className="journey-description journey-reveal">{step.description}</p></div>
              </div>
              <div className="journey-visual">
                <div className="journey-orbit" aria-hidden="true" />
                <div className="journey-illustration">
                  <Image src={`/assets/illustrations/steps/${step.image}`} alt="" fill
                    sizes="(min-width: 900px) 550px, (min-width: 640px) 320px, 85vw"
                    loading={index === 0 ? "eager" : "lazy"}
                    unoptimized className="object-contain" />
                </div>
                <span className="journey-caption" aria-hidden="true">
                  {index === steps.length - 1 ? <Check size={16} strokeWidth={2.5} /> : <span className="journey-caption-dot" />}
                  {step.caption}
                </span>
              </div>
            </li>
          ))}
        </ol>
        <div className="journey-rail" aria-hidden="true">
          <div className="journey-progress-track"><div className="journey-progress-fill" /></div>
          <ol>
            {steps.map((step, index) => (
              <li key={step.image} data-current={activeStep === index} data-complete={activeStep > index}>
                <span className="journey-rail-dot" />
                <span className="journey-rail-number">0{index + 1}</span> {step.title}
              </li>
            ))}
          </ol>
          <span className="journey-scroll-cue">Keep scrolling <ArrowDown size={14} /></span>
        </div>
      </div>
    </div>
  );
}
