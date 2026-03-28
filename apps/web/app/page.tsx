import Home from "@/components/home";
import {
  generateOrganizationSchema,
  generatePersonSchema,
  generateWebsiteSchema,
} from "@/utils/seoUtils";

// Keep structured data at the page entry so SEO-critical metadata stays easy
// to find and update as portfolio content evolves.
const structuredData = [
  generatePersonSchema(),
  generateOrganizationSchema(),
  generateWebsiteSchema(),
];

export default function Page() {
  return (
    <>
      {structuredData.map((schema) => (
        <script
          key={String(schema["@type"])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Home />
    </>
  );
}
