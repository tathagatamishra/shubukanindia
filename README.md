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

## Homepage editors

Start the frontend with `npm run dev` and open [Homepage editors](http://localhost:3000/editors). Both editors offer **Desktop** (1440 px), **Tablet** (768 px), and **Mobile** (390 px) previews. On the homepage, mobile applies through 500 px, tablet through 800 px, and desktop above 800 px.

- `public/editors/` contains the hub, editor HTML, and editor-only scripts.
- `public/data/homepage/` contains the JSON layouts used by the homepage and editors.
- `public/homepage/` contains shared cloud layout and device profile logic. `public/dragon/` contains the shared flight logic and dragon model.

Both editors load the current JSON when the file changes. A browser preview saved against the current file reopens automatically. Use **Open JSON layout** to view the file directly or **Open saved layout** to recover an older browser preview. These links open a separate tab so you can keep editing the current layout.

### Dragon path editor

Select a device, drag its anchors and Bézier handles, then scrub or play the flight. **Homepage** shows the dragon in the page. **Full route preview** shows the homepage inside the dashed device frame and keeps the dragon visible as it flies outside it. Scroll in **Homepage** to change the part of the page shown inside the frame. Clear **Show guide** for an unobstructed view of the flight.

Use **Dragon size** to adjust the model’s length and scale for the selected device. The slider ranges from 50% to 200%, and 100% matches the original size. Each device’s value is saved and exported in the `dragonSize` section of the layout JSON.

Under Body twist, choose a segment and scrub the flight or click Pick on route. Changing the angle adds or updates a keyframe. Use Add keyframe to keep the current angle at a position. Opening flight and Full lap have separate keys and share their resting pose.

Under Legs, claws and whiskers, choose a part and adjustment, then set its value at the current flight position. These adjustments are relative to the automatic motion and save with the layout. At the resting pose, use Preview idle to see the grasp and whisker cycles in the editor.

**Save layout** applies all three profiles to the local homepage in your browser. To update the site defaults, use **Copy JSON** or **Download path file** and replace `public/data/homepage/flight-paths.json` with the exported layout.

The site loads `public/dragon/dragon-full.glb`, a skinned export of `DragonStudy/Backup/dragon-full.blend` with reduced geometry and the Blender material colors baked into the mesh. To regenerate the GLB, run the following from the website project with Blender 5.2 available.

~~~powershell
blender -b --factory-startup --python-exit-code 1 --python scripts/export-full-dragon.py -- --source 'C:\Users\johni\Games\DragonAnimation\DragonStudy\Backup\dragon-full.blend' --output 'public/dragon/dragon-full.glb'
~~~

### Cloud layout editor

Select a device and adjust each cloud’s position, size, flips, and opacity. **Save layout** previews all three profiles on the local site in your browser.

To update the site defaults, use **Copy layout** or **Download layout file** and replace `public/data/homepage/cloud-position.json` with the exported layout. You can also edit the file directly. Refresh the local site to see the file changes.
