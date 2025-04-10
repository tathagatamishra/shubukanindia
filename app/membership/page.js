import Membership from "@/components/Membership/Membership";

export const metadata = {
  title: "Membership | Shubukan India",
  description: "Become a member of Shubukan India. Discover our programs, benefits, and how to enroll in traditional karate classes.",
  alternates: {
    canonical: "https://www.shubukanindia.org/membership",
  },
};


export default function page() {
  return (
    <Membership />
  )
}
