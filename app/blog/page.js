import Blog from "@/components/Blog/Blog";
import { shubukan_api } from "@/config";

export const metadata = {
  title: "Blog | Shubukan India",
  description: "Explore insights on traditional karate, Kobudo, dojo life, training tips, and global martial arts culture from Shubukan India.",
  alternates: {
    canonical: "https://www.shubukanindia.org/blog",
  },
};

async function getBlogs() {
  try {
    const response = await shubukan_api.get("/blogs", { cache: "no-store" });
    return response.data.blogs;
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
}
export default async function page() {
  const blogs = await getBlogs();

  return (
    <Blog blogs={blogs} />
  );
}
