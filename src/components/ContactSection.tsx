"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, CheckCircle, Clock } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";

const MAX_SUBMISSIONS = 3;
const TIME_WINDOW = 24 * 60 * 60 * 1000;
const API_URL = "https://portfolio-api-beta-ivory.vercel.app/api/contact/submit";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0, "Bot detection field must be empty").optional(),
  timestamp: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

const ContactSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitError, setRateLimitError] = useState("");
  const [submissionCount, setSubmissionCount] = useState(0);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detect mobile devices and handle video loading
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // 768px is typical tablet breakpoint
      setIsMobile(mobile);
      
      // Only load video on non-mobile devices
      if (!mobile && videoRef.current) {
        videoRef.current.load();
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  // Load submission history from sessionStorage
  useEffect(() => {
    const storedSubmissions = sessionStorage.getItem("formSubmissions");
    if (storedSubmissions) {
      try {
        const submissions = JSON.parse(storedSubmissions);
        setSubmissionCount(submissions.count || 0);
        setLastSubmissionTime(submissions.lastSubmission || 0);
        
        if (submissions.count >= MAX_SUBMISSIONS) {
          const timeSinceLast = Date.now() - submissions.lastSubmission;
          if (timeSinceLast < TIME_WINDOW) {
            setTimeLeft(TIME_WINDOW - timeSinceLast);
          }
        }
      } catch (error) {
        // Clear corrupted data
        sessionStorage.removeItem("formSubmissions");
      }
    }
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      honeypot: "",
      timestamp: Date.now(),
    },
  });

  const checkRateLimit = (): { allowed: boolean; message?: string } => {
    const currentTime = Date.now();
    
    if (currentTime - lastSubmissionTime > TIME_WINDOW) {
      setSubmissionCount(0);
      setLastSubmissionTime(0);
      sessionStorage.removeItem("formSubmissions");
      return { allowed: true };
    }

    if (submissionCount >= MAX_SUBMISSIONS) {
      const hoursLeft = Math.ceil(timeLeft / (60 * 60 * 1000));
      const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
      
      const message = hoursLeft > 1 
        ? `You've reached the submission limit. Please try again in ${hoursLeft} hours.`
        : `You've reached the submission limit. Please try again in ${minutesLeft} minutes.`;
      
      return { allowed: false, message };
    }

    return { allowed: true };
  };

  const onSubmit = async (data: FormValues) => {
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      setRateLimitError(rateLimitCheck.message || "Rate limit exceeded");
      return;
    }

    if (data.honeypot) {
      setRateLimitError("Invalid submission");
      return;
    }

    setIsSubmitting(true);
    setRateLimitError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          timestamp: Date.now()
        }),
      });

      if (response.status === 429) {
        const resetTime = response.headers.get('Retry-After');
        let waitTime = TIME_WINDOW;
        
        if (resetTime) {
          waitTime = parseInt(resetTime) * 1000;
        }
        
        setTimeLeft(waitTime);
        throw new Error(`Rate limit exceeded. Please try again in ${Math.ceil(waitTime / (60 * 1000))} minutes.`);
      }

      if (!response.ok) {
        throw new Error(`Unable to send message. Please try again later.`);
      }

      await response.json();

      // Update submission count
      const newCount = submissionCount + 1;
      const currentTime = Date.now();
      
      setSubmissionCount(newCount);
      setLastSubmissionTime(currentTime);
      
      sessionStorage.setItem(
        "formSubmissions",
        JSON.stringify({ 
          count: newCount, 
          lastSubmission: currentTime 
        })
      );
      
      setIsSubmitted(true);
      form.reset();

    } catch (error: any) {
      setRateLimitError(error.message || "There was an error submitting your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setRateLimitError("");
    form.reset();
  };

  const resetRateLimit = () => {
    sessionStorage.removeItem("formSubmissions");
    setSubmissionCount(0);
    setTimeLeft(0);
    setLastSubmissionTime(0);
    resetForm();
  };

  const formatTimeLeft = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.ceil((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const isRateLimited = timeLeft > 0 && submissionCount >= MAX_SUBMISSIONS;

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Optimized Background */}
      <div className="absolute inset-0 z-0">
        {!isMobile ? (
          // Video background for desktop/tablet
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            preload="metadata"
            onLoadedData={handleVideoLoad}
            poster="/beach-poster.jpg" // Add a poster frame for faster initial load
          >
            <source src="/beach.mp4" type="video/mp4" />
            <source src="/beach.webm" type="video/webm" /> {/* Add WebM format for better compression */}
            Your browser does not support the video tag.
          </video>
        ) : (
          // Static image background for mobile
          <div 
            className="w-full h-full object-cover bg-cover bg-center"
            style={{ backgroundImage: "url('/beach-static.jpg')" }} // Use a compressed static image
          />
        )}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Get In Touch</h2>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Have a project in mind or want to collaborate? Feel free to reach
            out using the form below.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 mb-6 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertDescription className="ml-2 text-green-800 dark:text-green-300">
                  Thank you for your message! I'll get back to you as soon as possible.
                </AlertDescription>
              </Alert>
              <div className="flex gap-4 flex-col sm:flex-row">
                <Button 
                  onClick={resetForm} 
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                >
                  Send another message
                </Button>
                <Button 
                  variant="outline"
                  onClick={resetRateLimit}
                  className="flex-1 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Reset limits
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Contact Form</CardTitle>
                  <CardDescription className="text-white/80">
                    Fill out the form below to send me a message
                    {submissionCount > 0 && (
                      <span className="block text-sm mt-1">
                        Submissions: {submissionCount}/{MAX_SUBMISSIONS} (resets in 24 hours)
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
                                  {...field}
                                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm"
                                  disabled={isRateLimited || isSubmitting}
                                />
                              </FormControl>
                              <FormMessage className="text-white/80" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Email *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="your.email@example.com"
                                  type="email"
                                  {...field}
                                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm"
                                  disabled={isRateLimited || isSubmitting}
                                />
                              </FormControl>
                              <FormMessage className="text-white/80" />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Subject *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="What is this regarding?"
                                {...field}
                                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm"
                                disabled={isRateLimited || isSubmitting}
                              />
                            </FormControl>
                            <FormMessage className="text-white/80" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write your message here..."
                                className="min-h-[150px] bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm resize-none"
                                {...field}
                                disabled={isRateLimited || isSubmitting}
                              />
                            </FormControl>
                            <FormMessage className="text-white/80" />
                          </FormItem>
                        )}
                      />

                      {/* Honeypot field - hidden from users */}
                      <div className="hidden" aria-hidden="true">
                        <FormField
                          control={form.control}
                          name="honeypot"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Do not fill this out</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  tabIndex={-1}
                                  autoComplete="off"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {rateLimitError && (
                        <Alert variant="destructive" className="backdrop-blur-sm">
                          <Clock className="h-4 w-4" />
                          <AlertDescription>
                            {rateLimitError}
                            {timeLeft > 0 && (
                              <span className="block mt-1 font-medium">
                                Time remaining: {formatTimeLeft(timeLeft)}
                              </span>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200"
                        disabled={isSubmitting || isRateLimited}
                        size="lg"
                      >
                        {isRateLimited ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Rate Limited</span>
                          </div>
                        ) : isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Sending Message...</span>
                          </div>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" /> 
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;