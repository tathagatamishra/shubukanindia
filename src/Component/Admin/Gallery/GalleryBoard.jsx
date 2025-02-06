import React from "react";
import './GalleryBoard.scss'

export default function GalleryBoard() {
  return (
    <>
      <label htmlFor="header">header</label>
      <input type="text" id="header" />

      <label htmlFor="subtitle">subtitle</label>
      <input type="text" id="subtitle" />

      <label htmlFor="image">image</label>
      <input type="text" id="image" />

      <label htmlFor="title">title</label>
      <input type="text" id="title" />

      <label htmlFor="description">description</label>
      <textarea name="" id="description"></textarea>

      <label htmlFor="type">type</label>
      <input type="text" id="type" />

      <label htmlFor="time">time</label>
      <input type="text" id="time" />
    </>
  );
}
