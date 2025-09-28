import Admin from "@/components/x/Admin";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return <Admin />;
}
