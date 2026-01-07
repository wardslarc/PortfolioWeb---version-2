import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Twitter, FileText, Flashlight } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useTheme } from "../context/ThemeContext";
import { getNetworkStatus } from "@/lib/mobilePerformance";

// Animation variants with mobile optimization
const getContainerVariants = (isSlowNetwork: boolean) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: isSlowNetwork ? 0.05 : 0.1,
      delayChildren: isSlowNetwork ? 0.1 : 0.2,
    },
  },
});

const itemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

const HeroSection = () => {
  const { manualTimePeriod } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);

  // Detect slow network for mobile optimization
  const networkStatus = useMemo(() => getNetworkStatus(), []);
  const containerVariants = useMemo(() => getContainerVariants(networkStatus.isSlowNetwork), [networkStatus.isSlowNetwork]);

  // Determine time period
  const getTimePeriod = () => {
    if (manualTimePeriod) return manualTimePeriod;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    return "night";
  };

  // Determine background image based on time of day (using optimized versions)
  const getBackgroundImage = () => {
    const period = getTimePeriod();
    // Use optimized WebP images with PNG fallback via CSS
    if (period === "morning") return "url('/optimized/morning.webp'), url('/optimized/morning.png')";
    if (period === "afternoon") return "url('/optimized/afternoon.webp'), url('/optimized/afternoon.png')";
    return "url('/optimized/night.webp'), url('/optimized/night.png')";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleClick = () => {
    if (getTimePeriod() === "night") {
      const audio = new Audio('/flashlight.mp3');
      audio.play().catch(error => console.log('Audio play failed:', error));
    }
    setFlashlightOn(!flashlightOn);
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden text-white cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-center bg-cover"
        style={{ backgroundImage: getBackgroundImage() }}
      />

      {/* Flashlight effect - follows cursor, toggle with click */}
      {getTimePeriod() === "night" && flashlightOn && (
        <>
          {/* Flashlight beam */}
          <motion.div
            className="absolute z-30 pointer-events-none rounded-full"
            style={{
              left: mousePosition.x - 100,
              top: mousePosition.y - 100,
              width: 200,
              height: 200,
              background:
                "radial-gradient(circle, rgba(255,200,100,0.6) 0%, rgba(255,200,100,0.3) 40%, rgba(255,200,100,0.1) 70%, transparent 100%)",
              filter: "blur(10px)",
              mixBlendMode: "screen",
              boxShadow: "0 0 50px rgba(255,200,100,0.5)",
            }}
            transition={{ type: "tween", duration: 0.05 }}
          />

          {/* Bright center spot */}
          <motion.div
            className="absolute z-30 pointer-events-none rounded-full"
            style={{
              left: mousePosition.x - 40,
              top: mousePosition.y - 40,
              width: 80,
              height: 80,
              background:
                "radial-gradient(circle, rgba(255,220,150,0.9) 0%, rgba(255,200,100,0.5) 60%, transparent 100%)",
              filter: "blur(8px)",
              mixBlendMode: "screen",
            }}
            transition={{ type: "tween", duration: 0.05 }}
          />
        </>
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
            className={`text-base uppercase tracking-widest cursor-pointer mb-8 ${
              getTimePeriod() === "morning" ? "text-black" : getTimePeriod() === "afternoon" ? "text-gray-800" : "text-gray-400"
            }`}
            whileHover={{ opacity: [1, 0.4, 1, 0.4, 1] }}
            transition={{ duration: 0.6 }}
          >
            Based in Cavite, Philippines
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className={`text-4xl md:text-6xl font-bold cursor-pointer leading-tight ${
              getTimePeriod() === "morning" ? "text-white" : "text-white"
            }`}
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "clamp(2rem, 8vw, 5rem)",
              background: "linear-gradient(135deg, #5b21b6 0%, #3b82f6 50%, #1e40af 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 60px rgba(255, 255, 255, 0.4))"
            }}
            whileHover={{ opacity: [1, 0.4, 1, 0.4, 1] }}
            transition={{ duration: 0.6 }}
          >
          Where <span style={{ fontFamily: "'Lora', serif" }}>Clean Code</span>
            <br />
            Meets Creative <span style={{ fontFamily: "'Lora', serif", background: "linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #0369a1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Execution</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-xl max-w-2xl cursor-pointer"
            style={{ color: getTimePeriod() === "night" ? "white" : "#181818" }}
            whileHover={{ opacity: [1, 0.4, 1, 0.4, 1] }}
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
          <a href="#about-me" onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById('about-me');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}>
            <Button
              className="px-8 py-3 rounded-sm font-semibold transition-all flex items-center hover:opacity-80"
              style={{
                background: "linear-gradient(135deg, #5b21b6 0%, #3b82f6 50%, #1e40af 100%)",
                color: "white",
                border: "none"
              }}
            >
              About Me
              <ArrowDown size={16} className="ml-2" />
            </Button>
          </a>
          
          <a href="/Escalo-CarlsDale_Resume.pdf" target="_blank" rel="noopener noreferrer">
            <Button
              className="px-8 py-3 rounded-sm font-semibold transition-all flex items-center hover:opacity-80"
              style={{
                background: "linear-gradient(135deg, #5b21b6 0%, #3b82f6 50%, #1e40af 100%)",
                color: "white",
                border: "none"
              }}
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
