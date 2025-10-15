// app/blog/page.js
import Blog from "@/components/Blog/Blog";
import { shubukan_api } from "@/config";

export const metadata = {
  title: "Blog | Shubukan India",
  description:
    "Explore insights on traditional karate, Kobudo, dojo life, training tips, and global martial arts culture from Shubukan India.",
  alternates: {
    canonical: "https://www.shubukanindia.org/blog",
  },
};

async function getBlogs() {
  try {
    const response = await shubukan_api.get("/blogs", { cache: "no-store" });
    return response.data.blogs || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

// if the array length is less than 5 than repeating same data and make the length of the blogs array upto 5.
/**
 * Ensure the returned array has `targetLen` items.
 * If input length is 0 => returns [] (no data to repeat).
 * If input length < targetLen => repeat items cyclically and
 * give each repeated item a unique _id to avoid React key collisions.
 */
function expandToLength(srcArr = [], targetLen = 5) {
  if (!Array.isArray(srcArr) || srcArr.length === 0) return [];
  if (srcArr.length >= targetLen) return srcArr.slice(0, targetLen);

  const out = [];
  let i = 0;
  while (out.length < targetLen) {
    const source = srcArr[i % srcArr.length];
    // shallow clone and provide a unique _id for each repeated entry
    const clone = { ...source, _id: `${source._id || "blog"}-rep-${i}` };
    out.push(clone);
    i++;
  }
  return out;
}

export default async function page() {
  const fetched = await getBlogs();
  const blogs = expandToLength(fetched, 5);

  return <Blog blogs={blogs} />;
}
