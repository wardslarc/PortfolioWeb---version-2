import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { sanitizeInput, validateChatMessage, isUrlSafe } from "../lib/security";
import {
  X,
  MessageCircle,
  Send,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Mic,
  Smile,
  Loader2,
  Clock,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  Zap,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Book,
  Code,
  Palette,
  Briefcase,
  HelpCircle,
} from "lucide-react";

// Define proper TypeScript interfaces
interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  time: string;
  reactions?: {
    likes: number;
    dislikes: number;
  };
  isSuggestion?: boolean;
  suggestions?: string[];
  confidence?: number;
  isOutOfScope?: boolean;
}

// Enhanced AI response categories with confidence scores
interface AIResponseCategory {
  keywords: string[];
  responses: string[];
  context?: string[];
  confidence: number; // 0-1 scale
  relatedSections?: string[];
}

const ChatBotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const responseCache = useRef<Map<string, any>>(new Map());

  // Enhanced AI responses with better keyword matching
  const aiResponseCategories: AIResponseCategory[] = [
    {
      keywords: [
        "about",
        "who",
        "background",
        "person",
        "introduction",
        "tell me about",
        "describe",
        "who is",
        "biography",
        "bio",
        "journey",
      ],
      responses: [
        "Carl is a full-stack developer based in the Philippines with over 2 years of experience building high-performance web applications. Check the About Me section for his detailed story!",
        "Learn more about Carl in the About Me section - he shares his journey, expertise in the MERN stack, and passion for creating elegant digital solutions.",
        "Carl's background spans from internships at Business Machine Corporation to leading development at Citimax Group. The About Me section has all the details!",
        "Discover Carl's professional journey and personal philosophy in the About Me section above.",
      ],
      context: [
        "personality",
        "introduction",
        "bio",
        "what",
        "tell",
        "describe",
        "story",
        "journey",
      ],
      confidence: 0.95,
      relatedSections: ["About Me", "Skills", "Projects"],
    },
    {
      keywords: [
        "project",
        "portfolio",
        "work",
        "github",
        "repository",
        "code",
        "app",
        "website",
        "application",
        "software",
        "program",
        "build",
        "create",
      ],
      responses: [
        "Carl has developed several full-stack projects using React, Node.js, and modern web technologies. You can find detailed information in the Projects section above!",
        "Check out Carl's projects in the Projects section. Each project includes technologies used, live demos, and source code links.",
        "Carl's portfolio includes responsive web applications built with React, TypeScript, and various backend technologies. The Projects section has all the details.",
        "You can view Carl's projects in the Projects section. They showcase his skills in web development, including both frontend and backend work.",
      ],
      context: [
        "development",
        "coding",
        "programming",
        "web",
        "app",
        "show",
        "see",
        "view",
        "look",
        "example",
      ],
      confidence: 0.95,
      relatedSections: ["Projects", "Skills"],
    },
    {
      keywords: [
        "skill",
        "technology",
        "tech",
        "stack",
        "programming",
        "language",
        "framework",
        "tool",
        "expertise",
        "proficient",
        "know",
        "learn",
        "able",
      ],
      responses: [
        "Carl's technical skills include: Frontend (React, TypeScript, Tailwind CSS), Backend (Node.js, Express, Python), Databases (MongoDB, PostgreSQL), and DevOps (Docker, AWS). See the Skills section for details!",
        "Carl is proficient in modern web development technologies. The Skills section provides a comprehensive overview of his technical expertise.",
        "From frontend frameworks to backend technologies and cloud services, Carl has experience across the full stack. Check the Skills section for specifics.",
        "Carl's skills range from frontend development with React to backend systems and cloud deployment. You can see all his technical skills in the Skills section above.",
      ],
      context: [
        "abilities",
        "expertise",
        "proficiency",
        "experience",
        "what",
        "which",
        "have",
      ],
      confidence: 0.9,
      relatedSections: ["Skills", "Projects"],
    },
    {
      keywords: [
        "contact",
        "email",
        "hire",
        "job",
        "collaborate",
        "work together",
        "opportunity",
        "freelance",
        "reach",
        "connect",
        "message",
        "send",
        "talk",
        "speak",
      ],
      responses: [
        "You can contact Carl through the Contact section above or connect via LinkedIn/GitHub links in the footer. He's open to collaboration opportunities!",
        "For professional inquiries, please use the contact form above. Carl typically responds within 24 hours to serious inquiries.",
        "Looking to work together? Check out Carl's social links in the footer or use the contact form to get in touch directly.",
        "To contact Carl, use the contact form in the Contact section above, or connect with him on LinkedIn or GitHub (links in the footer).",
      ],
      context: [
        "communication",
        "connect",
        "reach out",
        "collaboration",
        "how",
        "where",
        "way",
      ],
      confidence: 0.85,
      relatedSections: ["Contact"],
    },
    {
      keywords: [
        "art",
        "design",
        "creative",
        "illustration",
        "digital art",
        "graphic",
        "drawing",
        "painting",
        "artwork",
        "creative work",
        "visual",
        "design work",
      ],
      responses: [
        "Beyond coding, Carl has artistic skills! The Art section showcases digital illustrations and creative works that complement his technical abilities.",
        "Carl enjoys digital art and design as a creative outlet. You can view his artwork in the Art section of this portfolio.",
        "Check out the Art section for Carl's creative projects, including digital illustrations and design work.",
        "Carl creates digital artwork alongside his development projects. You can see examples in the Art section above.",
      ],
      context: [
        "creative",
        "visual",
        "artistic",
        "design",
        "show",
        "see",
        "example",
      ],
      confidence: 0.8,
      relatedSections: ["Art"],
    },
    {
      keywords: [
        "resume",
        "cv",
        "experience",
        "background",
        "education",
        "qualification",
        "certification",
        "career",
        "work history",
        "professional",
      ],
      responses: [
        "For Carl's detailed resume, professional experience, or educational background, please contact him directly through the contact form above.",
        "You can request Carl's resume or learn more about his professional background by reaching out via the contact form.",
        "Detailed professional experience and qualifications are available upon request. Use the contact form to inquire.",
        "Carl's full professional background and resume details are available by contacting him through the contact form above.",
      ],
      context: [
        "professional",
        "career",
        "work history",
        "education",
        "what",
        "have",
        "background",
      ],
      confidence: 0.75,
      relatedSections: ["Contact"],
    },
    {
      keywords: [
        "about",
        "who",
        "background",
        "person",
        "introduction",
        "tell me about",
        "describe",
        "who is",
      ],
      responses: [
        "Carl is a full-stack developer with a passion for creating beautiful, functional web applications and digital art. Explore the Hero section for more!",
        "Carl is a developer based in the Philippines who loves solving problems with code and creating digital art. Check the Hero section for his introduction.",
        "Learn more about Carl in the Hero section at the top of this portfolio.",
        "Carl combines technical skills with creative design. You can learn more about him in the Hero section above.",
      ],
      context: [
        "personality",
        "introduction",
        "bio",
        "what",
        "tell",
        "describe",
      ],
      confidence: 0.7,
      relatedSections: ["Hero"],
    },
    {
      keywords: [
        "hello",
        "hi",
        "hey",
        "greetings",
        "howdy",
        "good morning",
        "good afternoon",
        "good evening",
        "sup",
      ],
      responses: [
        "👋 Hello! I'm Carl's AI assistant. I can help you explore his portfolio, discuss his projects, skills, artwork, or help you get in touch. What would you like to know?",
        "Hi there! Welcome to Carl's portfolio. I can tell you about his work, skills, art, or help you connect with him. How can I assist you today?",
        "Hey! I'm here to help you navigate Carl's portfolio. Feel free to ask about anything you see here!",
        "Hello! Welcome to Carl's portfolio. I can help you explore his projects, skills, artwork, or help you get in touch with him.",
      ],
      context: ["greeting", "welcome", "introduction", "start"],
      confidence: 1.0,
      relatedSections: [],
    },
    {
      keywords: ["thank", "thanks", "appreciate", "grateful", "thank you"],
      responses: [
        "You're very welcome! 😊 I'm glad I could help. Is there anything else you'd like to know about Carl's work?",
        "My pleasure! Feel free to ask if you have more questions about the portfolio.",
        "Happy to help! Let me know if you need more information about anything specific.",
        "You're welcome! Let me know if there's anything else I can help you with regarding Carl's portfolio.",
      ],
      context: ["gratitude", "appreciation", "thanks"],
      confidence: 0.95,
      relatedSections: [],
    },
    {
      keywords: [
        "bye",
        "goodbye",
        "see you",
        "farewell",
        "take care",
        "later",
        "goodbye",
        "cya",
      ],
      responses: [
        "Goodbye! Thanks for visiting Carl's portfolio. Feel free to return if you have more questions!",
        "See you later! Don't hesitate to reopen this chat if you need more information.",
        "Take care! Remember you can always come back to explore more of Carl's work.",
        "Goodbye! I hope you found the information you were looking for. Come back anytime!",
      ],
      context: ["farewell", "closing", "end", "exit"],
      confidence: 0.9,
      relatedSections: [],
    },
    {
      keywords: [
        "help",
        "what can you do",
        "capabilities",
        "assist",
        "support",
        "guide",
        "help me",
        "can you help",
      ],
      responses: [
        "I can help you with: • Information about Carl's background • Projects and portfolio • Technical skills • Artwork • Contact information",
        "I'm here to assist you with: Exploring Carl's background, projects, skills, artwork, and contact details. What would you like to know?",
        "I can provide information about: Carl's story and background, projects, skills, artwork, and how to get in touch.",
        "I can help you explore Carl's entire portfolio: Background, projects, skills, creative work, and contact information. What interests you?",
      ],
      context: ["assistance", "help", "support", "guide", "what"],
      confidence: 1.0,
      relatedSections: ["All"],
    },
    {
      keywords: [
        "this",
        "what is this",
        "what is ai",
        "what are you",
        "who are you",
        "introduce yourself",
      ],
      responses: [
        "I'm an AI assistant for Carl's portfolio website. I can help you explore his work, skills, and projects. Ask me anything about his portfolio!",
        "I'm Carl's portfolio assistant - an AI designed to help visitors learn about his work, skills, and projects. How can I help you today?",
        "I'm the AI assistant for this portfolio. I can tell you about Carl's projects, technical skills, artwork, and how to contact him.",
        "I'm here to help you navigate Carl's portfolio. I can answer questions about his work, skills, art, and contact information.",
      ],
      context: ["ai", "assistant", "what", "who", "introduce"],
      confidence: 0.95,
      relatedSections: [],
    },
  ];

  // Out-of-scope patterns - made more specific to avoid false positives
  const outOfScopePatterns = [
    // Technical support for unrelated tools - make more specific
    /\b(photoshop tutorial|illustrator help|figma guide|adobe support|microsoft office help|excel formula|word template|powerpoint presentation)\b/i,
    // Personal or private information - keep specific
    /\b(age|birthday|birth date|address|phone number|social security|password|credit card|bank account)\b/i,
    // Current events/news - more specific
    /\b(latest news|political news|election results|sports scores|celebrity gossip|movie reviews|tv show episodes)\b/i,
    // Time-sensitive queries
    /\b(current time|time now|today's date|what day is it|weather forecast|temperature now)\b/i,
    // Complex computations
    /\b(calculate this|math problem|solve equation|physics formula|chemistry reaction)\b/i,
    // Medical/legal advice
    /\b(medical advice|doctor opinion|health diagnosis|legal advice|lawyer consultation)\b/i,
  ];

  // Low confidence patterns (trigger clarification) - reduced to avoid false positives
  const lowConfidencePatterns = [
    /\b(why does|how come|explain in detail|detailed tutorial|step by step guide)\b/i,
    /\b(your opinion|what do you think|personal feeling|emotional response)\b/i,
    /\b(predict the future|what will happen|future prediction|tell me tomorrow)\b/i,
  ];

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "👋 Hello! I'm Carl's AI assistant. I can help you explore his portfolio, discuss his projects, skills, artwork, or help you get in touch. What would you like to know?",
      isBot: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      reactions: { likes: 0, dislikes: 0 },
      confidence: 1.0,
    },
    {
      id: 2,
      text: "💡 **Quick suggestions:** Try asking about 'projects', 'skills', 'contact info', or 'artwork'!",
      isBot: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSuggestion: true,
      suggestions: [
        "Tell me about projects",
        "What are Carl's skills?",
        "How to contact?",
        "Show art examples",
      ],
      confidence: 1.0,
    },
  ]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const calculateMessageRelevance = useCallback((
    message: string,
    category: AIResponseCategory
  ): number => {
    const lowerMessage = message.toLowerCase();
    let relevance = 0;

    // Check exact keyword matches first (higher weight)
    for (const keyword of category.keywords) {
      // Check for exact word matches (not just substring)
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      if (regex.test(message)) {
        relevance += 0.5; // Exact match bonus
        break;
      }
    }

    // Check keyword matches (substring)
    const keywordMatches = category.keywords.filter((keyword) => {
      // Check if keyword is in message (substring)
      if (lowerMessage.includes(keyword)) {
        // Check if it's not part of another word
        const regex = new RegExp(`\\b${keyword}[s|ing|ed]*\\b`, "i");
        return regex.test(message);
      }
      return false;
    }).length;

    relevance += (keywordMatches / Math.max(category.keywords.length, 1)) * 0.4;

    // Check context matches (optional)
    if (category.context) {
      const contextMatches = category.context.filter((context) =>
        lowerMessage.includes(context)
      ).length;
      relevance +=
        (contextMatches / Math.max(category.context.length, 1)) * 0.2;
    }

    // Check conversation context (optional)
    const contextMatches = conversationContext.filter((context) =>
      category.keywords.some((keyword) =>
        context.toLowerCase().includes(keyword)
      )
    ).length;
    relevance +=
      (contextMatches / Math.max(conversationContext.length, 1)) * 0.1;

    return Math.min(relevance, 1);
  }, [conversationContext]);

  const getAIResponse = (
    userMessage: string
  ): {
    response: string;
    confidence: number;
    isOutOfScope?: boolean;
    relatedSections?: string[];
  } => {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    // Check cache first for performance
    if (responseCache.current.has(lowerMessage)) {
      return responseCache.current.get(lowerMessage);
    }

    // First, check for simple greetings and common queries
    const simpleQueries: Record<string, string> = {
      hello: "greeting",
      hi: "greeting",
      hey: "greeting",
      projects: "project",
      project: "project",
      skills: "skill",
      skill: "skill",
      art: "art",
      artwork: "art",
      contact: "contact",
      about: "about",
      help: "help",
      "what is this": "this",
      "what is ai": "this",
      "who are you": "this",
      thanks: "thank",
      "thank you": "thank",
      bye: "bye",
      goodbye: "bye",
    };

    // Check for exact simple queries
    if (simpleQueries[lowerMessage]) {
      const category = aiResponseCategories.find((cat) =>
        cat.keywords.includes(simpleQueries[lowerMessage])
      );

      if (category) {
        return {
          response:
            category.responses[
              Math.floor(Math.random() * category.responses.length)
            ],
          confidence: category.confidence,
          relatedSections: category.relatedSections,
        };
      }
    }

    // Check for out-of-scope patterns (more specific)
    const isOutOfScope = outOfScopePatterns.some((pattern) => {
      // Only match if pattern appears as a complete phrase
      const match = pattern.exec(userMessage);
      return match && match[0].length > 5; // Only if match is substantial
    });

    if (isOutOfScope) {
      const result = {
        response:
          "I'm focused on helping you explore Carl's portfolio. I can't provide information about that topic. Would you like to know about Carl's projects, skills, or artwork instead?",
        confidence: 0.1,
        isOutOfScope: true,
      };
      responseCache.current.set(lowerMessage, result);
      return result;
    }

    // Check for low confidence patterns
    const needsClarification = lowConfidencePatterns.some((pattern) =>
      pattern.test(userMessage)
    );

    // Calculate relevance for all categories
    const categoryRelevance = aiResponseCategories
      .map((category) => ({
        category,
        relevance: calculateMessageRelevance(userMessage, category),
      }))
      .sort((a, b) => b.relevance - a.relevance);

    // Get best matching category
    const bestMatch = categoryRelevance[0];

    // Update conversation context
    setConversationContext((prev) => {
      const newContext = [...prev, userMessage].slice(-3); // Keep last 3 messages
      return newContext;
    });

    // Lower threshold for matching
    if (bestMatch.relevance > 0.15) {
      // Lowered from 0.3 to 0.15
      const randomResponse =
        bestMatch.category.responses[
          Math.floor(Math.random() * bestMatch.category.responses.length)
        ];

      const confidence = Math.max(
        bestMatch.category.confidence * bestMatch.relevance,
        0.4
      );

      const result = {
        response: randomResponse,
        confidence: confidence,
        relatedSections: bestMatch.category.relatedSections,
      };
      responseCache.current.set(lowerMessage, result);
      return result;
    } else if (needsClarification) {
      // Needs clarification response
      const clarificationResponses = [
        "I'm here to provide factual information about Carl's portfolio. Could you rephrase your question or ask about something specific from his work?",
        "To help you better, could you ask about Carl's projects, technical skills, artwork, or how to contact him?",
        "I can help with questions about Carl's work. Could you be more specific about what you'd like to know?",
      ];

      const result = {
        response:
          clarificationResponses[
            Math.floor(Math.random() * clarificationResponses.length)
          ],
        confidence: 0.3,
        isOutOfScope: false,
      };
      responseCache.current.set(lowerMessage, result);
      return result;
    } else {
      // No good match found - use fallback
      const fallbackResponses = [
        "I can help you explore Carl's portfolio. Try asking about his projects, skills, artwork, or how to contact him.",
        "I'm here to discuss Carl's work. What would you like to know about his projects, skills, or creative work?",
        "Feel free to ask about Carl's projects, technical skills, digital artwork, or contact information.",
      ];

      const result = {
        response:
          fallbackResponses[
            Math.floor(Math.random() * fallbackResponses.length)
          ],
        confidence: 0.2,
        isOutOfScope: false,
      };
      responseCache.current.set(lowerMessage, result);
      return result;
    }
  };

  // ADDED MISSING FUNCTION
  const navigateToSection = useCallback((section: string) => {
    // Sanitize section name to prevent injection attacks
    const sanitized = sanitizeInput(section);
    const sectionId = sanitized
      .toLowerCase()
      .replace("go to ", "")
      .replace(/ /g, "-")
      .replace(/[^a-z0-9-]/g, ""); // Remove any non-alphanumeric characters except hyphens
    
    // Validate that the section ID is safe (only alphanumeric and hyphens)
    if (!/^[a-z0-9-]+$/.test(sectionId)) {
      console.warn("Blocked unsafe section ID:", sectionId);
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false); // Close chat when navigating
    }
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;

    // Validate and sanitize user input for security
    const validation = validateChatMessage(message);
    if (!validation.isValid) {
      console.warn("Invalid message:", validation.error);
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      text: validation.sanitized, // Use sanitized input
      isBot: false,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      reactions: { likes: 0, dislikes: 0 },
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate AI thinking with variable delay
    const delay = 500 + Math.random() * 500;

    setTimeout(() => {
      const aiResponse = getAIResponse(message);
      const botResponse: ChatMessage = {
        id: chatMessages.length + 2,
        text: aiResponse.response,
        isBot: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        reactions: { likes: 0, dislikes: 0 },
        confidence: aiResponse.confidence,
        isOutOfScope: aiResponse.isOutOfScope,
      };

      // Only add follow-up for truly low confidence or out-of-scope
      if (aiResponse.confidence < 0.3 || aiResponse.isOutOfScope) {
        const followUpMessage: ChatMessage = {
          id: chatMessages.length + 3,
          text: "💡 **Try asking about:**",
          isBot: true,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSuggestion: true,
          suggestions: ["Projects", "Skills", "Artwork", "Contact"],
        };
        setChatMessages((prev) => [...prev, botResponse, followUpMessage]);
      } else if (
        aiResponse.relatedSections &&
        aiResponse.relatedSections.length > 0
      ) {
        // Add suggestion to visit related sections
        const sectionMessage: ChatMessage = {
          id: chatMessages.length + 3,
          text: `📋 **Check out these sections:**`,
          isBot: true,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSuggestion: true,
          suggestions: aiResponse.relatedSections.map(
            (section) => `Go to ${section}`
          ),
        };
        setChatMessages((prev) => [...prev, botResponse, sectionMessage]);
      } else {
        setChatMessages((prev) => [...prev, botResponse]);
      }

      setIsTyping(false);
    }, delay);
  }, [message, chatMessages, getAIResponse]);

  const handleQuickReply = useCallback((text: string) => {
    setMessage(text);
    // Auto-send after a short delay
    setTimeout(() => {
      handleSendMessage();
    }, 300);
  }, [handleSendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleReaction = useCallback((messageId: number, type: "like" | "dislike") => {
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && msg.reactions) {
          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              [type === "like" ? "likes" : "dislikes"]:
                msg.reactions[type === "like" ? "likes" : "dislikes"] + 1,
            },
          };
        }
        return msg;
      })
    );
  }, []);

  const exportChat = useCallback(() => {
    const chatText = chatMessages
      .map((msg) => `${msg.isBot ? "AI" : "You"}: ${msg.text} (${msg.time})`)
      .join("\n\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-with-carl-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [chatMessages]);

  const clearChat = useCallback(() => {
    setChatMessages([
      {
        id: 1,
        text: "👋 Hello! I'm Carl's AI assistant. I can help you explore his portfolio, discuss his projects, skills, artwork, or help you get in touch. What would you like to know?",
        isBot: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        reactions: { likes: 0, dislikes: 0 },
        confidence: 1.0,
      },
      {
        id: 2,
        text: "💡 **Quick suggestions:** Try asking about 'projects', 'skills', 'contact info', or 'artwork'!",
        isBot: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSuggestion: true,
        suggestions: [
          "Tell me about you",
          "What are Carl's projects?",
          "How to contact?",
          "Show art examples",
        ],
        confidence: 1.0,
      },
    ]);
    setConversationContext([]);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        128
      )}px`;
    }
  }, [message]);

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
        aria-label="Open chat assistant"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 ${
            isExpanded ? "inset-4 md:inset-20" : "bottom-24 right-6"
          }`}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-10 duration-300 ${
              isExpanded
                ? "w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]"
                : "w-96 max-w-[calc(100vw-3rem)]"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Smart Assistant
                    </h3>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      AI
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Intelligent • Portfolio focused
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              className={`${
                isExpanded ? "h-[calc(100vh-12rem)]" : "h-96"
              } overflow-y-auto p-4 space-y-6 bg-white`}
            >
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isBot ? "justify-start" : "justify-end"
                  } animate-in fade-in duration-300`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 relative group ${
                      msg.isBot
                        ? msg.isOutOfScope
                          ? "bg-yellow-50 border border-yellow-100 rounded-tl-none"
                          : msg.confidence && msg.confidence < 0.4
                          ? "bg-orange-50 border border-orange-100 rounded-tl-none"
                          : "bg-gray-50 border border-gray-100 rounded-tl-none"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none"
                    }`}
                  >
                    {msg.isBot && msg.isOutOfScope && (
                      <div className="absolute -top-2 -right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Off-topic
                      </div>
                    )}
                    {msg.isBot &&
                      msg.confidence &&
                      msg.confidence < 0.4 &&
                      !msg.isOutOfScope && (
                        <div className="absolute -top-2 -right-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          Unclear
                        </div>
                      )}
                    <div className="flex items-start space-x-3">
                      <div
                        className={`mt-0.5 ${
                          msg.isBot ? "text-blue-500" : "text-white/90"
                        }`}
                      >
                        {msg.isBot ? (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                              msg.isOutOfScope
                                ? "bg-yellow-100 border-yellow-200 text-yellow-600"
                                : msg.confidence && msg.confidence < 0.4
                                ? "bg-orange-100 border-orange-200 text-orange-600"
                                : "bg-gradient-to-r from-blue-100 to-blue-50 border-blue-100 text-blue-600"
                            }`}
                          >
                            {msg.isOutOfScope ? (
                              <AlertCircle className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm whitespace-pre-wrap ${
                            msg.isBot
                              ? msg.isOutOfScope
                                ? "text-yellow-800"
                                : msg.confidence && msg.confidence < 0.4
                                ? "text-orange-800"
                                : "text-gray-800"
                              : "text-white"
                          }`}
                        >
                          {msg.text}
                        </p>
                        {msg.suggestions && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {msg.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  suggestion.startsWith("Go to ")
                                    ? navigateToSection(suggestion) // NOW THIS FUNCTION EXISTS
                                    : handleQuickReply(suggestion)
                                }
                                className={`px-3 py-1.5 text-xs rounded-lg transition-all border flex items-center ${
                                  msg.isOutOfScope
                                    ? "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
                                    : msg.confidence && msg.confidence < 0.4
                                    ? "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200"
                                    : msg.isBot
                                    ? "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                                    : "bg-white/20 text-white border-white/30 hover:bg-white/30"
                                } ${
                                  suggestion.startsWith("Go to ")
                                    ? "font-medium"
                                    : ""
                                }`}
                              >
                                {suggestion}
                                {suggestion.startsWith("Go to ") && (
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span
                            className={`text-xs flex items-center ${
                              msg.isBot
                                ? msg.isOutOfScope
                                  ? "text-yellow-600"
                                  : msg.confidence && msg.confidence < 0.4
                                  ? "text-orange-600"
                                  : "text-gray-500"
                                : "text-white/80"
                            }`}
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            {msg.time}
                          </span>
                          {msg.isBot && msg.reactions && (
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleReaction(msg.id, "like")}
                                className={`p-1.5 rounded-full transition-colors ${
                                  msg.isOutOfScope
                                    ? "hover:bg-yellow-100"
                                    : msg.confidence && msg.confidence < 0.4
                                    ? "hover:bg-orange-100"
                                    : "hover:bg-gray-100"
                                }`}
                                title="Helpful"
                              >
                                <ThumbsUp
                                  className={`w-3.5 h-3.5 ${
                                    msg.isOutOfScope
                                      ? "text-yellow-600"
                                      : msg.confidence && msg.confidence < 0.4
                                      ? "text-orange-600"
                                      : "text-gray-500"
                                  }`}
                                />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="max-w-[85%] rounded-2xl p-4 bg-gray-50 border border-gray-100 rounded-tl-none">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Welcome message */}
              {chatMessages.length <= 2 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full mb-4 border border-blue-100">
                    <Sparkles className="w-7 h-7 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Smart Portfolio Assistant
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 max-w-xs mx-auto">
                    Ask me anything about Carl's work! I understand context and
                    can help you explore his portfolio.
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                    <button
                      onClick={() => handleQuickReply("About")}
                      className="px-4 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-all border border-blue-200 flex items-center justify-center"
                    >
                      <Book className="w-4 h-4 mr-2" />
                      About
                    </button>
                    <button
                      onClick={() => handleQuickReply("Projects")}
                      className="px-4 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-all border border-blue-200 flex items-center justify-center"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Projects
                    </button>
                    <button
                      onClick={() => handleQuickReply("Skills")}
                      className="px-4 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-all border border-blue-200 flex items-center justify-center"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Skills
                    </button>
                    <button
                      onClick={() => handleQuickReply("Contact")}
                      className="px-4 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-all border border-blue-200 flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact
                    </button>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    <p className="flex items-center justify-center">
                      <HelpCircle className="w-3 h-3 mr-1" />
                      Try simple queries like "Projects", "Skills", or "Hello"
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about projects, skills, artwork, or contact..."
                    className="w-full min-h-[44px] max-h-32 px-4 py-3 pr-24 bg-gray-50 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none border border-gray-200"
                    rows={1}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-1.5 rounded ${
                        isRecording
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                      title="Voice input"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 rounded text-gray-500 hover:bg-gray-100"
                      title="Emoji"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[44px] min-h-[44px] shadow-sm"
                  aria-label="Send message"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-500">
                  Smart assistant • Understands context • Portfolio focused
                </p>
                <button
                  onClick={clearChat}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close chat when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ChatBotIcon;
