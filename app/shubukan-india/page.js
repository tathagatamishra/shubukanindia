import ShubukanIndia from "@/components/ShubukanIndia/ShubukanIndia";
import Script from "next/script";

export const metadata = {
  title: "Shubukan India Dojo",
  description:
    "Learn about our dojo setup, our instructors, training environment, and the values we uphold at Shubukan India.",
  keywords: [
    "karate",
    "shubukan",
    "shubukan india",
    "karate india",
    "shubukan dojo",
    "okinawan karate",
    "martial arts",
    "okinawa shubukan",
    "karate day",
    "shubukan50",
    "japan",
    "japan karate",
  ],
  openGraph: {
    title: "Shubukan India Dojo",
    description:
      "Learn about our dojo setup, our instructors, training environment, and the values we uphold at Shubukan India.",
    url: "https://www.shubukanindia.org/shubukan-india",
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
    title: "Shubukan India Dojo",
    description:
      "Learn about our dojo setup, our instructors, training environment, and the values we uphold at Shubukan India.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.shubukanindia.org/shubukan-india",
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
        id="shubukan-india-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Shubukan India Dojo",
            url: "https://www.shubukanindia.org/shubukan-india",
            description:
              "Learn about our dojo setup, our instructors, training environment, and the values we uphold at Shubukan India.",
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
      <ShubukanIndia />
    </>
  );
}
