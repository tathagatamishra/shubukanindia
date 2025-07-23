import Gallery from "@/components/Gallery/Gallery";
import { shubukan_api } from "@/config";

export const metadata = {
  title: "Gallery | Shubukan India",
  description:
    "View photos and videos from training sessions, belt exams, seminars, and events held by Shubukan India.",
  alternates: {
    canonical: "https://www.shubukanindia.org/gallery",
  },
};

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function getGalleryImages() {
  try {
    const response = await shubukan_api.get("/gallery", { cache: "no-store" });

    const images = response.data.images;

    return shuffleArray(images);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
}

export default async function page() {
  const randomizedImages = await getGalleryImages();

  return <Gallery images={randomizedImages} />;
}
