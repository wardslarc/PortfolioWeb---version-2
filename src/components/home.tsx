// src/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import HeroSection from "./HeroSection";
import ProjectsSection from "./ProjectsSection";
import SkillsSection from "./SkillsSection";
import ArtSection from "./ArtSection";
import ContactSection from "./ContactSection";

const FloatingNav = ({ sections, activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (activeSection === "hero") {
        setScrolled(currentY > 50); // background appears if scrolled
        setVisible(true); // always visible in hero
      } else {
        // Other sections: fade out/in
        if (currentY > lastScrollY.current) setVisible(false); // scrolling down
        else setVisible(true); // scrolling up
        setScrolled(currentY > 0); // background appears if scrolled
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 px-6 py-4
        transform transition-all duration-500 ease-in-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}
      `}
    >
      {/* Mobile Hamburger */}
      <div className="md:hidden mt-6 flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {isOpen && (
          <ul className="absolute top-14 left-6 flex flex-col items-start space-y-3 rounded-2xl backdrop-blur-md bg-slate-900/90 px-6 py-5 shadow-xl w-56 animate-in fade-in slide-in-from-left-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full font-bold transition-colors px-4 py-2 rounded-lg text-lg ${
                    activeSection === section.id
                      ? "text-primary bg-white shadow-md"
                      : "text-white hover:text-black hover:bg-gray-200"
                  }`}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop Rounded Pill Nav */}
      <div className="hidden md:flex justify-center mt-6">
        <ul
          className={`
            flex justify-between items-center
            w-full max-w-[calc(100%-400px)]
            rounded-3xl
            px-8 py-4
            backdrop-blur-md
            transition-colors duration-500 ease-in-out
            mx-auto
            ${scrolled ? "bg-slate-900/90 shadow-xl" : "bg-transparent"}
          `}
        >
          {sections.map((section) => (
            <li key={section.id} className="flex-1 mx-2">
              <a
                href={`#${section.id}`}
                className={`
                  block text-center font-bold tracking-wide
                  px-4 py-2 rounded-2xl transition-colors
                  text-lg lg:text-xl
                  ${
                    activeSection === section.id
                      ? "text-primary bg-white shadow-md"
                      : "text-white hover:text-black hover:bg-gray-200"
                  }
                `}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

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
  const [activeSection, setActiveSection] = useState("hero");

  const sectionRefs = {
    hero: useRef(null),
    projects: useRef(null),
    skills: useRef(null),
    art: useRef(null),
    contact: useRef(null),
  };

  const sections = [
    { id: "hero", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "art", label: "Art" },
    { id: "contact", label: "Contact" },
  ];

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

  // Intersection Observer + smooth scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    const handleNavClick = (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement)
          window.scrollTo({
            top: targetElement.offsetTop - 120,
            behavior: "smooth",
          });
      }
    };

    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach((link) => link.addEventListener("click", handleNavClick));

    return () => {
      observer.disconnect();
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
          isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-700"
        }`}
      >
        {!isLoading && (
          <FloatingNav sections={sections} activeSection={activeSection} />
        )}

        <section id="hero" ref={sectionRefs.hero} className="scroll-mt-32">
          <HeroSection />
        </section>
        <section id="projects" ref={sectionRefs.projects} className="scroll-mt-32">
          <ProjectsSection />
        </section>
        <section id="skills" ref={sectionRefs.skills} className="scroll-mt-32">
          <SkillsSection />
        </section>
        <section id="art" ref={sectionRefs.art} className="scroll-mt-32">
          <ArtSection />
        </section>
        <section id="contact" ref={sectionRefs.contact} className="scroll-mt-32">
          <ContactSection />
        </section>

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
