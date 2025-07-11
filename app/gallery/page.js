import Gallery from "@/components/Gallery/Gallery";
import { shubukan_api } from "@/config";
import { shuffleArray } from "@/utils/shuffle";

export const metadata = {
  title: "Gallery | Shubukan India",
  description:
    "View photos and videos from training sessions, belt exams, seminars, and events held by Shubukan India.",
  alternates: {
    canonical: "https://www.shubukanindia.org/gallery",
  },
};

async function getGallery(params) {
  const response = await shubukan_api.get("/gallery");
  return response.data;
}

export default async function page() {
  const imageArray = await getGallery();
  shuffleArray(imageArray);

  return <Gallery />;
}
