import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SkillProps {
  name: string;
  icon: string;
  description: string;
}

const SkillsSection = ({
  skills = defaultSkills,
}: {
  skills?: SkillProps[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayedSkills = showAll ? skills : skills.slice(0, 8);

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-slate-900">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Current Technologies</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            I'm proficient in a range of modern technologies that empower me to build highly functional solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayedSkills.map((skill, index) => (
            <SkillCard key={skill.name} skill={skill} index={index} />
          ))}
        </div>

        {skills.length > 8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center mt-8"
          >
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {showAll ? (
                <>
                  <ChevronUp size={20} />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={20} />
                  Show More Skills
                </>
              )}
            </Button>
          </motion.div>
        )}
        </div>
      </motion.div>
    </section>
  );
};

const SkillCard = ({ skill, index }: { skill: SkillProps; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full bg-white dark:bg-slate-800">
        <CardContent className="p-6 flex flex-col items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mb-4 p-4 rounded-full bg-slate-100 dark:bg-slate-700"
                >
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="w-16 h-16 object-contain"
                  />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{skill.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h3 className="text-xl font-bold mb-2">{skill.name}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-center">
            {skill.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const defaultSkills: SkillProps[] = [
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    description: "NoSQL database management",
  },
  {
    name: "Express",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    description: "Backend framework for Node.js",
  },
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    description: "Frontend library for UI",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    description: "JavaScript runtime environment",
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    description: "Core programming language",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    description: "Type-safe JavaScript",
  },
  {
    name: "Vite",
    icon: "https://vitejs.dev/logo.svg",
    description: "Next generation frontend build tool",
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    description: "React framework for production",
  },
];

export default SkillsSection;