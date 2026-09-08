// app/layout.js
import "./globals.css";
import GoogleAnalytics from "@/components/Analytics/GoogleAnalytics";
import { isDesktop } from "react-device-detect";
import MouseTrail from "@/components/UIComponent/MouseTrail";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Banner from "@/components/UIComponent/Banner";
import { displayConsoleLogo } from "@/utils/console-logo";
import { UIProvider } from "@/components/Context/UIContext";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/UIComponent/Toast/Toast";
import {
  Amarante,
  Bellefair,
  Island_Moments,
  Qwigley,
  Waterfall,
  Qwitcher_Grypen,
  Estonia,
  Babylonica,
} from "next/font/google";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://www.shubukanindia.org"),
  title: {
    default: "Shubukan India",
    template: "%s | Shubukan India",
  },
  description:
    "Shubukanindia is approved dojo from Okinawa Shubukan and only sole dojo of Shubukan Okinawa school in India",
  keywords: [
    "karate",
    "shubukan india",
    "okinawa shubukan",
    "karate day",
    "okinawan karate",
    "traditional karate",
    "shorin ryu",
    "full contact karate",
    "shubukan",
  ],
  openGraph: {
    type: "website",
    url: "https://www.shubukanindia.org",
    siteName: "Shubukan India",
    title: "Shubukan India",
    locale: "en_IN",
    description:
      "Shubukanindia is approved dojo from Okinawa Shubukan and only sole dojo of Shubukan Okinawa school in India",
    images: [
      {
        url: "https://www.shubukanindia.org/og-image.jpg",
        secureUrl: "https://www.shubukanindia.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shubukan India",
        type: "image/jpeg",
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

// Google fonts
const amarante = Amarante({
  variable: "--font-amarante",
  subsets: ["latin"],
  weight: "400", // Amarante only ships weight 400; next/font/google requires it explicit
});
const bellefair = Bellefair({
  variable: "--font-bellefair",
  subsets: ["latin"],
  weight: "400",
});
const island = Island_Moments({
  variable: "--font-island",
  subsets: ["latin"],
  weight: "400",
});
const waterfall = Waterfall({
  variable: "--font-waterfall",
  subsets: ["latin"],
  weight: "400",
});
const qwigley = Qwigley({
  variable: "--font-qwigley",
  subsets: ["latin"],
  weight: "400",
});
const qwitcher = Qwitcher_Grypen({
  variable: "--font-qwitcher",
  subsets: ["latin"],
  weight: "400",
});
const estonia = Estonia({
  variable: "--font-estonia",
  subsets: ["latin"],
  weight: "400",
});
const babylonica = Babylonica({
  variable: "--font-babylonica",
  subsets: ["latin"],
  weight: "400",
});

// Custom fonts
const kouzan = localFont({
  src: "./fonts/KouzanBrushFontGyousyo.woff2",
  variable: "--font-kouzan",
  display: "swap",
});
const mufan = localFont({
  src: "./fonts/MufanPFS.woff2",
  variable: "--font-mufan",
  display: "swap",
});
const amanojaku = localFont({
  src: "./fonts/Amanojaku.woff2",
  variable: "--font-amanojaku",
  display: "swap",
});

export default function RootLayout({ children }) {
  // Only run in production and client-side
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    displayConsoleLogo();
  }

  const showNav = false;

  return (
    <html
      lang="en"
      className={`
        ${mufan.variable} 
        ${amanojaku.variable} 
        ${amarante.variable} 
        ${bellefair.variable} 
        ${island.variable} 
        ${qwitcher.variable} 
        ${estonia.variable} 
        ${qwigley.variable} 
        ${waterfall.variable} 
        ${babylonica.variable} 
        ${kouzan.variable}`}
      style={{
        background: "rgb(231, 221, 211)",
        backgroundImage:
          'linear-gradient(#fbf5ea58), url("https://res.cloudinary.com/daspiwjet/image/upload/v1742818161/Shubukan/Assets/iksgnmlpeljd7mugtrba.jpg")',
        backgroundSize: "250px 250px",
        maxWidth: "100vw",
        boxSizing: "border-box",
        margin: "0px",
        overflowX: "hidden",
      }}
    >
      <head>
        {/* Google AdSense */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2176046634092289"
          crossOrigin="anonymous"
        />

        <GoogleAnalytics />
        {/* SEO Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Shubukan India",
              url: "https://www.shubukanindia.org",
              logo: "https://www.shubukanindia.org/favicon.png",
              sameAs: [
                "https://www.facebook.com/indiashubukan",
                "https://www.instagram.com/shubukanindia",
              ],
            }),
          }}
        />
      </head>

      <body
        className={`antialiased`}
        style={{
          background: "rgb(231, 221, 211)",
          backgroundImage:
            'linear-gradient(#fbf5ea58), url("https://res.cloudinary.com/daspiwjet/image/upload/v1742818161/Shubukan/Assets/iksgnmlpeljd7mugtrba.jpg")',
          backgroundSize: "250px 250px",
          maxWidth: "100vw",
          width: "100%",
          margin: "0px",
          boxSizing: "border-box",
        }}
      >
        {/* {isDesktop && <MouseTrail />} */}
        <UIProvider>
          <ToastProvider>
            <div
              className="App"
              id="App"
              style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflowX: "hidden",
              }}
            >
              <Navbar />
              <div
                className="webBody"
                style={{
                  position: "relative",
                  // zIndex: 2,
                  height: "fit-content",
                  minHeight: "calc(100vh - 610px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                {children}
              </div>
              <Footer />
              <Banner />
            </div>
          </ToastProvider>
        </UIProvider>
      </body>
    </html>
  );
}
