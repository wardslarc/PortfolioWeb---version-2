import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const IntroSection = () => {
  const [isHovering, setIsHovering] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="intro" className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-3 text-slate-900 dark:text-white">
              About Me
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Get to know the person behind the code
            </p>
          </motion.div>

          {/* Main Content Grid - Full Featured Layout */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Photo Section - Featured Left */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative w-full max-w-sm">
                {/* Gradient background accent - top right */}
                <div className="absolute -top-8 -right-8 w-48 h-48 bg-gradient-to-br from-yellow-500/40 to-orange-600/40 rounded-3xl blur-3xl"></div>
                
                {/* Gradient background accent - bottom left */}
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gradient-to-tr from-orange-500/40 to-yellow-600/40 rounded-3xl blur-3xl"></div>

                {/* Main photo frame */}
                <motion.div
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 bg-slate-300 dark:bg-slate-700 border-8 border-white dark:border-slate-800"
                >
                  {/* Photo with transition */}
                  <div className="relative w-full h-full">
                    <motion.img
                      animate={{ opacity: isHovering ? 0 : 1 }}
                      transition={{ duration: 0.5 }}
                      src="./photo1.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    <motion.img
                      animate={{ opacity: isHovering ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      src="./photo2.jpg"
                      alt="Profile Alternate"
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>

                {/* Floating badge - bottom center */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-xl whitespace-nowrap flex items-center gap-2"
                >
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
                  Open to Work
                </motion.div>
              </div>
            </motion.div>

            {/* Content Section - Right */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-7 space-y-6 pt-4"
            >
              {/* Greeting */}
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                  Carls Dale Escalo
                </h3>
                <p className="text-xl text-slate-600 dark:text-slate-400 font-medium mb-2">
                  Full-Stack Web Developer
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  I'm Carls Dale Escalo, a Full-Stack Web Developer based in the Philippines with over 2 years of experience turning complex problems into streamlined digital experiences. My journey started during a formative internship at Business Machine Corporation and has since evolved into a career focused on building high-performance internal tools and corporate web infrastructures.
                </p>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  I specialize in the MERN stack (MongoDB, Express, React, Node) and TypeScript, with a keen interest in security and automation. Whether I'm spearheading internal apps at Citimax Group or building productivity tools like Reflective Pomodoro, my goal is always the same: to write clean, maintainable code that delivers real-world value.
                </p>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  When I'm not debugging or configuring DNS settings, you can find me exploring UI/UX principles or refining my art gallery—I believe the best software is where logic meets aesthetic.
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-black rounded-xl border border-slate-900 dark:border-slate-100">
                  <div className="text-4xl font-bold">2+</div>
                  <p className="text-sm mt-2 font-medium">Years Exp</p>
                </div>

                <div className="text-center p-4 bg-black dark:bg-white text-white dark:text-black rounded-xl border border-black dark:border-white">
                  <div className="text-4xl font-bold">10+</div>
                  <p className="text-sm mt-2 font-medium">Projects</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-4 pt-4"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  href="#contact"
                  className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  Let's Collaborate
                  <span>→</span>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  href="#projects"
                  className="px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white font-semibold rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                >
                  View Projects
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;
