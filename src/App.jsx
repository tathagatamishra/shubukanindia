import { useEffect, useState } from "react";
import "./App.scss";
import gsap from "gsap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Component/Home/Home";
import Navbar from "./Component/Navbar/Navbar";
import Footer from "./Component/Footer/Footer";
import History from "./Component/History/History";
import ShubukanIndia from "./Component/ShubukanIndia/ShubukanIndia";
import ShubukanOkinawa from "./Component/ShubukanOkinawa/ShubukanOkinawa";
import ShubukanWorld from "./Component/ShubukanWorld/ShubukanWorld";
import Hozonkai from "./Component/Hozonkai/Hozonkai";
import LineageAndDojoKun from "./Component/LineageAndDojoKun/LineageAndDojoKun";
import KarateAndKobudo from "./Component/KarateAndKobudo/KarateAndKobudo";
import CalenderAndNotice from "./Component/CalenderAndNotice/CalenderAndNotice";
import Membership from "./Component/Membership/Membership";
import Services from "./Component/Services/Services";
import Gallery from "./Component/Gallery/Gallery";
import Blog from "./Component/Blog/Blog";
import Contact from "./Component/Contact/Contact";
import TAndC from "./Component/TAndC/TAndC";
import flag from "./assets/ryukyu-flag.png";
import Contributor from "./Component/Contributor/Contributor";
import HAndF from "./Component/HAndF/HAndF";
import Download from "./Component/Download/Download";

import ReactGA from 'react-ga';

function App() {

  const TRACKING_ID = "G-561PS7T79G";
  ReactGA.initialize(TRACKING_ID);


  const [showNav, setShowNav] = useState(true);

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

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
      <div className="App" id="App">
        <BrowserRouter>
          <div id="cursor">
            <img src={flag} alt="" />
          </div>

          {showNav && <Navbar showNav={showNav} />}

          <div className="webBody">
            <Routes>
              <Route path="/Hozonkai"          element={<Hozonkai />} />
              <Route path="/KarateAndKobudo"   element={<KarateAndKobudo />} />
              <Route path="/LineageAndDojoKun" element={<LineageAndDojoKun />} />
              <Route path="/CalenderAndNotice" element={<CalenderAndNotice />} />
              <Route path="/ShubukanOkinawa" element={<ShubukanOkinawa />} />
              <Route path="/ShubukanIndia"   element={<ShubukanIndia />} />
              <Route path="/ShubukanWorld" element={<ShubukanWorld setShowNav={setShowNav} />} />
              <Route path="/"            element={<Home setShowNav={setShowNav} />} />
              <Route path="/History"     element={<History setShowNav={setShowNav} />} />
              <Route path="/Membership"  element={<Membership />} />
              <Route path="/Services"    element={<Services />} />
              <Route path="/Gallery"     element={<Gallery setShowNav={setShowNav} />} />
              <Route path="/Blog"        element={<Blog />} />
              <Route path="/Contact"     element={<Contact />} />
              <Route path="/TAndC"       element={<TAndC />} />
              <Route path="/Contributor" element={<Contributor />} />
              <Route path="/HAndF"       element={<HAndF />} />
              <Route path="/Download"    element={<Download />} />
            </Routes>
          </div>

          <Footer />
        </BrowserRouter>
      </div>
  );
}

export default App;
