import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Twitter, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Link } from "react-scroll";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden text-white"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-center bg-cover"
        style={{ backgroundImage: "url('/nightly.jpg')" }}
      />

      {/* Dark gradient with cursor spotlight */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900 to-slate-800 pointer-events-none"
        style={{
          WebkitMaskImage: isHovering
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, transparent 120px, rgba(0,0,0,0.95) 200px)`
            : 'none',
          maskImage: isHovering
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, transparent 120px, rgba(0,0,0,0.95) 200px)`
            : 'none',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      />

      {/* Rain effect */}
      <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-5 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, 100], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random(),
            }}
          />
        ))}
      </div>

      {/* Cursor glow */}
      {isHovering && (
        <motion.div
          className="absolute z-30 pointer-events-none"
          style={{
            left: mousePosition.x - 150,
            top: mousePosition.y - 150,
            width: 300,
            height: 300,
            background:
              "radial-gradient(circle, rgba(251,186,60,0.35) 0%, rgba(251,186,60,0.15) 40%, transparent 70%)",
            borderRadius: "50%",
            mixBlendMode: "screen",
            filter: "blur(25px)",
          }}
          animate={{
            opacity: [0.9, 0.4, 0.7, 1, 0.3, 0.85, 0.6, 0.95],
            scale: [0.95, 1.02, 0.98, 1, 0.96, 1.01, 0.99, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      )}

      {/* Main Content */}
      <div className="relative z-40 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm uppercase tracking-widest text-gray-400 cursor-pointer mb-8"
            whileHover={{ opacity: [1, 0.5, 1, 0.5, 1] }}
            transition={{ duration: 0.6 }}
          >
            Based in Philippines
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-white cursor-pointer leading-tight"
            whileHover={{ opacity: [1, 0.5, 1, 0.5, 1] }}
            transition={{ duration: 0.6 }}
          >
          Where <span className="text-blue-400">Clean Code</span>
            <br />
            Meets Creative <span className="text-white">Execution</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-lg max-w-2xl text-gray-300 cursor-pointer"
            whileHover={{ opacity: [1, 0.5, 1, 0.5, 1] }}
            transition={{ duration: 0.6 }}
          >
            Hi, I'm Carls Dale. I create intuitive, visually stunning and highly functional web applications.
          </motion.p>
        </motion.div>

        {/* Socials */}
        <motion.div
          className="mt-6 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="https://github.com/wardslarc" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Github size={24} color="white" />
                </a>
              </TooltipTrigger>
              <TooltipContent>Check out my GitHub</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a href="https://www.linkedin.com/in/carls-dale-escalo-797701366/" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Linkedin size={24} color="white" />
                </a>
              </TooltipTrigger>
              <TooltipContent>Connect on LinkedIn</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a href="https://x.com/daleonigiri" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Twitter size={24} color="white" />
                </a>
              </TooltipTrigger>
              <TooltipContent>Follow me on X</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="mt-10 flex gap-4 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Link to="intro" smooth={true} duration={600}>
            <Button
              className="
                border border-white
                text-white
                bg-transparent
                px-8 py-3
                rounded-sm
                font-semibold
                hover:bg-white/10
                transition-all
                flex items-center
              "
            >
              About Me
              <ArrowDown size={16} className="ml-2" />
            </Button>
          </Link>
          
          <a href="/Escalo-Carls_Resume.pdf" target="_blank" rel="noopener noreferrer">
            <Button
              className="
                border border-white
                text-white
                bg-transparent
                px-8 py-3
                rounded-sm
                font-semibold
                hover:bg-white/10
                transition-all
                flex items-center
              "
            >
              <FileText size={16} className="mr-2" />
              Download CV
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
