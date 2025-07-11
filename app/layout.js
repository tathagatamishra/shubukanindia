import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/Analytics/GoogleAnalytics";
import { isDesktop } from "react-device-detect";
// import { NavProvider } from "@/components/Context/NavContext";
import MouseTrail from "@/components/UIComponent/MouseTrail";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Banner from "@/components/UIComponent/Banner";
import { displayConsoleLogo } from "@/utils/console-logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://shubukanindia.org"),
  title: {
    default: "Shubukan India",
    template: "%s | Shubukan India",
  },
  description:
    "Shubukanindia is approved dojo from Okinawa Shubukan and only sole dojo of Shubukan Okinawa school in India",
  keywords: [
    "karate",
    "shubukan india",
    "okinawan karate",
    "traditional karate",
    "shorin ryu",
    "full contact karate",
    "shubukan",
  ],
  openGraph: {
    type: "website",
    url: "https://shubukanindia.org",
    siteName: "Shubukan India",
    title: "Shubukan India",
    locale: "en_IN",
    description:
      "Shubukanindia is approved dojo from Okinawa Shubukan and only sole dojo of Shubukan Okinawa school in India",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shubukan India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubukan India",
    description:
      "Shubukanindia is approved dojo from Okinawa Shubukan and only sole dojo of Shubukan Okinawa school in India",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  // Only run in production and client-side
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    displayConsoleLogo();
  }

  const showNav = false;

  return (
    <html lang="en">
      <GoogleAnalytics />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {isDesktop && <MouseTrail />}
        <div className="App" id="App">
          <Navbar />
          <div className="webBody">{children}</div>
          <Footer />
          <Banner />
        </div>
      </body>
    </html>
  );
}
