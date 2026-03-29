"use client";

import React, { useEffect, useState, lazy, Suspense } from "react";
import HeroSection from "./HeroSection";
import IntroSection from "./IntroSection";
import CareerEducationSection from "./CareerEducationSection";
import { ThemeProvider } from "@/context/ThemeContext";
import { deferHeavyWork, getNetworkStatus } from "@/lib/mobilePerformance";

const ProjectsSection = lazy(() => import("./ProjectsSection"));
const SkillsSection = lazy(() => import("./SkillsSection"));
const ContactSection = lazy(() => import("./ContactSection"));
const ChatBot = lazy(() => import("./ChatBot"));

const INTRO_SESSION_KEY = "portfolio:intro-seen";

const LoadingScreen = ({ isCompact }: { isCompact: boolean }) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_38%),linear-gradient(135deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(148,163,184,0.08)_45%,transparent_100%)] animate-[pulse_3s_ease-in-out_infinite]" />
      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-[-10%] top-[18%] h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute bottom-[10%] right-[-8%] h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-white/15 bg-white/8 text-xl font-semibold tracking-[0.35em] text-white shadow-[0_20px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          CDE
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.5em] text-sky-200/80">
          Carls Dale Escalo
        </p>
        <h2 className="max-w-2xl text-4xl font-bold text-white sm:text-5xl">
          Building thoughtful products with clean systems and sharp execution.
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
          The portfolio is opening with a lighter first-visit experience so the
          site becomes interactive faster.
        </p>

        <div className="mt-10 w-full max-w-sm">
          <div className="h-px overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-400 ${
                isCompact
                  ? "animate-[intro-line_0.45s_ease-out_forwards]"
                  : "animate-[intro-line_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]"
              }`}
            />
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-400">
            Preparing experience
          </p>
        </div>
      </div>
    </div>
  );
};

const SectionSkeleton = () => (
  <div className="min-h-96 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 animate-pulse" />
);

const Home = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [isCompactIntro, setIsCompactIntro] = useState(false);
  const [shouldMountChatBot, setShouldMountChatBot] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const network = getNetworkStatus();
    const hasSeenIntro =
      window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
    const compactIntro =
      mediaQuery.matches || network.saveData || network.isSlowNetwork;

    setIsCompactIntro(compactIntro);

    if (hasSeenIntro) {
      return;
    }

    setShowIntro(true);
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const revealTimer = window.setTimeout(() => {
      setShowIntro(false);
      document.body.style.overflow = originalOverflow;
    }, compactIntro ? 350 : 1150);

    return () => {
      window.clearTimeout(revealTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const cancelDeferredMount = deferHeavyWork(() => {
      setShouldMountChatBot(true);
    }, 1800);

    return () => {
      cancelDeferredMount();
    };
  }, []);

  return (
    <>
      {showIntro ? <LoadingScreen isCompact={isCompactIntro} /> : null}

      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground">
          <section id="hero">
            <HeroSection />
          </section>
          <section id="about-me">
            <IntroSection />
          </section>
          <section id="career-education">
            <CareerEducationSection />
          </section>
          <section id="projects">
            <Suspense fallback={<SectionSkeleton />}>
              <ProjectsSection />
            </Suspense>
          </section>
          <section id="skills">
            <Suspense fallback={<SectionSkeleton />}>
              <SkillsSection />
            </Suspense>
          </section>
          <section id="contact">
            <Suspense fallback={<SectionSkeleton />}>
              <ContactSection />
            </Suspense>
          </section>

          {shouldMountChatBot ? (
            <Suspense fallback={null}>
              <ChatBot />
            </Suspense>
          ) : null}
        </div>

        <footer className="border-t border-border py-10 text-center text-base text-muted-foreground">
          <div className="container mx-auto px-4">
            <p>&copy; {new Date().getFullYear()} - Carls Dale Escalo</p>
            <div className="mt-4 flex justify-center space-x-6 text-lg">
              <a
                href="https://github.com/wardslarc"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/carls-dale-escalo-797701366/"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/daleonigiri"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </div>
          </div>
        </footer>
      </ThemeProvider>
    </>
  );
};

export default Home;
