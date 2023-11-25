import React from "react";
import ReactDOM from "react-dom/client";
import { hydrate, render } from "react-dom";
import App from "./App";
import "./main.scss";

// const renderer = ReactDOM.createRoot(document.getElementById("root"));

// renderer.render(<App />);

// const App = (<App />)

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}