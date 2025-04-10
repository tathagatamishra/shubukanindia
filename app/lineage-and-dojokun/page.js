import LineageAndDojoKun from "@/components/LineageAndDojoKun/LineageAndDojoKun";

export const metadata = {
  title: "Lineage & Dojo Kun | Shubukan India",
  description: "Understand the lineage of our masters and the guiding principles (Dojo Kun) that define our dojo’s philosophy.",
  alternates: {
    canonical: "https://www.shubukanindia.org/lineage-and-dojokun",
  },
};


export default function page() {
  return (
    <LineageAndDojoKun />
  )
}
