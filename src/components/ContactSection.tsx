"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, CheckCircle } from "lucide-react";

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
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const MAX_SUBMISSIONS = 3;
const TIME_WINDOW = 24 * 60 * 60 * 1000;

const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=+/gi, "blocked")
    .replace(/eval\(/gi, "blocked")
    .replace(/document\./gi, "blocked")
    .replace(/window\./gi, "blocked");
};

const formSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50)
    .refine(val => !/[<>"';(){}[\]\\]|script|javascript|on\w+\s*=/gi.test(val), {
      message: "Invalid characters detected."
    }),
  email: z
    .string()
    .email()
    .max(100)
    .refine(val => !/[<>"';(){}[\]\\]|script|javascript|on\w+\s*=/gi.test(val), {
      message: "Invalid characters detected."
    }),
  subject: z
    .string()
    .min(5)
    .max(100)
    .refine(val => !/[<>"';(){}[\]\\]|script|javascript|on\w+\s*=/gi.test(val), {
      message: "Invalid characters detected."
    }),
  message: z
    .string()
    .min(10)
    .max(1000)
    .refine(val => !/[<>"';(){}[\]\\]|script|javascript|on\w+\s*=/gi.test(val), {
      message: "Invalid characters detected."
    }),
  honeypot: z.string().max(0).optional(),
  timestamp: z.number().refine(val => Date.now() - val < 10000, {
    message: "Invalid submission timing."
  }),
});

type FormValues = z.infer<typeof formSchema>;

const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxs31_Yc_Sh8IwEo6yv1x2J4BKQ5mQ4rCPYhEpCvy22e4fvT4qKmmgqx0JgOb1T1cBp4A/exec";

const ContactSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitError, setRateLimitError] = useState("");
  const [submissionCount, setSubmissionCount] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [formStartTime] = useState(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const storedSubmissions = sessionStorage.getItem("formSubmissions");
    if (storedSubmissions) {
      const submissions = JSON.parse(storedSubmissions);
      setSubmissionCount(submissions.count);
      if (submissions.count >= MAX_SUBMISSIONS) {
        const timePassed = Date.now() - submissions.lastSubmission;
        if (timePassed < TIME_WINDOW) {
          setRemainingTime(Math.ceil((TIME_WINDOW - timePassed) / (60 * 60 * 1000)));
        }
      }
    }
  }, []);

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

  const onSubmit = async (data: FormValues) => {
    const formFillTime = Date.now() - formStartTime;

    if(formFillTime < 5000){
      setRateLimitError("Please take more time to fill out the form.");
      return;
    }

    const stored = sessionStorage.getItem("formSubmissions");
    const currentTime = Date.now();
    let submissions = stored ? JSON.parse(stored) : { count: 0, lastSubmission: 0};

    if(currentTime - submissions.lastSubmission > TIME_WINDOW){
      submissions.count = 0;
    }

    if(submissions.count >= MAX_SUBMISSIONS){
      const hoursLeft = Math.ceil((TIME_WINDOW - (currentTime - submissions.lastSubmission)) / (60 * 60 * 1000));
      setRateLimitError(`You've reached the submission limit. Please try again in ${hoursLeft} hours.`);
      return;
    }

    setIsSubmitting(true);
    setRateLimitError("");

    try{
      const sanitizedData = {
        name:sanitizeInput(data.name),
        email:sanitizeInput(data.email),
        subject:sanitizeInput(data.subject),
        message:sanitizeInput(data.message),
        userAgent:navigator.userAgent,
        clientTimestamp: data.timestamp,
        fillDuration: formFillTime,
      };
    
    await fetch(WEBAPP_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
      });

      // ✅ We cannot read the response, so just assume success
      const newCount = submissions.count + 1;
      sessionStorage.setItem(
        "formSubmissions",
        JSON.stringify({ count: newCount, lastSubmission: currentTime })
      );
      setSubmissionCount(newCount);
      setIsSubmitted(true);
      form.reset();
    } catch (error: any) {
      console.log("Error submitting message: ", error);
      setRateLimitError("There was an error submitting your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
    /*
    const formFillTime = Date.now() - formStartTime;
    if (formFillTime < 5000) {
      setRateLimitError("Please take more time to fill out the form.");
      return;
    }

    const storedSubmissions = sessionStorage.getItem("formSubmissions");
    const currentTime = Date.now();
    let submissions = storedSubmissions ? JSON.parse(storedSubmissions) : { count: 0, lastSubmission: 0 };

    if (currentTime - submissions.lastSubmission > TIME_WINDOW) {
      submissions.count = 0;
    }

    if (submissions.count >= MAX_SUBMISSIONS) {
      const hoursLeft = Math.ceil((TIME_WINDOW - (currentTime - submissions.lastSubmission)) / (60 * 60 * 1000));
      setRateLimitError(`You've reached the submission limit. Please try again in ${hoursLeft} hours.`);
      return;
    }

    setIsSubmitting(true);
    setRateLimitError("");

    try {
      const sanitizedData = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email),
        subject: sanitizeInput(data.subject),
        message: sanitizeInput(data.message),
      };

      const { honeypot, timestamp, ...cleanData } = data;

      await addDoc(collection(db, "contactMessages"), {
        ...sanitizedData,
        createdAt: Timestamp.now(),
        userAgent: navigator.userAgent,
        clientTimestamp: timestamp,
        fillDuration: formFillTime,
      });

      const newCount = submissions.count + 1;
      const newSubmissions = {
        count: newCount,
        lastSubmission: currentTime,
      };

      sessionStorage.setItem("formSubmissions", JSON.stringify(newSubmissions));
      setSubmissionCount(newCount);
      setIsSubmitted(true);
      form.reset();
    } catch (error: any) {
      console.error("Error submitting message:", error);
      if (error.code === "permission-denied") {
        setRateLimitError("Submission rejected. Please try again later.");
      } else {
        setRateLimitError("There was an error submitting your message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  */
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
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

        <div className="max-w-3xl mx-auto">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 mb-6">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertDescription className="ml-2 text-green-800 dark:text-green-300">
                  Thank you for your message! I'll get back to you as soon as
                  possible.
                </AlertDescription>
              </Alert>
              <Button onClick={() => setIsSubmitted(false)} className="w-full">
                Send another message
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="border-slate-200 dark:border-slate-700 shadow-md">
                <CardHeader>
                  <CardTitle>Contact Form</CardTitle>
                  <CardDescription>
                    Fill out the form below to send me a message
                    {submissionCount > 0 && (
                      <span className="block text-sm mt-2 text-yellow-600 dark:text-yellow-400">
                        Submissions remaining: {MAX_SUBMISSIONS - submissionCount}/{MAX_SUBMISSIONS} (24h)
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
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value.replace(/[<>"']/g, ''))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your.email@example.com"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value.replace(/[<>"']/g, ''))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="What is this regarding?"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value.replace(/[<>"']/g, ''))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write your message here..."
                                className="min-h-[150px]"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value.replace(/[<>"']/g, ''))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="hidden">
                        <FormField
                          control={form.control}
                          name="honeypot"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Do not fill this out</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {rateLimitError && (
                        <Alert variant="destructive">
                          <AlertTitle>Submission Blocked</AlertTitle>
                          <AlertDescription>
                            {rateLimitError}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || submissionCount >= MAX_SUBMISSIONS}
                      >
                        {isSubmitting ? (
                          <span className="animate-pulse">Sending...</span>
                        ) : submissionCount >= MAX_SUBMISSIONS ? (
                          "Limit Reached"
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" /> Send Message
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
