import Gallery from "@/components/Gallery/Gallery";
import { shubukan_api } from "@/config";
import Script from "next/script";

export const metadata = {
  title: "Gallery | Shubukan India",
  description:
    "View photos and videos from training sessions, belt exams, seminars, and events held by Shubukan India.",
  keywords: ["karate", "shubukan", "okinawan karate", "martial arts"],
  openGraph: {
    title: "Gallery | Shubukan India",
    description:
      "View photos and videos from training sessions, belt exams, seminars, and events held by Shubukan India.",
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
    title: "Gallery | Shubukan India",
    description:
      "View photos and videos from training sessions, belt exams, seminars, and events held by Shubukan India.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.shubukanindia.org/gallery",
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function getGalleryImages() {
  try {
    const response = await shubukan_api.get("/gallery", { cache: "no-store" });
    return response.data.images;
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
}

export default async function page() {
  const images = await getGalleryImages();

  return (
    <>
      <Script
        id="gallery-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: "Gallery | Shubukan India",
            url: "https://www.shubukanindia.org/gallery",
            description:
              "View photos and videos from training sessions, belt exams, seminars, and events held by Shubukan India.",
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
      <Gallery images={images} />
    </>
  );
}
