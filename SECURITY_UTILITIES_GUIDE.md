# Security Utilities Quick Reference Guide

## Overview
Security utilities are located in `src/lib/security.ts` and provide functions to prevent common web vulnerabilities, particularly XSS attacks.

## Quick Start

### 1. Sanitize User Input (Chat Messages)
```typescript
import { validateChatMessage } from '@/lib/security';

const { isValid, sanitized, error } = validateChatMessage(userInput);
if (isValid) {
  // Use sanitized version
  addMessageToChat(sanitized);
} else {
  // Handle validation error
  console.warn(error);
}
```

### 2. Sanitize Any Text Input
```typescript
import { sanitizeInput } from '@/lib/security';

const safe = sanitizeInput(userProvidedText);
// Remove HTML tags and escape entities
// Limit to 10KB, remove event handlers
```

### 3. Escape HTML for Display
```typescript
import { escapeHtml } from '@/lib/security';

const escaped = escapeHtml(userText);
// Converts: <script> → &lt;script&gt;
// Safe for any text rendering
```

### 4. Validate URLs Before Navigation
```typescript
import { isUrlSafe, safeWindowOpen } from '@/lib/security';

// Check if URL is safe
if (isUrlSafe(url)) {
  // Safe to navigate
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Or use the safe helper
safeWindowOpen(url); // Automatically validates and adds security flags
```

### 5. Validate Email Addresses
```typescript
import { isEmailSafe } from '@/lib/security';

if (isEmailSafe(email)) {
  // Email is valid and safe
  sendVerificationEmail(email);
}
```

## Function Reference

### `escapeHtml(text: string | null | undefined): string`
Escapes HTML special characters to prevent injection attacks.

**Example**:
```typescript
escapeHtml('<img src=x onerror="alert(\'XSS\')">');
// Returns: '&lt;img src&#x3D;x onerror&#x3D;&quot;alert(&#39;XSS&#39;)&quot;&gt;'
```

**When to use**:
- Displaying user-provided text
- Form field values
- Any untrusted content

---

### `sanitizeInput(input: string | null | undefined): string`
Removes HTML tags, event handlers, and enforces length limits.

**Example**:
```typescript
sanitizeInput('Hello <script>alert("XSS")</script> World');
// Returns: 'Hello World' (script removed and escaped)
```

**When to use**:
- Cleaning user messages
- Processing form inputs
- Preparing content for storage

---

### `validateChatMessage(message: string): ValidationResult`
Comprehensive validation for chat messages with security and usability checks.

**Returns**:
```typescript
{
  isValid: boolean;      // Message passed all checks
  sanitized: string;     // Safe version of message
  error?: string;        // Error message if invalid
}
```

**Checks**:
- ✅ Not empty
- ✅ Minimum length (1 char)
- ✅ Maximum length (5000 chars)
- ✅ No HTML tags
- ✅ No event handlers
- ✅ No dangerous protocols

**Example**:
```typescript
const result = validateChatMessage(userMessage);
if (result.isValid) {
  setChatMessage(result.sanitized);
} else {
  setError(result.error); // "Message exceeds maximum length..."
}
```

---

### `isUrlSafe(url: string | null | undefined): boolean`
Checks if URL uses safe protocols (prevents javascript: and data: attacks).

**Blocked Protocols**:
- ❌ `javascript:`
- ❌ `data:`
- ❌ `vbscript:`
- ❌ `file:`
- ❌ `about:`

**Allowed Protocols**:
- ✅ `https://`
- ✅ `http://`
- ✅ `mailto:`
- ✅ `tel:`
- ✅ `/relative/paths`

**Example**:
```typescript
isUrlSafe('https://example.com');           // true
isUrlSafe('javascript:alert("XSS")');       // false
isUrlSafe('data:text/html,<script>...');    // false
```

---

### `safeWindowOpen(url: string, target?: string): void`
Safely opens a URL in a new window with security flags.

**Features**:
- ✅ Validates URL before opening
- ✅ Adds `noopener` flag (prevents window.opener access)
- ✅ Adds `noreferrer` flag (hides referrer)
- ⚠️ Warns if URL is unsafe

**Example**:
```typescript
// Safe - validates and opens with security flags
safeWindowOpen('https://example.com/article');

// Dangerous URL - blocked and warned
safeWindowOpen('javascript:alert("XSS")'); // Warning logged
```

---

### `isEmailSafe(email: string | null | undefined): boolean`
Validates email format with security checks.

**Validates**:
- ✅ RFC 5322 simplified format
- ✅ Maximum length (254 chars - RFC 5321)
- ✅ Basic format requirements

**Example**:
```typescript
isEmailSafe('user@example.com');          // true
isEmailSafe('invalid.email');             // false
isEmailSafe('a'.repeat(300) + '@x.com');  // false (too long)
```

---

### `removeScriptTags(html: string | null | undefined): string`
Aggressively removes all executable content from HTML.

**Removes**:
- ❌ `<script>` tags and content
- ❌ `<iframe>` tags
- ❌ `<embed>` tags
- ❌ `<object>` tags

**Example**:
```typescript
removeScriptTags('<div><script>alert("XSS")</script></div>');
// Returns: '<div></div>'
```

**When to use**:
- Stripping HTML entirely before display
- As backup validation layer

---

### `isContentSafe(content: string | null | undefined): boolean`
Quick check if content contains dangerous patterns.

**Detects**:
- ❌ Script tags
- ❌ JavaScript protocols
- ❌ Event handlers
- ❌ Eval/expression functions

**Example**:
```typescript
if (isContentSafe(userContent)) {
  // Safe to render
  setContent(userContent);
}
```

---

### `generateCSPNonce(): string`
Generates a random nonce for inline scripts (not recommended).

**Example**:
```typescript
const nonce = generateCSPNonce();
// Use in: <script nonce={nonce}>...
```

**Note**: Avoid inline scripts. Use external scripts when possible.

---

## Security Headers Configuration

### Content Security Policy
Located in `index.html` and `vite.config.ts`:

```
default-src 'self'                          # Only same-origin by default
script-src 'self' 'wasm-unsafe-eval'        # Scripts from same origin
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com  # Styles + Google Fonts
font-src 'self' https://fonts.gstatic.com   # Fonts
img-src 'self' data: https:                 # Images
connect-src 'self'                          # API calls same-origin only
frame-ancestors 'none'                      # Cannot be framed
base-uri 'self'                             # Prevent base URL hijacking
form-action 'self'                          # Forms submit to same origin
```

### Additional Headers (vite.config.ts)
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-XSS-Protection: 1; mode=block` - Legacy XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Privacy

---

## Common Patterns & Examples

### Pattern 1: Display User-Provided Message
```typescript
// ✅ SECURE
import { validateChatMessage } from '@/lib/security';

const { isValid, sanitized } = validateChatMessage(userMessage);
if (isValid) {
  return <div>{sanitized}</div>;  // React auto-escapes
}

// ❌ INSECURE
return <div>{userMessage}</div>;  // Trusts user input
```

### Pattern 2: Handle External Links
```typescript
// ✅ SECURE
import { safeWindowOpen } from '@/lib/security';

<button onClick={() => safeWindowOpen(userLink)}>
  Open Link
</button>

// ❌ INSECURE
<button onClick={() => window.open(userLink)}>
  Open Link
</button>
```

### Pattern 3: Form Input Validation
```typescript
// ✅ SECURE
import { sanitizeInput, isEmailSafe } from '@/lib/security';

const handleEmailChange = (email: string) => {
  if (isEmailSafe(email)) {
    setEmail(email);
  }
};

// ❌ INSECURE
const handleEmailChange = (email: string) => {
  setEmail(email);  // No validation
};
```

### Pattern 4: Render Dynamic Content
```typescript
// ✅ SECURE - Using sanitized text content
import { sanitizeInput } from '@/lib/security';

const safe = sanitizeInput(dynamicContent);
return (
  <div>
    <h2>{safe}</h2>
    <p>{safe}</p>
  </div>
);

// ❌ INSECURE - Raw HTML
return (
  <div dangerouslySetInnerHTML={{ __html: dynamicContent }} />
);
```

---

## Testing Your Security

### 1. Test Input Sanitization
```typescript
const testCases = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror="alert(\'XSS\')">',
  'javascript:alert("XSS")',
  '"><script>alert("XSS")</script>',
];

testCases.forEach(testCase => {
  const result = sanitizeInput(testCase);
  console.log(`Input: ${testCase}`);
  console.log(`Output: ${result}`);
  console.log('---');
});
```

### 2. Test Message Validation
```typescript
const messageTests = [
  '',                                    // Empty
  'A'.repeat(10001),                    // Too long
  'Hello <script>alert("XSS")</script>', // XSS attempt
  'Normal message',                      // Valid
];

messageTests.forEach(msg => {
  const result = validateChatMessage(msg);
  console.log(`Message: ${msg.substring(0, 50)}...`);
  console.log(`Valid: ${result.isValid}`);
  if (!result.isValid) console.log(`Error: ${result.error}`);
});
```

### 3. Test URL Validation
```typescript
const urlTests = [
  'https://example.com',
  'javascript:alert("XSS")',
  'data:text/html,<script>alert("XSS")</script>',
  '/relative/path',
];

urlTests.forEach(url => {
  console.log(`${url} - ${isUrlSafe(url) ? '✅ Safe' : '❌ Blocked'}`);
});
```

---

## Best Practices

### DO ✅
- Use `sanitizeInput()` for all user input
- Use `validateChatMessage()` for chat/messages
- Use `isUrlSafe()` before navigating
- Trust React's automatic escaping for text content
- Use TypeScript strict mode
- Keep dependencies updated

### DON'T ❌
- Use `dangerouslySetInnerHTML` without DOMPurify
- Trust user input directly
- Use `innerHTML` with user data
- Use `eval()` or `Function()` constructor
- Open user-provided URLs without validation
- Use `setTimeout(userString)` or similar

---

## Implementation Checklist

When adding features that accept user input:

- [ ] Import security utilities
- [ ] Validate input with appropriate function
- [ ] Use sanitized output
- [ ] Test with XSS payloads
- [ ] Check browser console for CSP violations
- [ ] Verify in production build
- [ ] Document security considerations
- [ ] Add to code review checklist

---

## Need Help?

### Questions?
- Check the full audit: `SECURITY_AUDIT_XSS_PREVENTION.md`
- Review security utilities code: `src/lib/security.ts`
- Test in browser console

### Common Issues

**CSP Violations in Console?**
```
Refused to load script from 'https://example.com' because...
```
→ Update CSP in `index.html` if needed

**Input Not Sanitizing?**
```typescript
// Make sure you're using the sanitized output
const { sanitized } = validateChatMessage(input);
setMessage(sanitized); // ✅ Use this
setMessage(input);     // ❌ Not this
```

**URL Not Opening?**
```typescript
// Make sure URL is safe
if (isUrlSafe(url)) {
  safeWindowOpen(url);
}
```

---

**Last Updated**: 2025-12-20  
**Status**: ✅ Ready for production use
