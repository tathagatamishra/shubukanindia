import React, { useState, useEffect } from "react";
import './GalleryBoard.scss'

export default function GalleryBoard(props) {
const [galleryData, setGalleryData] = useState({
  
});
  return (
    <>
      <label htmlFor="image">image</label>
      <input type="text" id="image" />

      <label htmlFor="title">title</label>
      <input type="text" id="title" />

      <label htmlFor="description">description</label>
      <textarea name="" id="description"></textarea>

      <label htmlFor="category">category</label>
      <textarea name="" id="category"></textarea>

      <label htmlFor="type">type</label>
      <input type="text" id="type" />

      <label htmlFor="time">time</label>
      <input type="text" id="time" />

      <button>Submit</button>
    </>
  );
}
