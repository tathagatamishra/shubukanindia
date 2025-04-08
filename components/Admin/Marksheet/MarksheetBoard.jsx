import React from "react";
import "./MarksheetBoard.scss";

export default function MarksheetBoard() {
  return (
    <>
      <label htmlFor="header">header</label>
      <input type="text" id="header" />

      <label htmlFor="subtitle">subtitle</label>
      <input type="text" id="subtitle" />

      <label htmlFor="description">description</label>
      <textarea name="" id="description"></textarea>

      <label htmlFor="dojo">dojo</label>
      <input type="text" id="dojo" />

      <label htmlFor="password">password</label>
      <input type="text" id="password" />

      <label htmlFor="pdf">pdf</label>
      <input type="text" id="pdf" />
    </>
  );
}
