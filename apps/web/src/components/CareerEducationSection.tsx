import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, MapPin, X } from "lucide-react";
import { useState, useRef } from "react";

const CareerEducationSection = () => {
  const [hoveredWebsite, setHoveredWebsite] = useState<string | null>(null);
  const careerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const educationRefs = useRef<(HTMLDivElement | null)[]>([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const sectionTitleVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const columnVariants = {
    hidden: { opacity: 0, x: 0 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 },
    },
  };

  const careerData = [
    {
      title: "IT Staff / Web Developer",
      company: "Citimax Group Inc.",
      period: "Oct 2023 - Nov 2025",
      location: "Taguig, Philippines",
      description: "Internal tools development, infrastructure management, and corporate web support",
      logo: "/optimized/citimax.webp",
      previewImage: "/optimized/citimax.webp",
      achievements: [
        "Spearheaded development of multiple internal web applications using React.js, TypeScript, and Firebase",
        "Integrated Google Sheets API to automate task tracking and ticketing, significantly improving workflow efficiency",
        "Managed end-to-end project lifecycles including domain procurement, DNS configuration, and Vercel deployment",
        "Developed real-time library seat status monitoring system improving space utilization and user visibility"
      ],
      technologies: ["React.js", "TypeScript", "Firebase", "Node.js", "MongoDB", "Vercel", "Cloudflare", "REST APIs"],
      website: "https://citimax.ph/",
      type: "career",
    },
    {
      title: "Web Developer Internship",
      company: "Business Machine Corporation",
      period: "Mar 2023 - June 2023",
      location: "Taguig, Philippines",
      description: "Full-stack development with focus on user-centered design and security implementation",
      logo: "/optimized/bismac.webp",
      previewImage: "/optimized/bismac.webp",
      achievements: [
        "Developed a library seat status monitoring system that enabled real-time tracking, improving space utilization and user visibility",
        "Collaborated on an e-commerce prototype, refining UI responsiveness and interaction design to enhance the user experience",
        "Applied user-centered design principles and strengthened full-stack skills through hands-on development and debugging cycles"
      ],
      technologies: ["HTML5", "CSS", "Javascript", "PHP", "MYSQL"],
      website: "https://bismac.com.ph/",
      type: "career",
    },
  ];

  const educationData = [
    {
      title: "Bachelor of Science in Computer Science Major in Social Computing",
      institution: "University of Makati",
      period: "May 2019 - Sept 2023",
      location: "Taguig, Philippines",
      description: "Focused on web development, software engineering, and social computing principles",
      logo: "/optimized/umaklogo.webp",
      previewImage: "/optimized/umak.webp",
      website: "https://www.umak.edu.ph/",
      type: "education",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-4 text-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="w-full"
      >
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2
            variants={sectionTitleVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
          >
            Career & Education
          </motion.h2>
          <motion.p
            variants={sectionTitleVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            My professional journey and academic background
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Career Section */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="relative overflow-visible"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4 overflow-visible"
            >
              <div className="flex items-center gap-2 mb-8">
                <Briefcase size={32} className="text-blue-500" />
                <h3 className="text-3xl font-bold">Career</h3>
              </div>

              {careerData.map((item, index) => (
                <motion.div
                  key={index}
                  ref={(el) => {careerRefs.current[index] = el}}
                  variants={cardVariants}
                  whileHover="hover"
                  className="relative overflow-visible bg-white rounded-lg p-5 border-2 border-gray-300 hover:border-blue-500 transition-all shadow-md cursor-pointer"
                  onMouseEnter={() => setHoveredWebsite(item.website)}
                  onMouseLeave={() => setHoveredWebsite(null)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      {item.logo && (
                        <img
                          src={item.logo}
                          alt={item.company}
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                      )}
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                        <p className="text-blue-600 font-medium">{item.company}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{item.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700">{item.description}</p>

                  {/* Technologies */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.technologies && item.technologies.map((tech, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Achievements */}
                  {item.achievements && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Key Achievements:</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {item.achievements.slice(0, 2).map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Website Preview Window */}
                  {hoveredWebsite === item.website && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute bottom-full left-0 mb-2 z-[9999] bg-white border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden w-80"
                    >
                      <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
                        <span className="text-sm font-bold truncate">{item.website}</span>
                        <button
                          onClick={() => setHoveredWebsite(null)}
                          className="text-white hover:text-gray-200 transition-colors p-1"
                          aria-label="Close preview"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="w-full h-48 bg-gray-100 relative">
                        <img
                          src={item.previewImage}
                          alt="Institution preview"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center hover:bg-black/30 transition-all">
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-50 transition-colors"
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Education Section */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="relative overflow-visible"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4 overflow-visible"
            >
              <div className="flex items-center gap-2 mb-8">
                <GraduationCap size={32} className="text-purple-500" />
                <h3 className="text-3xl font-bold">Education</h3>
              </div>

              {educationData.map((item, index) => (
                <motion.div
                  key={index}
                  ref={(el) => {educationRefs.current[index] = el}}
                  variants={cardVariants}
                  whileHover="hover"
                  className="relative overflow-visible bg-white rounded-lg p-5 border-2 border-gray-300 hover:border-purple-500 transition-all shadow-md cursor-pointer"
                  onMouseEnter={() => setHoveredWebsite(item.website)}
                  onMouseLeave={() => setHoveredWebsite(null)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      {item.logo && (
                        <img
                          src={item.logo}
                          alt={item.institution}
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                      )}
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                        <p className="text-purple-600 font-medium">{item.institution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{item.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700">{item.description}</p>

                  {/* Website Preview Window */}
                  {hoveredWebsite === item.website && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute bottom-full left-0 mb-2 z-[9999] bg-white border-2 border-purple-500 rounded-lg shadow-2xl overflow-hidden w-80"
                    >
                      <div className="bg-purple-500 text-white p-3 flex justify-between items-center">
                        <span className="text-sm font-bold truncate">{item.website}</span>
                        <button
                          onClick={() => setHoveredWebsite(null)}
                          className="text-white hover:text-gray-200 transition-colors p-1"
                          aria-label="Close preview"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="w-full h-48 bg-gray-100 relative">
                        <img
                          src={item.previewImage || "/optimized/umak.webp"}
                          alt="Institution preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center hover:bg-black/30 transition-all">
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-purple-600 px-4 py-2 rounded font-semibold hover:bg-purple-50 transition-colors"
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
      </motion.div>
    </section>
  );
};

export default CareerEducationSection;
