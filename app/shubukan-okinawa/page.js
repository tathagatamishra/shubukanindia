import ShubukanOkinawa from "@/components/ShubukanOkinawa/ShubukanOkinawa";

export const metadata = {
  title: "Shubukan Okinawa | Shubukan India",
  description: "Learn about Shubukan Okinawa, our root organization in Japan, and its mission to preserve traditional martial arts.",
  alternates: {
    canonical: "https://www.shubukanindia.org/shubukan-okinawa",
  },
};


export default function page() {
  return (
    <ShubukanOkinawa />
  )
}
