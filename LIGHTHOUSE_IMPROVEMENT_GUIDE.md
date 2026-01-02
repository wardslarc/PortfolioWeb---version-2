# Lighthouse Performance Improvement Guide

## Current Results (Jan 3, 2026)
- **Performance: 59** ⚠️ (Target: 90+)
- **Accessibility: 90** ✓
- **Best Practices: 92** ✓
- **SEO: 85** ⚠️ (Target: 90+)

---

## Critical Issues to Fix (High Impact)

### 1. **LCP: 13.7s → Target: <2.5s** 🔴
**Problem:** Largest Contentful Paint is extremely slow

**Causes:**
- Render-blocking resources (Est. 1,410ms savings)
- Heavy image payloads (Est. 1,836 KiB savings)
- Loading screen animations blocking main content

**Solutions:**

**A. Defer Font Loading**
```html
<!-- In index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap" rel="stylesheet">

<!-- Change to async loading to prevent render blocking -->
```

**B. Lazy Load Heavy Components**
```tsx
import { lazy, Suspense } from 'react';

// In App.tsx or home.tsx
const ArtSection = lazy(() => import('./components/ArtSection'));
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const ChatBot = lazy(() => import('./components/ChatBot'));

// Wrap with Suspense
<Suspense fallback={<div className="h-screen" />}>
  <ArtSection />
</Suspense>
```

**C. Optimize Images Aggressively**
```bash
# 1. Compress background images
npx imagemin public/*.png --out-dir=public/optimized

# 2. Convert PNG to WebP for better compression
npx imagemin public/*.png --type=image/webp --out-dir=public

# 3. Create responsive image variants
# morning-small.png (600px), morning-medium.png (1200px), morning-large.png (1920px)
```

**D. Use WebP Images with Fallbacks**
```tsx
<picture>
  <source srcSet="/images/morning.webp" type="image/webp" />
  <source srcSet="/images/morning.png" type="image/png" />
  <img src="/images/morning.png" alt="Morning background" />
</picture>
```

---

### 2. **FCP: 4.7s → Target: <1.8s** 🔴
**Problem:** First Contentful Paint is slow

**Causes:**
- Large JavaScript bundles (3,005 KiB total)
- 174 KiB of unused JavaScript
- Loading screen delay
- Render-blocking CSS/JS

**Solutions:**

**A. Reduce Unused JavaScript**
```bash
# Analyze bundle
npm run build -- --analyze

# Expected findings:
# - Remove unused @radix-ui components
# - Tree-shake unused framer-motion features
# - Remove unused Firebase features if only using for ChatBot
```

**B. Defer Non-Critical JavaScript**
```html
<!-- In index.html -->
<!-- Critical (needed for immediate render) -->
<script src="critical.js"></script>

<!-- Non-critical (can load after interactive) -->
<script defer src="analytics.js"></script>
<script defer src="chatbot.js"></script>
```

**C. Minify Loading Screen**
```tsx
// Current: 3 animated blobs + progress bar
// Already optimized in recent update

// Consider: Show static skeleton instead of full loading screen
// This gets content visible 1-2s faster
```

**D. Implement Dynamic Imports**
```tsx
// Only load ChatBot when user scrolls to contact section
const ChatBot = lazy(() => import('./ChatBot'));

// Only load ArtSection images when section becomes visible
<picture>
  <img src="/placeholder.jpg" loading="lazy" />
</picture>
```

---

### 3. **TBT: 210ms → Target: <50ms** 🟡
**Problem:** Total Blocking Time too high (4 long tasks)

**Solutions:**

**A. Break Up Long Tasks**
```tsx
// Use requestIdleCallback for non-critical work
import { useEffect } from 'react';

useEffect(() => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Heavy computation here
    });
  }
}, []);
```

**B. Optimize Animations**
- Already optimized in recent update
- Consider disabling animations on Slow 4G networks

```tsx
const isSlowNetwork = navigator.connection?.effectiveType === '4g' 
  && navigator.connection?.saveData;

const duration = isSlowNetwork ? 0 : 0.3;
```

**C. Defer Heavy Imports**
```tsx
// Bad: Imports everything on page load
import * as Utils from './heavy-utils';

// Good: Import only what's needed
import { specificFunction } from './heavy-utils';
```

---

### 4. **SEO: 85 → Target: 90+** 🟡
**Issues Found:**
- ❌ robots.txt invalid directive (FIXED)
- ❌ Links not crawlable

**Solutions:**

**A. Make Links Crawlable**
```tsx
// Good: Standard anchor tags
<a href="/projects/1">View Project</a>

// Bad: Non-crawlable buttons
<button onClick={() => navigate('/projects/1')}>View Project</button>

// Solution: Use Link with href or ensure buttons have proper attributes
<Link to="/projects/1">View Project</Link>
```

**B. Audit All Links**
```bash
# Check for proper link structure
grep -r "onClick={() => navigate" src/

# These should be <a> or <Link> with href attributes
```

**C. Verify Sitemap**
```xml
<!-- public/sitemap.xml should include all routes -->
<url>
  <loc>https://carlsdaleescalo.com/</loc>
  <lastmod>2026-01-03</lastmod>
  <priority>1.0</priority>
</url>
```

---

## Accessibility Issues (90 Score)

### Fix Button/Link Accessibility

**Problem:** Buttons don't have accessible names

**Solution:**
```tsx
// Bad
<button onClick={toggleMenu}>☰</button>

// Good
<button onClick={toggleMenu} aria-label="Toggle navigation menu">
  ☰
</button>

// Bad
<button onClick={() => openModal(project)}>
  <img src={project.image} />
</button>

// Good
<button onClick={() => openModal(project)} aria-label={`View details for ${project.title}`}>
  <img src={project.image} alt={project.title} />
</button>
```

**Audit for Missing Labels:**
```bash
# Check all buttons for aria-label or text content
grep -r "<button" src/components/ | grep -v "aria-label"
```

---

## Implementation Priority

### Priority 1 (Est. 40-50% improvement in Performance score):
1. ✅ Fix robots.txt (DONE)
2. Optimize and compress background images
3. Implement lazy loading for ProjectsSection and ArtSection
4. Add WebP image format with fallbacks

### Priority 2 (Est. 20-30% improvement):
1. Analyze and reduce unused JavaScript (174 KiB)
2. Defer non-critical fonts
3. Break up long main-thread tasks
4. Fix accessibility labels on buttons/links

### Priority 3 (Est. 10-20% improvement):
1. Implement dynamic imports for heavy components
2. Optimize loading screen to show content faster
3. Add prefers-reduced-motion support
4. Implement network-aware animation throttling

---

## Testing After Changes

```bash
# 1. Build locally and test
npm run build

# 2. Run Lighthouse locally
npm install -g lighthouse
lighthouse https://localhost:5173 --view

# 3. Test on Vercel with throttling
# Settings: Slow 4G, Moto G Power

# 4. Monitor Core Web Vitals
# Use web-vitals library for continuous monitoring
```

---

## Quick Wins (Can implement immediately)

1. ✅ Fix robots.txt - Done
2. Compress background images with:
   ```bash
   npx imagemin public/morning.png public/afternoon.png public/night.png --out-dir=public/optimized
   ```

3. Add defer attribute to non-critical scripts in index.html

4. Add aria-label to all buttons without visible text

5. Update sitemap.xml with current date

---

## Performance Targets After Fixes

| Metric | Current | Target | Est. Improvement |
|--------|---------|--------|------------------|
| FCP | 4.7s | 1.8s | -62% |
| LCP | 13.7s | 2.5s | -82% |
| TBT | 210ms | 50ms | -76% |
| Performance Score | 59 | 85+ | +44% |

---

## Monitoring & Maintenance

1. **Set up Lighthouse CI**
   ```bash
   npm install -D @lhci/cli@latest lighthouserc
   ```

2. **Enable Web Vitals Monitoring**
   ```tsx
   import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';
   
   onCLS(console.log);
   onFID(console.log);
   onFCP(console.log);
   onLCP(console.log);
   onTTFB(console.log);
   ```

3. **Regular Audits**
   - Run Lighthouse weekly
   - Monitor bundle size
   - Check for new unused code
