import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./AnimatedCanvas.scss";

const AnimatedCanvas = ({ onCanvasClick }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(1);
  const animationFrameIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;

    canvas.width = 1920;
    canvas.height = 1080;

    // Preload images
    const imageCount = 31;
    imagesRef.current = new Array(imageCount).fill(null).map((_, index) => {
      const img = new Image();
      img.src = `Sprites/Notice/notice (${index + 1}).png`;
      return img;
    });

    // Draw first image when loaded
    imagesRef.current[0].onload = () => {
      context.drawImage(
        imagesRef.current[0],
        0,
        0,
        canvas.width,
        canvas.height
      );
    };

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  const playAnimationForward = () => {
    const context = contextRef.current;
    const images = imagesRef.current;
    const frameDelay = 1;
    // Adjust this value to control animation speed
    
    if (currentFrameRef.current % frameDelay === 0) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.drawImage(
        images[Math.floor((currentFrameRef.current - 1) / frameDelay)],
        0,
        0,
        context.canvas.width,
        context.canvas.height
      );
  
      if (Math.floor((currentFrameRef.current - 1) / frameDelay) >= 30) {
        cancelAnimationFrame(animationFrameIdRef.current);
        return;
      }
    }
  
    currentFrameRef.current++;
    animationFrameIdRef.current = requestAnimationFrame(playAnimationForward);
  };
  
  const playAnimationReverse = () => {
    const context = contextRef.current;
    const images = imagesRef.current;
    const frameDelay = 1;
    // Adjust this value to control animation speed
    
    if (currentFrameRef.current % frameDelay === 0) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.drawImage(
        images[Math.floor((currentFrameRef.current - 1) / frameDelay)],
        0,
        0,
        context.canvas.width,
        context.canvas.height
      );
  
      if (Math.floor((currentFrameRef.current - 1) / frameDelay) <= 1) {
        cancelAnimationFrame(animationFrameIdRef.current);
        return;
      }
    }
  
    currentFrameRef.current--;
    animationFrameIdRef.current = requestAnimationFrame(playAnimationReverse);
  };

  const handleMouseOver = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    currentFrameRef.current = 1;
    playAnimationForward();
  };

  const handleMouseLeave = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    currentFrameRef.current = 30;
    playAnimationReverse();
  };

  useEffect(() => {
    handleMouseOver();
    setTimeout(() => {
      handleMouseLeave();
    }, 3000);
  }, []);

  // every 30 seconds the animation will play again
  setInterval(() => {
    handleMouseOver();
    setTimeout(() => {
      handleMouseLeave();
      
    }, 3000);

  }, 30000);

  return (
    <canvas
    className="AnimCanvas"
      ref={canvasRef}
      onClick={() => {
        onCanvasClick();
      }}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    />
  );
};

// AnimatedCanvas.propTypes = {
//   onCanvasClick: PropTypes.func.isRequired
// };

export default AnimatedCanvas;
