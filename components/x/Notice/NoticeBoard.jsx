import React from "react";
import './NoticeBoard.scss'

export default function NoticeBoard() {
  return (
    <>
      <label htmlFor="header">header</label>
      <input type="text" id="header" />

      <label htmlFor="title">title</label>
      <input type="text" id="title" />

      <label htmlFor="description">description</label>
      <textarea name="" id="description"></textarea>

      <label htmlFor="link">link</label>
      <input type="text" id="link" />

      <label htmlFor="url">url</label>
      <input type="text" id="url" />
    </>
  );
}
