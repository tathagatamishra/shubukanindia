"use client";
import Image from "next/image";
import React from "react";
import "./BlogNotFound.scss";
import { useRouter } from "next/navigation";

export default function BlogNotFound() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  return (
    <div className="BlogPost">
      <div className="BlogPostPage flex flex-col justify-center items-center">
        {/* search bar */}
        {/* <form onSubmit={onSearch} className="w-full flex gap-2 mb-6">
            <button
              className="px-4 py-2 rounded bg-gray-200"
              onClick={() => navigate("/blog")}
            >
              Back to Blog
            </button>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search blog by title or tag..."
              className="flex-1 p-2 border rounded"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Search
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => {
                setQuery("");
                setBlog(blogPosts);
              }}
            >
              Reset
            </button>
          </form> */}

        <h2 className="text-2xl font-bold">Blog not found</h2>
        <p className="mt-4">Try the search or go back to the blog listing.</p>
        <Image
          src="https://res.cloudinary.com/daspiwjet/image/upload/v1757381008/Blog404_xp7liu.png"
          alt="Sad Elephant"
          className="notFound"
          width={300}
          height={300}
        />
        <button
          className="px-4 py-2 rounded bg-gray-200"
          onClick={() => navigate("/journal")}
        >
          Back to Blog
        </button>
      </div>
    </div>
  );
}
