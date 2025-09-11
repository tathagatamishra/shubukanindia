// app/blogpost/[slug]/page.js
import BlogPost from "@/components/Blog/BlogPost/BlogPost";
import { shubukan_api } from "@/config";
import { redirect } from 'next/navigation';

async function getBlogPost(slug) {
  try {
    const response = await shubukan_api.get(`/blog/${slug}`, {
      cache: "no-store",
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null; // Return null instead of empty array for not found
  }
}

export default async function Page({ params }) {
  const { slug } = params;

  const blogPost = await getBlogPost(slug);

  // Check if blog post exists
  if (!blogPost || (Array.isArray(blogPost) && blogPost.length === 0) || Object.keys(blogPost).length === 0) {
    redirect('/blogpost/blog-not-found');
  }

  return <BlogPost blog={blogPost} />;
}