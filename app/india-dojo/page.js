// app/membership/page.js
import IndiaDojo from "@/components/IndiaDojo/IndiaDojo";
import { shubukan_api } from "@/config";

export const metadata = {
  title: "India Dojo | Shubukan India",
  description:
    "Become a member of Shubukan India. Discover our programs, benefits, and how to enroll in traditional karate classes.",
  alternates: {
    canonical: "https://www.shubukanindia.org/membership",
  },
};

const fetchDojos = async () => {
  try {
    const res = await shubukan_api.get("/dojo");
    // some APIs return { success: true, data: [...] } or plain [...]
    const data = res?.data?.data ?? res?.data ?? [];
    if (!Array.isArray(data)) return [];
    return data;
  } catch (err) {
    console.error("Fetch dojos err:", err);
    return [];
  }
};

export default async function Page() {
  // await the promise here so you pass a concrete array to the client component
  const dojos = await fetchDojos();

  return <IndiaDojo dojoData={dojos} />;
}
