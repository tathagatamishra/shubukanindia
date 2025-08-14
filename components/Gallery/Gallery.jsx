"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { shubukan_api } from "@/config";
import "./Gallery.scss";
import { placeholderColors } from "@/utils/random-colors";

export default function Gallery({ initialImages = [] }) {
  const [images, setImages] = useState(initialImages);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const observerRef = useRef();

  // Fetch images from backend
  const fetchImages = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await shubukan_api.get(`/gallery?page=${page}&limit=1`);
      setImages((prev) => [...prev, ...res.data.images]);
      setHasMore(page < res.data.totalPages);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
    setLoading(false);
  }, [page, loading, hasMore]);

  // Observe last element for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchImages();
        }
      },
      { threshold: 1.0 }
    );
    if (document.querySelector("#infinite-loader")) {
      observer.observe(document.querySelector("#infinite-loader"));
    }
    observerRef.current = observer;
  }, [fetchImages]);

  return (
    <div className="Gallery">
      <section className="Hero">
        <p className="heading">Gallery</p>
        <p>Beyond the realms</p>
      </section>

      <section className="align-image">
        <div>
          {images.map((image, index) => {
            const isLoaded = loadedImages.has(image._id || index);
            return (
              <div
                key={image._id || index}
                className="image"
                style={{
                  backgroundColor: isLoaded
                    ? "transparent"
                    : placeholderColors[index % placeholderColors.length],
                  aspectRatio: `${image.width} / ${image.height}`,
                }}
              >
                <Image
                  src={image.image}
                  alt={image.title}
                  width={image.width}
                  height={image.height}
                  className="object-cover transition-opacity duration-500"
                  onLoad={() => {
                    setLoadedImages((prev) => {
                      const newSet = new Set(prev);
                      newSet.add(image._id || index);
                      return newSet;
                    });
                  }}
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: "opacity 0.5s ease",
                  }}
                />
              </div>
            );
          })}
        </div>
      </section>

      {loading && <div className="text-center py-4">Loading...</div>}

      {hasMore && (
        <div
          id="infinite-loader"
          className="h-10 flex justify-center items-center"
        >
          <span className="loader"></span>
        </div>
      )}
    </div>
  );
}
