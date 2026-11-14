// app/blogpost/[slug]/page.js
import BlogPost from "@/components/Blog/BlogPost/BlogPost";
import { shubukan_api } from "@/config";
import { redirect } from "next/navigation";
import { cache } from "react";

// Re-render this page in the background at most every 5 minutes, so new
// content from the admin panel shows up without a redeploy, while visitors
// still get a cached page instantly. (axios ignores `cache: "no-store"`, so
// before this the page was frozen at build time.)
export const revalidate = 300;

// No posts are pre-built at deploy time; each post is rendered on its first
// visit and then cached (and refreshed every 5 minutes) instead of hitting the
// backend on every single page view.
export async function generateStaticParams() {
  return [];
}

async function getBlogPost(slug) {
  try {
    const response = await shubukan_api.get(`/blog/${slug}`, {
      cache: "no-store",
    });

    if (response.status === 400 || response.data.message === 400) {
      return null;
    }

    return response.data;
  } catch (error) {
    // Handle 404 silently - this is expected for non-existent blogs
    if (error.response?.status === 404) {
      return null;
    }

    // Only log unexpected errors
    console.error("Unexpected error fetching blog:", error);
    return null;
  }
}

// Dedupe the API call between generateMetadata and the page within ONE
// request. (A module-level Map used to cache posts - including "not found" -
// forever per server instance, so edits and newly published posts went stale.)
const getCachedBlogPost = cache(getBlogPost);

// ✅ Add metadata for SEO + social sharing
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blogPost = await getCachedBlogPost(slug);

  if (!blogPost) {
    return {
      title: "Blog Not Found | Shubukan India",
      description: "This blog post could not be found.",
      robots: { index: false, follow: false }, // prevent indexing missing pages
    };
  }

  const url = `https://www.shubukanindia.org/blogpost/${blogPost.slug}`;
  const image = blogPost.thumbnailImage?.url || blogPost.coverImage?.url;

  return {
    title: blogPost.title,
    description: blogPost.summary || blogPost.subtitle,
    keywords: blogPost.tags?.join(", "),
    authors: blogPost.authors?.map((a) => a.name),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: blogPost.title,
      description: blogPost.summary || blogPost.subtitle,
      url,
      type: "article",
      publishedTime: blogPost.publishedDate,
      modifiedTime: blogPost.modifiedDate || blogPost.updatedAt,
      authors: blogPost.authors?.map((a) => a.name),
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
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const blogPost = await getCachedBlogPost(slug);

  if (!blogPost) {
    redirect("/blogpost/blog-not-found");
  }

  await shubukan_api
    .post(`/blog/${slug}/view`)
    .catch((err) => console.error("View track error:", err));

  return <BlogPost blog={blogPost} />;
}
