import History from "@/components/History/History";
import Script from "next/script";

export const metadata = {
  title: "History | Shubukan India",
  description:
    "Learn about the history of Shubukan India and its roots in Okinawan Karate.",
  keywords: [
    "karate",
    "shubukan",
    "history of karate",
    "birth place of karate",
    "old karate",
    "okinawa",
    "Ryukyu",
    "Shurijo Castle",
    "shuri castle",
    "Shureimon gate",
    "okinawan karate",
    "martial arts",
    "okinawa shubukan",
    "karate day",
    "shubukan50",
    "japan",
    "japan karate",
  ],
  openGraph: {
    title: "History | Shubukan India",
    description:
      "Discover the journey of Shubukan India and Okinawan martial arts.",
    url: "https://www.shubukanindia.org/history",
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
    title: "History | Shubukan India",
    description:
      "Learn about the history of Shubukan India and its Okinawan karate lineage.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.shubukanindia.org/history",
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
        id="history-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "History | Shubukan India",
            url: "https://www.shubukanindia.org/history",
            description:
              "Learn about the history of Shubukan India and its roots in Okinawan Karate.",
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
      <History />
    </>
  );
}
