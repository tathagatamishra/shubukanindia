# shubukanindia

---

## SEO

### 🔹 1. Metadata Template (Next.js App Router)

### ➡️ Just change:

- title
- description
- url
- keywords

```
// Example: app/history/page.js

export const metadata = {
  title: "History | Shubukan India",
  description:
    "Learn about the history of Shubukan India and its roots in Okinawan Karate.",
  keywords: ["karate", "shubukan", "okinawan karate", "martial arts"],
  openGraph: {
    title: "History | Shubukan India",
    description:
      "Discover the journey of Shubukan India and Okinawan martial arts.",
    url: "https://www.shubukanindia.org/history",
    siteName: "Shubukan India",
    type: "website",
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
    title: "History | Shubukan India",
    description:
      "Learn about the history of Shubukan India and its Okinawan karate lineage.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.shubukanindia.org/history",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

---

### 🔹 2. Schema Template (JSON-LD)

### ➡️ Again, only update:

- "@type" (use WebPage, FAQPage, ContactPage, Blog, Article, etc.)
- name
- url
- description

```
import Script from "next/script";

export default function HistoryPage() {
  return (
    <>
      <Script
        id="history-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "History | Shubukan India",
            url: "https://www.shubukanindia.org/history",
            description:
              "Learn about the history of Shubukan India and its roots in Okinawan Karate.",
            publisher: {
              "@type": "Organization",
              name: "Shubukan India",
              url: "https://www.shubukanindia.org",
              logo: {
                "@type": "ImageObject",
                url: "https://www.shubukanindia.org/favicon.png",
              },
            },
          }),
        }}
      />
      <main>
        {/* Your page content */}
      </main>
    </>
  );
}
```

---

### 🔹 3. Schema Types

| Page                                      | Schema Type                          |
| ----------------------------------------- | ------------------------------------ |
| `/` (homepage)                            | `WebSite` + `Organization`           |
| `/blog`                                   | `Blog`                               |
| `/blogpost/[slug]`                        | `Article` (or `NewsArticle`)         |
| `/contact`                                | `ContactPage` (+ `ContactPoint`)     |
| `/help-and-faqs`                          | `FAQPage`                            |
| `/gallery`                                | `ImageGallery`                       |
| `/history`                                | `WebPage`                            |
| `/karate-and-kobudo`                      | `Course` or `SportsActivityLocation` |
| `/lineage-and-dojokun`                    | `WebPage`                            |
| `/registration` / `/membership`           | `WebPage`                            |
| `/services`                               | `Service`                            |
| `/contributors`                           | `WebPage`                            |
| `/shubukan-india` / `/okinawa` / `/world` | `Organization` / `WebPage`           |
| `/shuri-karate-kobudo-hozonkai`           | `WebPage`                            |
| `/term-and-condition`                     | `WebPage` (`CreativeWork`)           |
| `/marksheet`                              | `EducationalOccupationalCredential`  |

---

## 🔹 Android App Tech Stack


### Android (Client)

* Kotlin + Jetpack Compose
* CameraX
* TensorFlow Lite MoveNet (pose detection)

### Backend

* Node.js + Express
* MongoDB (Atlas free tier)
* JWT (auth tokens for API security)
* Nodemailer (email notifications)

### Auth & Notifications

* Firebase Auth (user login/roles)
* Firebase Cloud Messaging (push notifications)

### Storage & Media

* Cloudinary (event photos, blogs, gallery)

### Payments

* Google Play Billing Library

### DevOps

* GitHub (repo + CI/CD)

---
