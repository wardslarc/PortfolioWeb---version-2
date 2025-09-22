import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "./ui/button";
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
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-white"
          >
            Carls Dale Escalo
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="mt-2 text-2xl font-medium text-sky-400"
          >
            Web Developer / Digital Artist
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg max-w-xl text-gray-300"
          >
            I build modern, responsive web applications with React, TypeScript, and Tailwind CSS.
          </motion.p>
        </motion.div>

        {/* Socials */}
        <motion.div
          className="mt-6 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <a href="https://github.com/wardslarc" target="_blank" rel="noopener noreferrer">
            <Github size={24} color="white" />
          </a>
          <a href="https://www.linkedin.com/in/carls-dale-escalo-797701366/" target="_blank" rel="noopener noreferrer">
            <Linkedin size={24} color="white" />
          </a>
          <a href="https://x.com/daleonigiri" target="_blank" rel="noopener noreferrer">
            <Twitter size={24} color="white" />
          </a>
        </motion.div>

        {/* View My Work Button */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Link to="projects" smooth={true} duration={600}>
            <Button
              className="
                bg-white
                text-slate-900
                px-10 py-4
                rounded-sm
                font-bold
                shadow-lg
                hover:bg-gray-100
                transition-all
                flex items-center
              "
            >
              View My Work
              <ArrowDown size={18} className="ml-2 animate-bounce" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
