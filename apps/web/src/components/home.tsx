"use client";

import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import HeroSection from "./HeroSection";
import IntroSection from "./IntroSection";
import CareerEducationSection from "./CareerEducationSection";
import { ThemeProvider } from "@/context/ThemeContext";

// Lazy load heavy components
const ProjectsSection = lazy(() => import("./ProjectsSection"));
const SkillsSection = lazy(() => import("./SkillsSection"));
const ArtSection = lazy(() => import("./ArtSection"));
const ContactSection = lazy(() => import("./ContactSection"));
const ChatBot = lazy(() => import("./ChatBot"));

// Loading Screen - Professional Design
const LoadingScreen = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black z-50 overflow-hidden">
      {/* Simplified background - removed expensive mix-blend-multiply blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-slate-950 to-slate-900"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Main text */}
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2 text-center font-serif">
          Welcome
        </h2>
        <p className="text-lg text-slate-300 mb-12 text-center max-w-md">
          Crafting digital experiences with precision and innovation
        </p>

        {/* Progress Bar */}
        <div className="w-72 space-y-4">
          {/* Simplified progress bar without blur effect */}
          <div className="relative">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Progress text */}
          <div className="text-center">
            <p className="text-3xl font-bold text-white font-mono">{progress}%</p>
            <p className="text-sm text-slate-400 mt-1">
              {progress < 25 ? "Initializing..." : progress < 50 ? "Loading resources..." : progress < 75 ? "Optimizing..." : "Almost there..."}
            </p>
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-10">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
};

// Lazy section fallback - lightweight skeleton loader
const SectionSkeleton = () => (
  <div className="min-h-96 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 animate-pulse" />
);

// Home Page
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Refs keep section navigation flexible without coupling scroll logic to the
  // child components themselves.
  const sectionRefs = {
    hero: useRef(null),
    intro: useRef(null),
    projects: useRef(null),
    skills: useRef(null),
    art: useRef(null),
    contact: useRef(null),
  };

  // Use a short, deterministic intro loader rather than waiting on DOM image
  // bookkeeping, which can leave the page stuck behind the overlay in Next.js.
  useEffect(() => {
    let currentProgress = 0;

    const progressTimer = window.setInterval(() => {
      currentProgress += 10;
      setProgress(Math.min(currentProgress, 90));
    }, 80);

    const revealTimer = window.setTimeout(() => {
      window.clearInterval(progressTimer);
      setProgress(100);
      window.setTimeout(() => {
        setIsLoading(false);
      }, 180);
    }, 900);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(revealTimer);
    };
  }, []);

  // Smooth scroll for any remaining anchor links
  useEffect(() => {
    const handleNavClick = (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement)
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: "smooth",
          });
      }
    };

    const navLinks = document.querySelectorAll("a[href^='#']");
    navLinks.forEach((link) => link.addEventListener("click", handleNavClick));

    return () => {
      navLinks.forEach((link) =>
        link.removeEventListener("click", handleNavClick)
      );
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen progress={progress} />}

      <ThemeProvider>
        <div
          className={`min-h-screen bg-background text-foreground ${
            isLoading
              ? "opacity-0"
              : "opacity-100 transition-opacity duration-700"
          }`}
        >
          <section id="hero" ref={sectionRefs.hero}>
            <HeroSection />
          </section>
          <section id="about-me" ref={sectionRefs.intro}>
            <IntroSection />
          </section>
          <section id="career-education">
            <CareerEducationSection />
          </section>
          <section id="projects" ref={sectionRefs.projects}>
            <Suspense fallback={<SectionSkeleton />}>
              <ProjectsSection />
            </Suspense>
          </section>
          <section id="skills" ref={sectionRefs.skills}>
            <Suspense fallback={<SectionSkeleton />}>
              <SkillsSection />
            </Suspense>
          </section>
          <section id="art" ref={sectionRefs.art}>
            <Suspense fallback={<SectionSkeleton />}>
              <ArtSection />
            </Suspense>
          </section>
          <section id="contact" ref={sectionRefs.contact}>
            <Suspense fallback={<SectionSkeleton />}>
              <ContactSection />
            </Suspense>
          </section>

          <Suspense fallback={null}>
            <ChatBot />
          </Suspense>
        </div>

        <footer className="py-10 text-center text-base text-muted-foreground border-t border-border">
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} - Carls Dale Escalo</p>
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
