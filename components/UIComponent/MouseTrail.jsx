"use client";
import React, { useRef, useEffect, useState } from "react";
import { isDesktop, isMobile } from "react-device-detect";

const MouseTrail = () => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const prevPositionRef = useRef({ x: 0, y: 0 });
  const circlesRef = useRef([]);
  const headSize = isMobile ? 18 : 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const circlesNum = isMobile ? 0 : 100; // Fewer circles for better performance with filters
    const easing = 0.15;

    // Set canvas to full window size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Initialize position at center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseRef.current = { x: centerX, y: centerY };
    positionRef.current = { x: centerX, y: centerY };
    prevPositionRef.current = { x: centerX, y: centerY };

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation function
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Store previous position
      prevPositionRef.current = { ...positionRef.current };

      // Update position with easing
      const diffx = mouseRef.current.x - positionRef.current.x;
      const diffy = mouseRef.current.y - positionRef.current.y;
      positionRef.current.x += easing * diffx;
      positionRef.current.y += easing * diffy;

      // Calculate mouse speed
      const distance = Math.sqrt(
        Math.pow(positionRef.current.x - prevPositionRef.current.x, 2) +
          Math.pow(positionRef.current.y - prevPositionRef.current.y, 2)
      );

      // Add points based on speed
      if (distance > 0) {
        // More points when moving faster
        const pointsToAdd = Math.max(1, Math.min(Math.ceil(distance / 2), 10));

        for (let i = 0; i < pointsToAdd; i++) {
          const ratio = i / pointsToAdd;
          const interpX =
            prevPositionRef.current.x +
            ratio * (positionRef.current.x - prevPositionRef.current.x);
          const interpY =
            prevPositionRef.current.y +
            ratio * (positionRef.current.y - prevPositionRef.current.y);

          circlesRef.current.push({
            x: interpX,
            y: interpY,
          });
        }
      } else {
        // When not moving, still add current position
        circlesRef.current.push({
          x: positionRef.current.x,
          y: positionRef.current.y,
        });
      }

      // Remove excess circles
      while (circlesRef.current.length > circlesNum) {
        circlesRef.current.shift();
      }

      // Draw all circles
      for (let i = 0; i < circlesRef.current.length; i++) {
        const circle = circlesRef.current[i];
        const alpha = 0.2;
        const size = Math.max(1, i / headSize);

        ctx.fillStyle = `rgba(42, 39, 39, ${alpha})`;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    // Cleanup
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 90,
      }}
    />
  );
};

export default MouseTrail;
