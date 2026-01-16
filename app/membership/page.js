import Membership from "@/components/Membership/Membership";
import { shubukan_api } from "@/config";

export const metadata = {
  title: "Membership | Shubukan India",
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

  return (
    <main className="min-h-screen bg-scroll-paper py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif tracking-widest">
            Shubukan Dojos
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-700">
            Traditional dojo listings — scroll to explore
          </p>
        </div>

        <Membership dojos={dojos} />
      </div>
    </main>
  );
}
