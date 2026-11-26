# shubukanindia

---

## Design System

See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for the full visual design system — brand concept, color palettes, typography, components, motion, and guidelines for extending the UI consistently. Companion Figma file: ["Shubukan Design"](https://www.figma.com/design/iqLgm5otKiE5ElphZqQLe8).

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

## Homepage dragon

Start the site with `npm run dev` and open [Dragon Path Editor](http://localhost:3000/dragon-path-editor.html). The editor uses the original `.d-path` as the starting layout for desktop and mobile. Select a profile, drag its anchors and Bézier handles, then scrub the flight to check the route against the homepage. Use Full route to reach points outside the visible homepage.

Under Body twist, choose a segment and scrub the flight or click Pick on route. Changing the angle adds or updates a keyframe. Use Add keyframe to keep the current angle at a position. Opening flight and Full lap have separate keys and share their resting pose.

Save layout applies both profiles to the local homepage in your current browser. To share or deploy the edit, download `flight-paths.json` and replace `public/dragon/flight-paths.json` with it.

The site loads `public/dragon/dragon-full.glb`, a skinned export of `DragonStudy/Backup/dragon-full.blend` with reduced geometry and the Blender material colors baked into the mesh. To regenerate the GLB, run the following from the website project with Blender 5.2 available.

~~~powershell
blender -b --factory-startup --python-exit-code 1 --python scripts/export-full-dragon.py -- --source 'C:\Users\johni\Games\DragonAnimation\DragonStudy\Backup\dragon-full.blend' --output 'public/dragon/dragon-full.glb'
~~~
