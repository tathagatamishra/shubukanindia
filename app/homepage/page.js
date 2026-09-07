// app/homepage/page.js
//
// A new, standalone design of the homepage, being tested at /homepage without
// touching the real "/" route. Mobile-first — the design was only made for
// screens under 640px, and is meant to look pixel-for-pixel like the design
// specifically between ~360px and 640px wide.
import HomepageV2 from "@/components/HomepageV2/HomepageV2";
import { shubukan_api } from "@/config";

export const metadata = {
  title: "Homepage Redesign (Preview) | Shubukan India",
  robots: { index: false, follow: false }, // internal design preview, not the real homepage
};

async function getLatestPosts() {
  try {
    const res = await shubukan_api.get("/blogs", { cache: "no-store" });
    return (res.data.blogs || []).slice(0, 2);
  } catch (error) {
    return [];
  }
}

export default async function Page() {
  const posts = await getLatestPosts();
  return <HomepageV2 posts={posts} />;
}
