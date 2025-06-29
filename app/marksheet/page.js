import Marksheet from "@/components/Marksheet/Marksheet";

export const metadata = {
  title: "Marksheet | Shubukan India",
  description: "View or verify belt examination results and progress records for students of Shubukan India.",
  alternates: {
    canonical: "https://www.shubukanindia.org/marksheet",
  },
};


export default function page() {
  return (
    <Marksheet />
  )
}
