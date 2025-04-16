import React from "react";
import { blogPosts, blogCategories, blogTags } from "./blogData";
import "./BlogPost.scss";

export default function BlogPost() {
  const currentPost = blogPosts[0];
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case "text":
        return (
          <div key={index} className="my-4">
            <p className="text-gray-800">{block.text}</p>
          </div>
        );
      case "image":
        return (
          <div key={index} className="my-6">
            <img
              src={block.mediaUrl}
              alt={block.altText || "Blog image"}
              className="w-full rounded-lg shadow-md"
            />
            {block.caption && (
              <p className="text-sm text-gray-600 italic mt-2">
                {block.caption}
              </p>
            )}
          </div>
        );
      case "quote":
        return (
          <div
            key={index}
            className="my-6 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded"
          >
            <blockquote className="text-lg italic text-gray-700">
              {block.text}
            </blockquote>
            {block.caption && (
              <p className="text-sm text-gray-600 mt-2">— {block.caption}</p>
            )}
          </div>
        );
      case "callout":
        return (
          <div
            key={index}
            className={`my-6 p-4 rounded-lg ${
              block.calloutStyle === "info"
                ? "bg-blue-50 border border-blue-200"
                : block.calloutStyle === "warning"
                ? "bg-yellow-50 border border-yellow-200"
                : block.calloutStyle === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <p className="text-gray-800">{block.text}</p>
          </div>
        );
      case "list":
        return (
          <div key={index} className="my-4">
            {block.listType === "bullet" ? (
              <ul className="list-disc pl-5">
                {block.listItems.map((item, i) => (
                  <li key={i} className="mb-2 text-gray-800">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <ol className="list-decimal pl-5">
                {block.listItems.map((item, i) => (
                  <li key={i} className="mb-2 text-gray-800">
                    {item}
                  </li>
                ))}
              </ol>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="BlogPost">
      <div className="BlogPostPage">
        <button className="mb-6 flex items-center text-blue-600 hover:text-blue-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Blog
        </button>

        {/* Cover Image */}
        <div className="relative w-full h-96 overflow-hidden rounded-xl mb-8">
          <img
            src={currentPost.coverImage.url}
            alt={currentPost.coverImage.altText || currentPost.title}
            className="object-cover w-full h-full"
          />
          {currentPost.isFeatured && (
            <span className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          )}
          {currentPost.isBreakingNews && (
            <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
              Breaking News
            </span>
          )}
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {currentPost.category.primary}
            </span>
            {currentPost.tags &&
              currentPost.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {currentPost.title}
          </h1>

          {currentPost.subtitle && (
            <h2 className="text-2xl text-gray-700 mb-4">
              {currentPost.subtitle}
            </h2>
          )}

          <div className="flex items-center mb-4">
            {currentPost.authors &&
              currentPost.authors.map((author, index) => (
                <div key={index} className="flex items-center mr-6">
                  {author.avatarImage && (
                    <img
                      src={author.avatarImage}
                      alt={author.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{author.name}</p>
                    {author.title && (
                      <p className="text-sm text-gray-600">{author.title}</p>
                    )}
                  </div>
                </div>
              ))}

            <div className="text-gray-600 text-sm">
              {formatDate(currentPost.publishedDate)}
              {currentPost.estimatedReadTime && (
                <span> · {currentPost.estimatedReadTime} min read</span>
              )}
            </div>
          </div>

          {currentPost.summary && (
            <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded my-6">
              <p className="italic text-gray-700">{currentPost.summary}</p>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="prose max-w-none">
          {currentPost.sections &&
            currentPost.sections.map((section, index) => (
              <div
                key={index}
                className={`mb-12 ${
                  section.layout === "full-width"
                    ? "w-full"
                    : section.layout === "two-column"
                    ? "md:grid md:grid-cols-2 md:gap-8"
                    : section.layout === "sidebar-right"
                    ? "md:grid md:grid-cols-3 md:gap-8"
                    : section.layout === "sidebar-left"
                    ? "md:grid md:grid-cols-3 md:gap-8"
                    : ""
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-4 ${
                    section.layout === "two-column" ||
                    section.layout === "sidebar-right" ||
                    section.layout === "sidebar-left"
                      ? "md:col-span-full"
                      : ""
                  }`}
                >
                  {section.title}
                </h2>

                {section.subtitle && (
                  <h3
                    className={`text-xl text-gray-700 mb-4 ${
                      section.layout === "two-column" ||
                      section.layout === "sidebar-right" ||
                      section.layout === "sidebar-left"
                        ? "md:col-span-full"
                        : ""
                    }`}
                  >
                    {section.subtitle}
                  </h3>
                )}

                {section.layout === "sidebar-left" ? (
                  <>
                    <div className="md:col-span-1 bg-gray-50 p-4 rounded">
                      {/* Sidebar content - typically additional info */}
                      <h4 className="font-medium mb-3">Key Points</h4>
                      <ul className="list-disc pl-5">
                        {section.contentBlocks
                          .filter((block) => block.type === "list")
                          .flatMap((block) => block.listItems)
                          .map((item, i) => (
                            <li key={i} className="mb-2 text-sm text-gray-700">
                              {item}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="md:col-span-2">
                      {section.contentBlocks
                        .sort((a, b) => a.order - b.order)
                        .map((block, blockIndex) =>
                          renderContentBlock(block, blockIndex)
                        )}
                    </div>
                  </>
                ) : section.layout === "sidebar-right" ? (
                  <>
                    <div className="md:col-span-2">
                      {section.contentBlocks
                        .filter((block) => block.type !== "callout")
                        .sort((a, b) => a.order - b.order)
                        .map((block, blockIndex) =>
                          renderContentBlock(block, blockIndex)
                        )}
                    </div>
                    <div className="md:col-span-1 bg-gray-50 p-4 rounded">
                      {/* Sidebar content */}
                      <h4 className="font-medium mb-3">
                        Additional Information
                      </h4>
                      {section.contentBlocks
                        .filter((block) => block.type === "callout")
                        .map((block, blockIndex) =>
                          renderContentBlock(block, blockIndex)
                        )}
                    </div>
                  </>
                ) : (
                  section.contentBlocks
                    .sort((a, b) => a.order - b.order)
                    .map((block, blockIndex) =>
                      renderContentBlock(block, blockIndex)
                    )
                )}
              </div>
            ))}
        </div>

        {/* Article Footer */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>{currentPost.likeCount || 0}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{currentPost.commentsCount || 0}</span>
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
