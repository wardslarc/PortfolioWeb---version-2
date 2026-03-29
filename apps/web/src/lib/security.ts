/**
 * Security Utilities for XSS Prevention and Input Sanitization
 * 
 * This module provides essential security functions to prevent common web vulnerabilities,
 * particularly Cross-Site Scripting (XSS) attacks.
 */

/**
 * HTML Entity Map for escaping dangerous characters
 * Prevents XSS by converting special characters to their HTML entity equivalents
 */
const htmlEntityMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

/**
 * Escapes HTML special characters to prevent XSS attacks
 * 
 * @param text - The user input text to escape
 * @returns Safe HTML string with escaped entities
 * 
 * @example
 * escapeHtml('<script>alert("XSS")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;'
 */
export const escapeHtml = (text: string | null | undefined): string => {
  if (!text) return "";
  
  return String(text).replace(/[&<>"'`=/]/g, (char) => htmlEntityMap[char] || char);
};

/**
 * Sanitizes user input by removing potentially dangerous content
 * Safe for use in:
 * - Chat messages
 * - User-provided text
 * - Form inputs
 * - Comments and feedback
 * 
 * @param input - Raw user input
 * @returns Sanitized string safe for display
 */
export const sanitizeInput = (input: string | null | undefined): string => {
  if (!input) return "";

  // Trim whitespace
  let sanitized = String(input).trim();

  // Remove any HTML-like tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  // Remove any potential event handlers (even in plain text)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, "");

  // Escape HTML entities
  sanitized = escapeHtml(sanitized);

  // Limit length to prevent DoS attacks
  const MAX_INPUT_LENGTH = 10000; // 10KB limit
  if (sanitized.length > MAX_INPUT_LENGTH) {
    sanitized = sanitized.substring(0, MAX_INPUT_LENGTH) + "...";
  }

  return sanitized;
};

/**
 * Validates if a URL is safe to navigate to
 * Prevents javascript: and data: URLs that could execute code
 * 
 * @param url - URL to validate
 * @returns true if URL is safe, false otherwise
 * 
 * @example
 * isUrlSafe('https://example.com') // true
 * isUrlSafe('javascript:alert("XSS")') // false
 */
export const isUrlSafe = (url: string | null | undefined): boolean => {
  if (!url) return false;

  const urlString = String(url).trim();
  if (!urlString) return false;

  // Reject whitespace/control-character obfuscation before protocol parsing.
  if (/[\u0000-\u001F\u007F\s]/.test(urlString)) {
    return false;
  }

  // Dangerous protocols that could execute code
  const dangerousProtocols = [
    "javascript:",
    "data:",
    "vbscript:",
    "file:",
    "about:",
  ];

  // Check if URL starts with any dangerous protocol
  const normalized = urlString.toLowerCase();
  if (dangerousProtocols.some((protocol) => normalized.startsWith(protocol))) {
    return false;
  }

  try {
    // Resolve local and absolute URLs through the same trusted parser.
    const parsed = new URL(urlString, "https://www.carlsdaleescalo.com");
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol);
  } catch {
    return urlString.startsWith("/") || urlString.startsWith("#");
  }
};

/**
 * Safely opens a URL in a new window/tab
 * Validates URL before opening to prevent javascript: attacks
 * Sets rel="noopener noreferrer" for security
 * 
 * @param url - URL to open
 * @param target - Window target (default: "_blank")
 */
export const safeWindowOpen = (url: string, target: string = "_blank"): void => {
  if (!isUrlSafe(url)) {
    console.warn(`Blocked unsafe URL: ${url}`);
    return;
  }

  // Prevent the opened page from getting access to `window.opener`.
  window.open(url, target, "noopener,noreferrer");
};

/**
 * Removes all script tags and content from a string
 * More aggressive than escapeHtml - completely removes scripts
 * 
 * @param html - HTML string to clean
 * @returns String with all script tags removed
 */
export const removeScriptTags = (html: string | null | undefined): string => {
  if (!html) return "";

  return String(html)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<embed[^>]*>/gi, "")
    .replace(/<object[^>]*>/gi, "");
};

/**
 * Validates email addresses with basic security checks
 * Prevents excessively long or malformed emails
 * 
 * @param email - Email to validate
 * @returns true if email appears safe and valid
 */
export const isEmailSafe = (email: string | null | undefined): boolean => {
  if (!email) return false;

  const emailString = String(email).trim().toLowerCase();

  // Basic email validation regex (RFC 5322 simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check length to prevent DoS
  const MAX_EMAIL_LENGTH = 254; // RFC 5321
  if (emailString.length > MAX_EMAIL_LENGTH) return false;

  return emailRegex.test(emailString);
};

/**
 * Validates user input for chat messages
 * Combines multiple security checks
 * 
 * @param message - Chat message to validate
 * @returns Object with sanitized message and validation status
 */
export const validateChatMessage = (
  message: string | null | undefined
): { isValid: boolean; sanitized: string; error?: string } => {
  if (!message) {
    return { isValid: false, sanitized: "", error: "Message is empty" };
  }

  const trimmed = String(message).trim();

  // Check minimum length
  if (trimmed.length < 1) {
    return { isValid: false, sanitized: "", error: "Message is too short" };
  }

  // Check maximum length
  const MAX_MESSAGE_LENGTH = 5000;
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      sanitized: "",
      error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
    };
  }

  // Sanitize the message
  const sanitized = sanitizeInput(trimmed);

  // Check if message became empty after sanitization (all HTML tags)
  if (sanitized.length === 0) {
    return {
      isValid: false,
      sanitized: "",
      error: "Message contains no valid content",
    };
  }

  return { isValid: true, sanitized };
};

/**
 * React component safety check - prevents rendering of potentially unsafe content
 * Use this when deciding whether to render user-supplied content
 * 
 * @param content - Content to check
 * @returns true if content is safe to render
 */
export const isContentSafe = (content: string | null | undefined): boolean => {
  if (!content) return true; // Empty content is safe

  const contentString = String(content);

  // Check for dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(contentString));
};
