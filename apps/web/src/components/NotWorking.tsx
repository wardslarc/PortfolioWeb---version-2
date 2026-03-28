// src/components/NotWorking.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

const ContactMaintenance = () => {
  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Feel free to reach
            out using the form below and I'll get back to you as soon as
            possible.
          </p>
        </motion.div>

        {/* Maintenance GIF */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center text-center"
        >
          <img
            src="peter.gif"
            alt="Under maintenance"
            className="w-72 max-w-full rounded-lg mb-6"
          />
          <p className="text-base text-muted-foreground">
            The form is under maintenance — making it more secure for users.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactMaintenance;
