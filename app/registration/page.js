import Registration from "@/components/Registration/Registration";

export const metadata = {
  title: "Registration | Shubukan India",
  description: "Register now to join Shubukan India and begin your journey in Okinawan Karate and Kobudo.",
  alternates: {
    canonical: "https://www.shubukanindia.org/registration",
  },
};


export default function page() {
  return (
    <Registration />
  )
}
