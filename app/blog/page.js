import Blog from "@/components/Blog/Blog";

export const metadata = {
  title: "Blog | Shubukan India",
  description: "Explore insights on traditional karate, Kobudo, dojo life, training tips, and global martial arts culture from Shubukan India.",
  alternates: {
    canonical: "https://www.shubukanindia.org/blog",
  },
};

export default function page() {
  return (
    <Blog />
  );
}
