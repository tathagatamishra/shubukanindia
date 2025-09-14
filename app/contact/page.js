import Contact from "@/components/Contact/Contact";
import Script from "next/script";

export const metadata = {
  title: "Contact Us | Shubukan India",
  description:
    "Have a question or want to get in touch with Shubukan India? Find contact details and ways to connect with our dojo.",
  keywords: ["karate", "shubukan", "okinawan karate", "martial arts"],
  openGraph: {
    title: "Contact Us | Shubukan India",
    description:
      "Have a question or want to get in touch with Shubukan India? Find contact details and ways to connect with our dojo.",
    url: "https://www.shubukanindia.org/contact",
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
    title: "Contact Us | Shubukan India",
    description:
      "Have a question or want to get in touch with Shubukan India? Find contact details and ways to connect with our dojo.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.shubukanindia.org/contact",
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
            "@type": "ContactPage",
            name: "Contact Us | Shubukan India",
            url: "https://www.shubukanindia.org/contact",
            description:
              "Have a question or want to get in touch with Shubukan India? Find contact details and ways to connect with our dojo.",
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
      <Contact />
    </>
  );
}
