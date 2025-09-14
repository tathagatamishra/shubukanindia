import Hozonkai from "@/components/Hozonkai/Hozonkai";
import Script from "next/script";

export const metadata = {
  title: "Shuri Karate Kobudo Hozonkai | Shubukan India",
  description:
    "Understand the significance of Shuri Karate Kobudo Hozonkai, a preservation society for traditional martial arts from Okinawa.",
  keywords: [
    "karate",
    "shubukan",
    "Shuri Karate Kobudo Hozonkai",
    "okinawan karate",
    "martial arts",
    "okinawa shubukan",
    "karate day",
    "shubukan50",
    "japan",
    "japan karate",
  ],
  openGraph: {
    title: "Shuri Karate Kobudo Hozonkai | Shubukan India",
    description:
      "Understand the significance of Shuri Karate Kobudo Hozonkai, a preservation society for traditional martial arts from Okinawa.",
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
    title: "Shuri Karate Kobudo Hozonkai | Shubukan India",
    description:
      "Understand the significance of Shuri Karate Kobudo Hozonkai, a preservation society for traditional martial arts from Okinawa.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.shubukanindia.org/shuri-karate-kobudo-hozonkai",
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
        id="shuri-karate-kobudo-hozonkai-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Shuri Karate Kobudo Hozonkai | Shubukan India",
            url: "https://www.shubukanindia.org/shuri-karate-kobudo-hozonkai",
            description:
              "Understand the significance of Shuri Karate Kobudo Hozonkai, a preservation society for traditional martial arts from Okinawa.",
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
      <Hozonkai />
    </>
  );
}
