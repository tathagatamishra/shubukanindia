import LineageAndDojoKun from "@/components/LineageAndDojoKun/LineageAndDojoKun";
import Script from "next/script";

export const metadata = {
  title: "Lineage & Dojo Kun | Shubukan India",
  description:
    "Understand the lineage of our masters and the guiding principles (Dojo Kun) that define our dojo’s philosophy.",
  keywords: ["karate", "shubukan", "okinawan karate", "martial arts"],
  openGraph: {
    title: "Lineage & Dojo Kun | Shubukan India",
    description:
      "Understand the lineage of our masters and the guiding principles (Dojo Kun) that define our dojo’s philosophy.",
    url: "https://www.shubukanindia.org/lineage-and-dojokun",
    siteName: "Shubukan India",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shubukan India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lineage & Dojo Kun | Shubukan India",
    description:
      "Understand the lineage of our masters and the guiding principles (Dojo Kun) that define our dojo’s philosophy.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.shubukanindia.org/lineage-and-dojokun",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function page() {
  return (
    <>
      <Script
        id="lineage-and-dojokun-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Lineage & Dojo Kun | Shubukan India",
            url: "https://www.shubukanindia.org/lineage-and-dojokun",
            description:
              "Understand the lineage of our masters and the guiding principles (Dojo Kun) that define our dojo’s philosophy.",
            publisher: {
              "@type": "Organization",
              name: "Shubukan India",
              url: "https://www.shubukanindia.org",
              logo: {
                "@type": "ImageObject",
                url: "https://www.shubukanindia.org/favicon.png",
              },
            },
          }),
        }}
      />
      <LineageAndDojoKun />
    </>
  );
}
