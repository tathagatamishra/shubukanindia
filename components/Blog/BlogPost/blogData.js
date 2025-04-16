// src/data/blogData.js
export const blogPosts = [
    {
      _id: "60d21b4667d0d8992e610c85",
      title: "The Art of Japanese Swordsmanship: A Historical Perspective",
      subtitle: "Exploring the rich tradition and evolution of Kendo through the ages",
      slug: "art-of-japanese-swordsmanship",
      summary: "This comprehensive article explores the historical development of Japanese swordsmanship from ancient samurai practices to modern Kendo, highlighting key figures and technical innovations along the way.",
      shortNote: "A journey through time exploring Japanese sword techniques",
      coverImage: {
        url: "https://thetruejapan.com/wp-content/uploads/2023/08/Japanese-Culture-and-Blog.jpg",
        caption: "Master swordsman demonstrating traditional kata",
        altText: "Japanese swordsman in traditional attire",
        credit: "Photo by Tanaka Hiroshi"
      },
      thumbnailImage: {
        url: "https://i0.wp.com/kenshi247.net/wp-content/uploads/2016/03/katatehanmenkaeshidou.jpg?ssl=1",
        altText: "Kendo practice session"
      },
      category: {
        primary: "Martial Arts History",
        secondary: ["Japanese Culture", "Kendo"]
      },
      tags: ["Kendo", "Samurai", "Martial Arts", "Japanese History", "Swordsmanship"],
      authors: [
        {
          name: "Dr. Kenji Yamamoto",
          title: "Martial Arts Historian",
          biography: "Dr. Yamamoto is a renowned expert in traditional Japanese martial arts with over 25 years of experience in Kendo practice and research.",
          avatarImage: "https://www.japanpolicyforum.jp/lib/2022/03/Writer_TOISHIBA-Shiho.png",
          socialMedia: {
            twitter: "@drkenji",
            linkedin: "kenjiyamamoto"
          }
        }
      ],
      publishedDate: "2023-12-10T09:30:00Z",
      modifiedDate: "2024-01-15T14:20:00Z",
      status: "published",
      visibility: "public",
      layout: "longform",
      sections: [
        {
          title: "Origins of Japanese Swordsmanship",
          subtitle: "From battlefield necessity to refined art",
          layout: "full-width",
          order: 1,
          contentBlocks: [
            {
              type: "text",
              order: 1,
              text: "The origins of Japanese swordsmanship can be traced back to the Heian period (794-1185), but it was during the tumultuous Sengoku period (1467-1600) that sword techniques were refined into systematic schools of combat. These schools, known as 'ryuha,' developed distinctive styles and approaches to sword fighting that were carefully guarded and passed down through generations."
            },
            {
              type: "image",
              order: 2,
              mediaUrl: "https://www.invaluable.com/blog/wp-content/uploads/sites/77/2024/08/SamuraiArmor-Feat.jpg",
              caption: "Samurai warriors in battle, Edo period illustration",
              altText: "Historical painting of samurai in combat"
            },
            {
              type: "text",
              order: 3,
              text: "The samurai class, as Japan's warrior elite, elevated swordsmanship beyond mere combat technique to a spiritual discipline. The concept of 'bunbu ryodo' (the way of the literary and military arts) emphasized that true mastery required both physical skill and philosophical depth. This holistic approach transformed what began as battlefield necessity into a profound martial art."
            }
          ]
        },
        {
          title: "Evolution Through the Edo Period",
          layout: "two-column",
          order: 2,
          contentBlocks: [
            {
              type: "text",
              order: 1,
              text: "The relatively peaceful Edo period (1603-1868) marked a significant transformation in Japanese swordsmanship. With fewer actual battles to fight, martial schools adapted their training to emphasize personal development alongside combat effectiveness. This period saw the emergence of kata (formal patterns) as a primary training method, allowing techniques to be practiced safely while preserving their martial integrity."
            },
            {
              type: "quote",
              order: 2,
              text: "The sword is the soul of the samurai. Without understanding the moral principles behind its use, one cannot claim to master the way of the sword.",
              caption: "Miyamoto Musashi, The Book of Five Rings"
            },
            {
              type: "text",
              order: 3,
              text: "Influential masters like Miyamoto Musashi developed comprehensive systems that treated swordsmanship as a path to spiritual enlightenment as much as a fighting method. These masters wrote treatises that continue to influence martial artists today, addressing principles that transcend combat applications to offer insights into strategy, psychology, and philosophy."
            },
            {
              type: "image",
              order: 4,
              mediaUrl: "https://www.fly-jpn.com/wp-content/uploads/2023/08/Places-to-Visit-in-Japan-1024x512.jpg",
              caption: "Recreation of an Edo period training hall",
              altText: "Traditional Japanese dojo interior with wooden floor and training weapons"
            }
          ]
        },
        {
          title: "Modern Kendo: The Way of the Sword",
          layout: "full-width",
          order: 3,
          contentBlocks: [
            {
              type: "text",
              order: 1,
              text: "The Meiji Restoration in 1868 brought radical changes to Japanese society, including the dissolution of the samurai class. Swordsmanship might have vanished entirely if not for dedicated practitioners who transformed combat techniques into Kendo ('the way of the sword'), a form of physical, moral, and spiritual development accessible to all citizens."
            },
            {
              type: "image",
              order: 2,
              mediaUrl: "https://blog.janbox.com/wp-content/uploads/2022/08/kendo-equipment.jpg",
              caption: "Contemporary Kendo practice with protective equipment",
              altText: "Two kendoka in full protective gear during a match"
            },
            {
              type: "text",
              order: 3,
              text: "Modern Kendo uses bamboo swords (shinai) and protective armor (bogu) to allow full-contact practice while minimizing injury risk. The All Japan Kendo Federation, established in 1952, standardized rules and techniques, helping Kendo grow into an internationally practiced martial art with practitioners worldwide."
            },
            {
              type: "text",
              order: 4,
              text: "Despite its sporting elements, Kendo retains deep connections to its martial heritage. Training emphasizes proper form, decisive action, and respectful behavior. The concept of 'ki-ken-tai-ichi' (unity of spirit, sword, and body) reflects the holistic philosophy that continues to distinguish Japanese swordsmanship from purely competitive activities."
            },
            {
              type: "callout",
              order: 5,
              text: "Today, over 1.5 million people practice Kendo in Japan alone, with hundreds of thousands more in countries around the world. International championships draw competitors from over 50 nations.",
              calloutStyle: "info"
            }
          ]
        },
        {
          title: "Technical Fundamentals",
          layout: "sidebar-right",
          order: 4,
          contentBlocks: [
            {
              type: "text",
              order: 1,
              text: "Traditional Japanese swordsmanship revolves around several core principles that remain relevant in modern practice:"
            },
            {
              type: "list",
              order: 2,
              listType: "bullet",
              listItems: [
                "Proper posture (shisei) as the foundation of all technique",
                "Distance management (maai) to control the engagement",
                "Timing (hyoshi) to act at the optimal moment",
                "Awareness (zanshin) maintained before, during, and after techniques"
              ]
            },
            {
              type: "text",
              order: 3,
              text: "These elements work together to create effective technique. A practitioner might execute a perfect cut mechanically, but without proper distance, timing, and awareness, it would fail in real application. This integrated approach distinguishes authentic swordsmanship from superficial imitation."
            },
            {
              type: "image",
              order: 4,
              mediaUrl: "https://i0.wp.com/kenshi247.net/wp-content/uploads/2016/03/katatehanmenkaeshidou.jpg?ssl=1",
              caption: "Demonstration of basic striking targets in Kendo",
              altText: "Diagram showing the four primary striking targets: men (head), kote (wrists), do (torso), and tsuki (throat)"
            }
          ]
        }
      ],
      estimatedReadTime: 12,
      viewCount: 3427,
      likeCount: 189,
      isFeatured: true
    },
    {
      _id: "60d21b4667d0d8992e610c86",
      title: "Nutritional Strategies for Martial Artists",
      subtitle: "Optimizing performance through proper diet and hydration",
      slug: "nutrition-strategies-martial-artists",
      summary: "Learn how to fuel your martial arts training with the right nutritional approach, timing your meals and selecting foods that enhance performance and recovery.",
      shortNote: "Dietary guidelines for serious martial arts practitioners",
      coverImage: {
        url: "https://res.cloudinary.com/demo/image/upload/v1625641235/Shubukan/Blog/martial-arts-nutrition.jpg",
        caption: "Balanced meal preparation for athletes",
        altText: "Healthy food arrangement with proteins, vegetables and whole grains"
      },
      category: {
        primary: "Training",
        secondary: ["Health", "Nutrition"]
      },
      tags: ["Nutrition", "Performance", "Recovery", "Health", "Training"],
      authors: [
        {
          name: "Akiko Tanaka",
          title: "Sports Nutritionist",
          biography: "Akiko specializes in nutrition for combat sports athletes and has worked with Olympic-level competitors.",
          avatarImage: "https://www.japanpolicyforum.jp/lib/2022/03/Writer_TOISHIBA-Shiho.png"
        }
      ],
      publishedDate: "2024-02-05T10:15:00Z",
      status: "published",
      visibility: "public",
      layout: "standard",
      sections: [
        {
          title: "Pre-Training Nutrition",
          layout: "full-width",
          order: 1,
          contentBlocks: [
            {
              type: "text",
              order: 1,
              text: "What you eat before training significantly impacts your energy levels, focus, and performance. Ideally, consume a balanced meal 2-3 hours before intense practice, featuring complex carbohydrates, moderate protein, and low fat to minimize digestive discomfort."
            }
          ]
        },
        {
          title: "Post-Training Recovery",
          layout: "full-width",
          order: 2,
          contentBlocks: [
            {
              type: "text",
              order: 1,
              text: "The recovery window (30-60 minutes after training) is crucial for replenishing glycogen stores and initiating muscle repair. A combination of protein and carbohydrates during this period accelerates recovery and prepares your body for the next session."
            }
          ]
        }
      ],
      estimatedReadTime: 8,
      viewCount: 1854,
      likeCount: 124
    },
    {
      _id: "60d21b4667d0d8992e610c87",
      title: "Interview: Master Hirotaka on Traditional Training Methods",
      subtitle: "Insights from a 7th dan Aikido practitioner on preserving authentic techniques",
      slug: "interview-master-hirotaka-traditional-training",
      summary: "In this exclusive interview, Master Hirotaka shares his perspectives on maintaining traditional training methods in the modern dojo environment.",
      coverImage: {
        url: "https://i0.wp.com/kenshi247.net/wp-content/uploads/2016/03/katatehanmenkaeshidou.jpg?ssl=1",
        caption: "Master Hirotaka demonstrating a traditional technique",
        altText: "Elderly Japanese martial arts master in white gi demonstrating a technique on a student"
      },
      category: {
        primary: "Interviews",
        secondary: ["Aikido", "Teaching Methods"]
      },
      tags: ["Aikido", "Traditional Training", "Japanese Martial Arts", "Teaching"],
      publishedDate: "2024-01-18T08:45:00Z",
      status: "published",
      visibility: "public",
      estimatedReadTime: 15,
      viewCount: 2132,
      likeCount: 201,
      isBreakingNews: true
    }
  ];
  
  // Categories for filtering
  export const blogCategories = [
    "Martial Arts History",
    "Training",
    "Interviews",
    "Techniques",
    "Philosophy",
    "Events",
    "Health",
    "Equipment",
    "Japanese Culture"
  ];
  
  // Tags for filtering
  export const blogTags = [
    "Kendo",
    "Aikido",
    "Judo",
    "Karate",
    "Samurai",
    "Training",
    "Techniques",
    "Philosophy",
    "Competition",
    "Health",
    "Nutrition",
    "Equipment",
    "History",
    "Interview",
    "Event"
  ];