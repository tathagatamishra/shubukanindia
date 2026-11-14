// app/membership/page.js
import IndiaDojo from "@/components/IndiaDojo/IndiaDojo";
import { shubukan_api } from "@/config";

// Re-render this page in the background at most every 5 minutes, so new
// content from the admin panel shows up without a redeploy, while visitors
// still get a cached page instantly. (axios ignores `cache: "no-store"`, so
// before this the page was frozen at build time.)
export const revalidate = 300;

export const metadata = {
  title: "Dojo Listicle | Shubukan India",
  description:
    "Become a member of Shubukan India. Discover our programs, benefits, and how to enroll in traditional karate classes.",
  alternates: {
    canonical: "https://www.shubukanindia.org/membership",
  },
};

async function fetchDojos() {
  try {
    const response = await shubukan_api.get("/dojo", { cache: "no-store" });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching dojos:", error);
    return [];
  }
}

export default async function Page() {
  // await the promise here so you pass a concrete array to the client component
  const dojos = await fetchDojos();

  return <IndiaDojo dojoData={dojos} />;
}
