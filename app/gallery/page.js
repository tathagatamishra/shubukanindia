import Gallery from "@/components/Gallery/Gallery";
import { shubukan_api } from "@/config";
import axios from "axios";

export const metadata = {
  title: "Gallery | Shubukan India",
  description: "View photos and videos from training sessions, belt exams, seminars, and events held by Shubukan India.",
  alternates: {
    canonical: "https://www.shubukanindia.org/gallery",
  },
};


async function getGallery(params) {
  const response = await axios.get("http://localhost:1234/gallery")
  return response.data
}

export default async function page() {
  
  const imageArray = await getGallery()
  console.log(imageArray);
  
  return (
    <Gallery imageArray={imageArray} />
  )
}
