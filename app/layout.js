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
    <html
      lang="en"
      style={{
        background: "rgb(231, 221, 211)",
        overflowX: "hidden",
        backgroundImage:
          'url("https://res.cloudinary.com/daspiwjet/image/upload/v1742818161/Shubukan/Assets/iksgnmlpeljd7mugtrba.jpg")',
        backgroundSize: "250px 250px",
        maxWidth: "100vw",
        margin: "0px",
        boxSizing: "border-box",
      }}
    >
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2176046634092289"
          crossOrigin="anonymous"
        ></script>

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
            'url("https://res.cloudinary.com/daspiwjet/image/upload/v1742818161/Shubukan/Assets/iksgnmlpeljd7mugtrba.jpg")',
          backgroundSize: "250px 250px",
          maxWidth: "100vw",
          width: "100%",
          margin: "0px",
          boxSizing: "border-box",
        }}
      >
        {/* {isDesktop && <MouseTrail />} */}
        <UIProvider>
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
                zIndex: 2,
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
        </UIProvider>
      </body>
    </html>
  );
}
