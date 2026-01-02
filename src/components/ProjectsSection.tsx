"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ProjectModal from "./ProjectModal";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  demoUrl?: string;
  sourceUrl?: string;
}

interface ProjectsSectionProps {
  projects?: Project[];
}

const ProjectsSection = ({ projects = defaultProjects }: ProjectsSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const categories = ["all", ...Array.from(new Set(projects.map((p) => p.category.toLowerCase().trim())))];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const categoryMatch =
        selectedCategory === "all" ||
        project.category.toLowerCase().trim() === selectedCategory;

      const searchMatch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const projectsToShow = showAll ? filteredProjects : filteredProjects.slice(0, 3);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setShowAll(false); // reset to preview mode on category change
  };

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="py-20 bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <div className="container mx-auto px-4">
        <div className="text-center mb-12 px-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Web Development Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Explore my recent work and personal projects that showcase my skills and expertise in web development.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryClick(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-64 mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-background text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No projects found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsToShow.map((project) => (
                <Card key={project.id} className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="flex-1 flex flex-col p-4 sm:p-5">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-auto">
                      {project.demoUrl && project.demoUrl !== "#" && (
                        <Button
                          variant="outline"
                          className="w-full text-sm"
                          onClick={() => window.open(project.demoUrl, "_blank")}
                        >
                          Visit Website
                        </Button>
                      )}
                      <Button onClick={() => openProjectModal(project)} className="w-full text-sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Show More Button */}
            {filteredProjects.length > 3 && (
              <div className="text-center mt-8">
                <Button variant="ghost" onClick={() => setShowAll(!showAll)}>
                  {showAll ? "Show Less" : "More Work"}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {selectedProject && (
          <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeProjectModal} />
        )}
        </div>
      </motion.div>
    </section>
  );
};

const defaultProjects: Project[] = [
  {
    id: "7",
    title: "Reflective Pomodoro",
    description: "A website where users is prompt to reflect after a pomodoro session.",
    image: "/pomodoro.png",
    category: "personal",
    technologies: ["MongoDB", "Express", "ReactJS", "NodeJS"],
    demoUrl: "https://www.reflectivepomodoro.com/",
  },
  {
    id: "6",
    title: "Personal Website Portfolio",
    description: "Your own developer portfolio built with React and Tailwind.",
    image: "/portfolio.png",
    category: "personal",
    technologies: ["MongoDB", "Express", "ReactJS", "NodeJS"],
    demoUrl: "https://carlsdaleescalo.com",
  },
  {
    id: "1",
    title: "Citimax Group Inc Website",
    description: "Website for Citimax Group Inc hosted on GoDaddy, built using static HTML, CSS, and JavaScript.",
    image: "/citimax.png",
    category: "work",
    technologies: ["Go Daddy", "Html", "CSS", "Javascript"],
    demoUrl: "https://citimax.ph",
  },
  {
    id: "9",
    title: "Marci Metzger Homes Website",
    description: "A website for a real estate agent.",
    image: "/marci.png",
    category: "personal",
    technologies: ["Reactjs", "Typescript", "Vite", "Firebase"],
    demoUrl: "https://marcimetzger-orcin.vercel.app/",
  },
  {
    id: "2",
    title: "IT Ticketing System",
    description: "Used internally by Citimax’s affiliates to file and resolve support tickets.",
    image: "/ticket.png",
    category: "work",
    technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    demoUrl: "#",
  },
  {
    id: "3",
    title: "Lifecore Bio-Integrative Website",
    description: "Showcases Lifecore’s services and products. Deployed on Vercel.",
    image: "/lifecore.png",
    category: "work",
    technologies: ["React", "Typescript", "Vite", "Firebase"],
    demoUrl: "https://lifecore.vercel.app/",
  },
  {
    id: "4",
    title: "Hardrock Aggregates Website",
    description: "Company profile site showing services and company info.",
    image: "/hardrock.png",
    category: "work",
    technologies: ["React", "Typescript", "Vite"],
    demoUrl: "https://hardrock-frontend.vercel.app/#home",
  },
  {
    id: "5",
    title: "Citimax Onboarding LMS",
    description: "Used to onboard new hires by the HR department of Citimax.",
    image: "/hr.png",
    category: "work",
    technologies: ["React", "Firebase", "Typescript", "Vercel"],
    demoUrl: "#",
  },
  {
    id: "8",
    title: "Sticky White Board",
    description: "A collaborative whiteboard tool using React and Firebase. Still under development.",
    image: "/sticky.png",
    category: "personal",
    technologies: ["React Js", "Typescript", "Firebase", "Tailwind"],
    demoUrl: "https://sticky-white-board.vercel.app/",
  },

];

export default ProjectsSection;
