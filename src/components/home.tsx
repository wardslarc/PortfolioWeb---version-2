// src/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import HeroSection from "./HeroSection";
import IntroSection from "./IntroSection";
import ProjectsSection from "./ProjectsSection";
import SkillsSection from "./SkillsSection";
import ArtSection from "./ArtSection";
import ContactSection from "./ContactSection";
import ChatBot from "./ChatBot";
import { injectSchemaMarkup, generatePersonSchema, generateWebsiteSchema } from "@/utils/seoUtils";

// Loading Screen - Professional Design
const LoadingScreen = ({ progress }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black z-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo with rotation animation */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-slate-900 p-4 rounded-full border border-slate-700 backdrop-blur-xl">
            <img
              src="/cde.png"
              alt="Carls Dale Escalo Logo"
              className="w-32 h-32 object-contain animate-spin-slow"
            />
          </div>
        </div>

        {/* Main text */}
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2 text-center font-serif">
          Welcome
        </h2>
        <p className="text-lg text-slate-300 mb-12 text-center max-w-md">
          Crafting digital experiences with precision and innovation
        </p>

        {/* Progress Bar */}
        <div className="w-72 space-y-4">
          {/* Outer container with border */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-50"></div>
            <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all duration-300 rounded-full shadow-lg"
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

// Home Page
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const sectionRefs = {
    hero: useRef(null),
    intro: useRef(null),
    projects: useRef(null),
    skills: useRef(null),
    art: useRef(null),
    contact: useRef(null),
  };

  // Dynamic loading based on images
  useEffect(() => {
    // Inject schema markup for SEO
    injectSchemaMarkup(generatePersonSchema());
    injectSchemaMarkup(generateWebsiteSchema());

    const images = Array.from(document.images);
    let loadedCount = 0;

    if (images.length === 0) {
      setProgress(100);
      setTimeout(() => setIsLoading(false), 100);
      return;
    }

    const onImageLoad = () => {
      loadedCount++;
      setProgress(Math.floor((loadedCount / images.length) * 100));
      if (loadedCount === images.length) {
        setTimeout(() => setIsLoading(false), 200);
      }
    };

    images.forEach((img) => {
      if (img.complete) onImageLoad();
      else {
        img.addEventListener("load", onImageLoad);
        img.addEventListener("error", onImageLoad);
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", onImageLoad);
        img.removeEventListener("error", onImageLoad);
      });
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
        <section id="projects" ref={sectionRefs.projects}>
          <ProjectsSection />
        </section>
        <section id="skills" ref={sectionRefs.skills}>
          <SkillsSection />
        </section>
        <section id="art" ref={sectionRefs.art}>
          <ArtSection />
        </section>
        <section id="contact" ref={sectionRefs.contact}>
          <ContactSection />
        </section>

        <ChatBot />

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
      </div>
    </>
  );
};

export default Home;
