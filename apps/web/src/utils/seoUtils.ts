/**
 * SEO Utilities
 * Provides helper functions for SEO optimization including structured data, meta tags, and schema markup
 */

/**
 * Generates JSON-LD structured data for a Person (for portfolio)
 * Helps search engines understand profile information
 */
export const generatePersonSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Carls Dale Escalo",
    "url": "https://www.carlsdaleescalo.com",
    "jobTitle": "Full Stack Developer",
    "description": "Full Stack Developer specializing in MERN stack, React, TypeScript, and modern web technologies",
    "image": "https://www.carlsdaleescalo.com/portfolio.png",
    "sameAs": [
      "https://github.com/carlsdale",
      "https://linkedin.com/in/carlsdale",
      "https://twitter.com/carlsdale"
    ],
    "knowsAbout": [
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "MongoDB",
      "Express.js",
      "Web Development",
      "Full Stack Development"
    ],
    "skills": [
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "MongoDB",
      "Express.js",
      "Tailwind CSS",
      "Framer Motion"
    ]
  };
};

/**
 * Generates JSON-LD structured data for Organization
 */
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Carls Dale Escalo",
    "url": "https://www.carlsdaleescalo.com",
    "logo": "https://www.carlsdaleescalo.com/cde.png",
    "description": "Full Stack Developer Portfolio",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Business Inquiry",
      "email": "cralsdale@gmail.com"
    }
  };
};

/**
 * Generates JSON-LD structured data for a WebSite
 * Improves SEO for the entire website
 */
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Carls Dale Escalo",
    "url": "https://www.carlsdaleescalo.com",
    "description": "Full Stack Developer - MERN Stack, React, TypeScript",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.carlsdaleescalo.com/#search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
};

/**
 * Generates JSON-LD structured data for a Project/CreativeWork
 */
export const generateProjectSchema = (project: {
  name: string;
  description: string;
  image?: string;
  url?: string;
  datePublished?: string;
  keywords?: string[];
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.name,
    "description": project.description,
    "image": project.image || "https://www.carlsdaleescalo.com/portfolio.png",
    "url": project.url || "https://www.carlsdaleescalo.com/#projects",
    "datePublished": project.datePublished || new Date().toISOString().split('T')[0],
    "keywords": project.keywords || [],
    "creator": {
      "@type": "Person",
      "name": "Carls Dale Escalo"
    }
  };
};

/**
 * Injects JSON-LD structured data into the document head
 */
export const injectSchemaMarkup = (schema: Record<string, unknown>) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  script.async = true;
  
  // Check if schema with same type already exists
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  const schemaType = (schema as Record<string, unknown>)["@type"];
  
  let exists = false;
  existingScripts.forEach(existingScript => {
    try {
      const existingData = JSON.parse(existingScript.textContent || '{}');
      if (existingData["@type"] === schemaType) {
        existingScript.replaceWith(script);
        exists = true;
      }
    } catch (e) {
      // Ignore parsing errors
    }
  });
  
  if (!exists) {
    document.head.appendChild(script);
  }
};

/**
 * Updates meta tags dynamically
 */
export const updateMetaTags = (tags: Record<string, string>) => {
  Object.entries(tags).forEach(([key, value]) => {
    let metaTag = document.querySelector(`meta[name="${key}"]`) as HTMLMetaElement;
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = key;
      document.head.appendChild(metaTag);
    }
    
    metaTag.content = value;
  });
};

/**
 * Updates OG (Open Graph) tags for better social sharing
 */
export const updateOGTags = (tags: Record<string, string>) => {
  Object.entries(tags).forEach(([key, value]) => {
    let metaTag = document.querySelector(`meta[property="og:${key}"]`) as HTMLMetaElement;
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('property', `og:${key}`);
      document.head.appendChild(metaTag);
    }
    
    metaTag.content = value;
  });
};

/**
 * Updates page title and meta description
 */
export const updatePageSEO = (config: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}) => {
  // Update title
  document.title = config.title;
  
  // Update meta tags
  updateMetaTags({
    description: config.description,
    ...(config.keywords && { keywords: config.keywords })
  });
  
  // Update OG tags
  updateOGTags({
    title: config.title,
    description: config.description,
    ...(config.image && { image: config.image }),
    ...(config.url && { url: config.url })
  });
};

/**
 * Generates a robots meta tag value
 */
export const generateRobotsMeta = (config: {
  index?: boolean;
  follow?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  maxSnippet?: number;
  maxImagePreview?: "none" | "standard" | "large";
} = {}) => {
  const defaults = {
    index: true,
    follow: true,
    nosnippet: false,
    noimageindex: false,
    maxSnippet: -1,
    maxImagePreview: "large" as const
  };
  
  const merged = { ...defaults, ...config };
  
  const parts: string[] = [];
  
  if (merged.index) parts.push("index");
  if (merged.follow) parts.push("follow");
  if (merged.nosnippet) parts.push("nosnippet");
  if (merged.noimageindex) parts.push("noimageindex");
  if (merged.maxSnippet !== -1) parts.push(`max-snippet:${merged.maxSnippet}`);
  parts.push(`max-image-preview:${merged.maxImagePreview}`);
  
  return parts.join(", ");
};
