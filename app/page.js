// app/page.js
import Home from "@/components/Home/Home";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://www.shubukanindia.org"),
  title: "Shubukan India | Traditional Okinawan Karate Dojo",
  description:
    "Shubukan India is an official dojo of Okinawa Shubukan, offering traditional Shorin Ryu Karate in India with a focus on discipline, strength, and heritage.",
  keywords: [
    "karate",
    "shubukan india",
    "okinawan karate",
    "okinawa shubukan",
    "karate day",
    "shubukan50",
    "japan",
    "japan karate",
    "traditional karate",
    "shorin ryu",
    "full contact karate",
    "shubukan",
  ],
  openGraph: {
    type: "website",
    url: "https://www.shubukanindia.org",
    siteName: "Shubukan India",
    title: "Shubukan India",
    locale: "en_IN",
    description:
      "Shubukan India is an official dojo of Okinawa Shubukan, offering traditional Shorin Ryu Karate in India with a focus on discipline, strength, and heritage.",
    images: [
      {
        url: "https://www.shubukanindia.org/og-image.jpg",
        secureUrl: "https://www.shubukanindia.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shubukan India",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubukan India",
    description:
      "Shubukan India is an official dojo of Okinawa Shubukan, offering traditional Shorin Ryu Karate in India with a focus on discipline, strength, and heritage.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://www.shubukanindia.org/",
  },
};

export default function page() {
  return (
    <>
      <Script
        id="shubukan-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Shubukan India | Traditional Okinawan Karate Dojo",
            url: "https://www.shubukanindia.org/",
            description:
              "Shubukan India is an official dojo of Okinawa Shubukan, offering traditional Shorin Ryu Karate in India with a focus on discipline, strength, and heritage.",
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
      <Home />
    </>
  );
}
