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
  const [columns, setColumns] = useState(4);
  const [columnHeights, setColumnHeights] = useState([]);

  const observerRef = useRef();
  const containerRef = useRef();

  // Calculate number of columns based on screen width
  const calculateColumns = useCallback(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width <= 330) return 2;
      if (width <= 500) return 3;
      if (width <= 810) return 3;
      return 4;
    }
    return 4;
  }, []);

  // Initialize column heights
  useEffect(() => {
    const cols = calculateColumns();
    setColumns(cols);
    setColumnHeights(new Array(cols).fill(0));
  }, [calculateColumns]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const cols = calculateColumns();
      setColumns(cols);
      setColumnHeights(new Array(cols).fill(0));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateColumns]);

  // Fetch images from backend
  const fetchImages = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await shubukan_api.get(`/gallery?page=${page}&limit=6`);
      setImages((prev) => [...prev, ...res.data.images]);
      setHasMore(page < res.data.totalPages);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
    setLoading(false);
  }, [page, loading, hasMore]);

  // Get shortest column index
  const getShortestColumnIndex = useCallback(() => {
    return columnHeights.indexOf(Math.min(...columnHeights));
  }, [columnHeights]);

  // Calculate image height based on aspect ratio and column width
  const calculateImageHeight = useCallback((image, columnWidth) => {
    const aspectRatio = image.width / image.height;
    return columnWidth / aspectRatio;
  }, []);

  // Organize images into columns for masonry layout
  const organizeImages = useCallback(() => {
    if (!containerRef.current || images.length === 0) return [];
    
    const containerWidth = containerRef.current.offsetWidth;
    const gap = 16; // 1rem gap
    const columnWidth = (containerWidth - (gap * (columns - 1))) / columns;
    
    const columnArrays = Array.from({ length: columns }, () => []);
    const tempHeights = new Array(columns).fill(0);

    images.forEach((image, index) => {
      const shortestColumnIndex = tempHeights.indexOf(Math.min(...tempHeights));
      const imageHeight = calculateImageHeight(image, columnWidth);
      
      columnArrays[shortestColumnIndex].push({
        ...image,
        index,
        calculatedHeight: imageHeight
      });
      
      tempHeights[shortestColumnIndex] += imageHeight + gap;
    });

    return columnArrays;
  }, [images, columns, calculateImageHeight]);

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

  const organizedImages = organizeImages();

  return (
    <div className="Gallery">
      <section className="Hero">
        <p className="heading">Gallery</p>
        <p>Beyond the realms</p>
      </section>

      <section className="align-image masonry" ref={containerRef}>
        {organizedImages.map((column, columnIndex) => (
          <div key={columnIndex} className="masonry-column">
            {column.map((image) => {
              const isLoaded = loadedImages.has(image._id || image.index);
              return (
                <div
                  key={image._id || image.index}
                  className="image"
                  style={{
                    backgroundColor: isLoaded
                      ? "transparent"
                      : placeholderColors[image.index % placeholderColors.length],
                    marginBottom: '1rem',
                  }}
                >
                  <Image
                    src={image.image}
                    alt={image.title}
                    width={image.width}
                    height={image.height}
                    className="img"
                    onLoad={() => {
                      setLoadedImages((prev) => {
                        const newSet = new Set(prev);
                        newSet.add(image._id || image.index);
                        return newSet;
                      });
                    }}
                    style={{
                      opacity: isLoaded ? 1 : 0,
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
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