// src/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import HeroSection from "./HeroSection";
import ProjectsSection from "./ProjectsSection";
import SkillsSection from "./SkillsSection";
import ArtSection from "./ArtSection";
import ContactSection from "./ContactSection";
import ChatBot from "./ChatBot";

// Loading Screen
const LoadingScreen = ({ progress }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-background z-50">
      <div className="flex flex-col items-center justify-center p-10 rounded-3xl bg-background/80 backdrop-blur-md border border-border shadow-2xl">
        <div className="mb-10 transform transition-transform duration-700 hover:scale-105">
          <img
            src="/cde.png"
            alt="Carls Dale Escalo Logo"
            className="w-40 h-40 object-contain mx-auto"
          />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-6 flex items-center">
          Loading
          <span className="flex">
            <span className="animate-pulse">.</span>
            <span className="animate-pulse delay-200">.</span>
            <span className="animate-pulse delay-400">.</span>
          </span>
        </h2>
        <div className="w-80 h-3 bg-border rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-muted-foreground text-base">{progress}%</p>
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
    projects: useRef(null),
    skills: useRef(null),
    art: useRef(null),
    contact: useRef(null),
  };

  // Dynamic loading based on images
  useEffect(() => {
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
