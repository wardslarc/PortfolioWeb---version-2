import React from "react";
import HeroSection from "./HeroSection";
import ProjectsSection from "./ProjectsSection";
import SkillsSection from "./SkillsSection";
import ArtSection from "./ArtSection";
import ContactSection from "./ContactSection";
import ContactMaintenance from "./NotWorking";


const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <HeroSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Art Section */}
      <ArtSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} - Carls Dale Escalo</p>
          <div className="mt-4 flex justify-center space-x-4">
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
  );
};

export default Home;
