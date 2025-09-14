import KarateAndKobudo from "@/components/KarateAndKobudo/KarateAndKobudo";
import Script from "next/script";

export const metadata = {
  title: "Karate & Kobudo | Shubukan India",
  description:
    "Learn about the fundamentals of Shorin Ryu Karate and Kobudo, and how they are taught at Shubukan India.",
  keywords: [
    "karate",
    "shubukan",
    "kobudo",
    "learn karate",
    "learn kobudo",
    "what is kobudo",
    "weapon training",
    "traditional weapon",
    "japanese weapon",
    "okinawan weapon",
    "nunchak",
    "nunchaku",
    "nanchak",
    "nanchaku",
    "tonfa",
    "kusarigama",
    "sai",
    "okinawan karate",
    "martial arts",
    "okinawa shubukan",
    "karate day",
    "shubukan50",
    "japan",
    "japan karate",
  ],
  openGraph: {
    title: "Karate & Kobudo | Shubukan India",
    description:
      "Learn about the fundamentals of Shorin Ryu Karate and Kobudo, and how they are taught at Shubukan India.",
    url: "https://www.shubukanindia.org/karate-and-kobudo",
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
    title: "Karate & Kobudo | Shubukan India",
    description:
      "Learn about the fundamentals of Shorin Ryu Karate and Kobudo, and how they are taught at Shubukan India.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.shubukanindia.org/karate-and-kobudo",
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
        id="karate-and-kobudo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Karate & Kobudo | Shubukan India",
            url: "https://www.shubukanindia.org/karate-and-kobudo",
            description:
              "Learn about the fundamentals of Shorin Ryu Karate and Kobudo, and how they are taught at Shubukan India.",
            images: ["/twitter-image.jpg"],
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
      <KarateAndKobudo />
    </>
  );
}
