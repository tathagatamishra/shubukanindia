// app/blogpost/[slug]/page.js
import BlogPost from "@/components/Blog/BlogPost/BlogPost";
import { shubukan_api } from "@/config";
import { redirect } from "next/navigation";

async function getBlogPost(slug) {
  try {
    const response = await shubukan_api.get(`/blog/${slug}`, {
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

// ✅ Add metadata for SEO + social sharing
export async function generateMetadata({ params }) {
  // Await params before accessing its properties
  const { slug } = await params;
  const blogPost = await getBlogPost(slug);

  if (!blogPost) {
    return {
      title: "Blog Not Found | Shubukan India",
      description: "This blog post could not be found.",
    };
  }

  const url = `https://www.shubukanindia.org/blogpost/${blogPost.slug}`;
  const image = blogPost.thumbnailImage?.url || blogPost.coverImage?.url;

  return {
    title: blogPost.title,
    description: blogPost.summary || blogPost.subtitle,
    openGraph: {
      title: blogPost.title,
      description: blogPost.summary || blogPost.subtitle,
      url,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blogPost.thumbnailImage?.altText || blogPost.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blogPost.title,
      description: blogPost.summary || blogPost.subtitle,
      images: [image],
    },
  };
}

export default async function Page({ params }) {
  // Await params before accessing its properties
  const { slug } = await params;
  const blogPost = await getBlogPost(slug);

  if (!blogPost) {
    redirect("/blogpost/blog-not-found");
  }

  return <BlogPost blog={blogPost} />;
}