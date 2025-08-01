import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillProps {
  name: string;
  icon: string;
  proficiency: number;
  description: string;
}

const SkillsSection = ({
  skills = defaultSkills,
}: {
  skills?: SkillProps[];
}) => {
  return (
    <section id="skills" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Skills</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Here are the technologies I work with and my proficiency levels in
            each.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <SkillCard key={index} skill={skill} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">
            Proficiency Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <SkillProgress key={index} skill={skill} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
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

const SkillProgress = ({
  skill,
  index,
}: {
  skill: SkillProps;
  index: number;
}) => {
  const [progressValue, setProgressValue] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(
      () => {
        setProgressValue(skill.proficiency);
      },
      300 + index * 100,
    );

    return () => clearTimeout(timer);
  }, [skill.proficiency, index]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col gap-2"
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{skill.name}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {skill.proficiency}%
        </span>
      </div>
      <Progress value={progressValue} className="h-2" />
    </motion.div>
  );
};

const defaultSkills: SkillProps[] = [
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    proficiency: 90,
    description: "Building interactive UIs with React and its ecosystem",
  },
  {
    name: "Tailwind CSS",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
    proficiency: 85,
    description: "Creating responsive designs with utility-first CSS",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    proficiency: 80,
    description: "Developing type-safe applications with TypeScript",
  },
  {
    name: "Firebase",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    proficiency: 75,
    description: "Realtime apps and hosting using Firebase services",
  },
{
  name: "GoDaddy",
  icon: "https://download.logo.wine/logo/GoDaddy/GoDaddy-Logo.wine.png",
  proficiency: 70,
  description: "Deploying and managing domains and hosting via GoDaddy",
}

,
  {
    name: "Vercel",
    icon: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    proficiency: 85,
    description: "Hosting high-performance frontend apps with Vercel",
  },
];


export default SkillsSection;
