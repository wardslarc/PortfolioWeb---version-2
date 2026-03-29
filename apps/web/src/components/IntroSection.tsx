import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const IntroSection = () => {
  const [isHovering, setIsHovering] = useState(false);
  const { manualTimePeriod } = useTheme();

  const getTimePeriod = () => {
    if (manualTimePeriod) return manualTimePeriod;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    return "night";
  };

  const getGreeting = () => {
    const period = getTimePeriod();
    if (period === "morning") return "Good Morning! ";
    if (period === "afternoon") return "Good Afternoon! ";
    return "Good Evening! ";
  };

  const calculateAge = () => {
    const birthDate = new Date(2000, 11, 29);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge();
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <section id="intro" className="py-12 bg-white dark:bg-slate-900">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white">
                About Me
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Get to know the person behind the code
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              <motion.div
                variants={itemVariants}
                className="lg:col-span-5 flex justify-center"
              >
                <div className="relative w-full max-w-xs">
                  <div className="absolute -top-8 -right-8 w-48 h-48 bg-gradient-to-br from-yellow-500/40 to-orange-600/40 rounded-3xl blur-3xl"></div>
                  <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gradient-to-tr from-orange-500/40 to-yellow-600/40 rounded-3xl blur-3xl"></div>

                  <motion.div
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-slate-800"
                  >
                    <div className="relative w-full h-full">
                      <motion.img
                        animate={{ opacity: isHovering ? 0 : 1 }}
                        transition={{ duration: 0.5 }}
                        src="./optimized/photo1.webp"
                        srcSet="./optimized/photo1.webp, ./optimized/photo1.png"
                        alt="Profile"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover absolute inset-0"
                      />
                      <motion.img
                        animate={{ opacity: isHovering ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                        src="./optimized/photo2.webp"
                        srcSet="./optimized/photo2.webp, ./optimized/photo2.png"
                        alt="Profile Alternate"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-xl whitespace-nowrap flex items-center gap-2"
                  >
                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
                    Systems Developer at Rustan
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="lg:col-span-7 space-y-3 pt-4"
              >
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Carls Dale Escalo
                  </h3>
                  <p className="text-xl text-slate-600 dark:text-slate-400 font-medium mb-2">
                    Systems Developer & Full-Stack Web Developer • {age} years old
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {getGreeting()}
                    </span>
                    I&apos;m a developer from the Philippines focused on building
                    scalable, secure, and maintainable web systems that solve real
                    business problems. I currently work as a Systems Developer at
                    Rustan Marketing Corporation in Makati, where I help create
                    internal tools, company websites, and a learning management
                    system tailored for the organization.
                  </p>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    My stack today centers on Next.js, TypeScript, Node.js,
                    Express, MySQL, Docker, Nginx, Python, React, Electron, GCP,
                    and Tailwind CSS. What I enjoy most is turning complex
                    workflows into polished products that feel clean on the
                    frontend and dependable underneath, with strong attention to
                    performance, practical security, and long-term maintainability.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-black rounded-xl border border-slate-900 dark:border-slate-100">
                    <div className="text-4xl font-bold">3+</div>
                    <p className="text-sm mt-2 font-medium">Years Exp</p>
                  </div>

                  <div className="text-center p-4 bg-black dark:bg-white text-white dark:text-black rounded-xl border border-black dark:border-white">
                    <div className="text-4xl font-bold">10+</div>
                    <p className="text-sm mt-2 font-medium">Projects</p>
                  </div>
                </div>

                <motion.div className="flex flex-wrap gap-4 pt-4">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href="#contact"
                    className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    Let&apos;s Collaborate
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
      </motion.div>
    </section>
  );
};

export default IntroSection;
