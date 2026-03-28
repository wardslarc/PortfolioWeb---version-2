"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, CheckCircle, Loader2, Shield, Mail } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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

const API_URL =
  process.env.NEXT_PUBLIC_CONTACT_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001/api/contact"
    : "/api/contact");

const formSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  subject: z.string().trim().min(5, "Subject must be at least 5 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0, "Bot detection field must be empty").optional(),
  timestamp: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

type SubmissionStage = "idle" | "validating" | "sending" | "success" | "error";

const createDefaultValues = (): FormValues => ({
  name: "",
  email: "",
  subject: "",
  message: "",
  honeypot: "",
  timestamp: Date.now(),
});

const ContactSection = () => {
  const { manualTimePeriod } = useTheme();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStage, setSubmissionStage] = useState<SubmissionStage>("idle");
  const [submissionError, setSubmissionError] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(),
  });

  useEffect(() => {
    // Refresh the client-side start time after hydration so the backend can
    // reject unrealistically fast bot submissions without blocking real users.
    form.setValue("timestamp", Date.now(), {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [form]);

  const resetTimestamp = () => {
    form.setValue("timestamp", Date.now(), {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  };

  const getTimePeriod = () => {
    if (manualTimePeriod) return manualTimePeriod;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    return "night";
  };

  const getBackgroundImage = () => {
    const period = getTimePeriod();
    if (period === "morning") {
      return "url('/optimized/morning.webp'), url('/optimized/morning.png')";
    }
    if (period === "afternoon") {
      return "url('/optimized/afternoon.webp'), url('/optimized/afternoon.png')";
    }
    return "url('/optimized/night.webp'), url('/optimized/night.png')";
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmissionStage("validating");
    setSubmissionError("");

    if (data.honeypot) {
      setSubmissionStage("error");
      setSubmissionError("Invalid submission.");
      setIsSubmitting(false);
      return;
    }

    setSubmissionStage("sending");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          timestamp: data.timestamp,
        }),
      });

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          responseBody?.error || "Unable to send message. Please try again later.",
        );
      }

      setSubmissionStage("success");
      setIsSubmitted(true);
      form.reset(createDefaultValues());
    } catch (error) {
      setSubmissionStage("error");
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "There was an error submitting your message. Please try again later.",
      );
      resetTimestamp();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmissionStage("idle");
    setSubmissionError("");
    form.reset(createDefaultValues());
  };

  const getStageMessage = (stage: SubmissionStage): string => {
    switch (stage) {
      case "validating":
        return "Validating your message...";
      case "sending":
        return "Sending your message...";
      default:
        return "Processing your request...";
    }
  };

  const getStageIcon = (stage: SubmissionStage) => {
    switch (stage) {
      case "validating":
        return <Shield className="h-5 w-5" />;
      case "sending":
        return <Mail className="h-5 w-5" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />;
    }
  };

  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col overflow-hidden bg-gray-50"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-1 flex-col justify-center py-20"
      >
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: getBackgroundImage() }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Get In Touch</h2>
            <p className="mx-auto max-w-2xl text-lg text-white/90">
              Have a project in mind or want to collaborate? Feel free to reach out
              using the form below.
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <AlertDescription className="ml-2 text-green-800 dark:text-green-300">
                    Thank you for your message! I&apos;ll get back to you as soon as
                    possible.
                  </AlertDescription>
                </Alert>
                <div className="flex justify-center">
                  <Button
                    onClick={resetForm}
                    className="border-white/30 bg-white/20 text-white hover:bg-white/30"
                  >
                    Send another message
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="border-white/20 bg-white/5 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-white">Contact Form</CardTitle>
                    <CardDescription className="text-white/80">
                      Fill out the form below to send me a message.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    {isSubmitting && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-black/50"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="mx-4 max-w-sm rounded-lg border border-white/30 bg-white/10 p-6"
                        >
                          <div className="mb-4 flex items-center gap-3">
                            <div className="animate-spin text-white">
                              <Loader2 className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold text-white">
                              Processing your message
                            </h3>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-white/80">
                              {getStageIcon(submissionStage)}
                              <span className="text-sm">{getStageMessage(submissionStage)}</span>
                            </div>

                            <div className="h-1.5 w-full rounded-full bg-white/20">
                              <motion.div
                                className="h-1.5 rounded-full bg-white"
                                initial={{ width: "0%" }}
                                animate={{
                                  width: submissionStage === "validating" ? "40%" : "85%",
                                }}
                                transition={{ duration: 0.25 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="relative space-y-6"
                        noValidate
                      >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Name *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your name"
                                    autoComplete="name"
                                    {...field}
                                    className="border-white/30 bg-white/20 text-white placeholder:text-white/60"
                                    disabled={isSubmitting}
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
                                    autoComplete="email"
                                    inputMode="email"
                                    {...field}
                                    className="border-white/30 bg-white/20 text-white placeholder:text-white/60"
                                    disabled={isSubmitting}
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
                                  autoComplete="off"
                                  {...field}
                                  className="border-white/30 bg-white/20 text-white placeholder:text-white/60"
                                  disabled={isSubmitting}
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
                                  className="min-h-[150px] resize-none border-white/30 bg-white/20 text-white placeholder:text-white/60"
                                  {...field}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage className="text-white/80" />
                            </FormItem>
                          )}
                        />

                        <div
                          className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0"
                          aria-hidden="true"
                        >
                          <FormField
                            control={form.control}
                            name="honeypot"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Leave this field empty</FormLabel>
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

                        {submissionError && (
                          <Alert variant="destructive">
                            <AlertDescription>{submissionError}</AlertDescription>
                          </Alert>
                        )}

                        <Button
                          type="submit"
                          className="relative w-full border-white/30 bg-white/20 text-white transition-all duration-200 hover:bg-white/30"
                          disabled={isSubmitting}
                          size="lg"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span>Processing...</span>
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
      </motion.div>
    </section>
  );
};

export default ContactSection;
