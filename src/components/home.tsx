import React, { useState, useEffect, useRef } from "react";
import HeroSection from "./HeroSection";
import IntroSection from "./IntroSection";
import CareerEducationSection from "./CareerEducationSection";
import ProjectsSection from "./ProjectsSection";
import SkillsSection from "./SkillsSection";
import ArtSection from "./ArtSection";
import ContactSection from "./ContactSection";
import ChatBot from "./ChatBot";
import { injectSchemaMarkup, generatePersonSchema, generateWebsiteSchema } from "@/utils/seoUtils";
import { ThemeProvider } from "@/context/ThemeContext";

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

// Feature Info Modal
const FeatureInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">✨</span>
            <h2 className="text-3xl font-bold text-gray-900">Dynamic Theme Feature</h2>
          </div>
          
          <div className="space-y-6">
            {/* Automatic Feature */}
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Automatic Time-Based Detection</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                The portfolio implements a dynamic theming system that automatically detects your local time and applies contextual backgrounds. This provides an immersive, time-responsive experience without any manual configuration required.
              </p>
              <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🌄</span>
                  <div>
                    <strong className="block">Morning</strong>
                    <span className="text-gray-600">5:00 AM – 11:59 AM</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">☀️</span>
                  <div>
                    <strong className="block">Afternoon</strong>
                    <span className="text-gray-600">12:00 PM – 5:59 PM</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">🌙</span>
                  <div>
                    <strong className="block">Night</strong>
                    <span className="text-gray-600">6:00 PM – 4:59 AM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Override Feature */}
            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manual Theme Override</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                For testing and demonstration purposes, you can manually override the automatic detection. This allows you to preview how the portfolio appears at different times of day, regardless of your actual local time.
              </p>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>How to use:</strong>
                </p>
                <ol className="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
                  <li>Click the <strong>Sparkles (✨) button</strong> in the bottom-right corner</li>
                  <li>Select your desired theme: <strong>Morning</strong>, <strong>Afternoon</strong>, or <strong>Night</strong></li>
                  <li>The background changes instantly for preview</li>
                  <li>Click <strong>"Reset to Auto"</strong> to return to automatic time-based detection</li>
                </ol>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

// Home Page
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showFeatureModal, setShowFeatureModal] = useState(false);

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
      setTimeout(() => {
        setIsLoading(false);
        setShowFeatureModal(true);
      }, 100);
      return;
    }

    const onImageLoad = () => {
      loadedCount++;
      setProgress(Math.floor((loadedCount / images.length) * 100));
      if (loadedCount === images.length) {
        setTimeout(() => {
          setIsLoading(false);
          setShowFeatureModal(true);
        }, 200);
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
      <FeatureInfoModal isOpen={showFeatureModal} onClose={() => setShowFeatureModal(false)} />

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
