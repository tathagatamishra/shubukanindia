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

  return <Gallery images={images} />;
}
