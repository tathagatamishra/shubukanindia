import ShubukanOkinawa from "@/components/ShubukanOkinawa/ShubukanOkinawa";
import Script from "next/script";

export const metadata = {
  title: "Shubukan Okinawa | Shubukan India",
  description:
    "Learn about Shubukan Okinawa, our root organization in Japan, and its mission to preserve traditional martial arts.",
  keywords: ["karate", "shubukan", "okinawan karate", "martial arts"],
  openGraph: {
    title: "Shubukan Okinawa | Shubukan India",
    description:
      "Learn about Shubukan Okinawa, our root organization in Japan, and its mission to preserve traditional martial arts.",
    url: "https://www.shubukanindia.org/shubukan-okinawa",
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
    title: "Shubukan Okinawa | Shubukan India",
    description:
      "Learn about Shubukan Okinawa, our root organization in Japan, and its mission to preserve traditional martial arts.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.shubukanindia.org/shubukan-okinawa",
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
        id="shubukan-okinawa-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Shubukan Okinawa | Shubukan India",
            url: "https://www.shubukanindia.org/shubukan-okinawa",
            description:
              "Learn about Shubukan Okinawa, our root organization in Japan, and its mission to preserve traditional martial arts.",
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
      <ShubukanOkinawa />
    </>
  );
}
