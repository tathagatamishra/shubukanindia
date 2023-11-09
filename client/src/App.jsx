import { useEffect, useState } from "react";
import "./App.scss";
import gsap from "gsap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Component/Home/Home";
import Navbar from "./Component/Navbar/Navbar";
import Footer from "./Component/Footer/Footer";
import Kata from "./Component/Kata/Kata";
import Blog from "./Component/Blog/Blog";

function App() {

  const [hidePopup, setHidePopup] = useState({})

  document.addEventListener("mousemove", (ev) => {
    const x = ev.clientX,
      y = ev.clientY;

    // lag cursor behind mouse
    gsap.to("#cursor", {
      duration: 0.2,
      x,
      y,
    });
  });

  return (
    <div className="App">
      <BrowserRouter>
        <div id="cursor"></div>

        <Navbar />

        <div className="webBody" onClick={()=>setHidePopup({})}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kata" element={<Kata />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
