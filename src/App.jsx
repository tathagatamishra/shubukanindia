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

import ReactGA from "react-ga";
import Banner from "./Component/UIComponent/Banner";
import Registration from "./Component/Registration/Registration";
import Admin from "./Component/Admin/Admin";
import AnimatedCanvas from "./Component/UIComponent/AnimatedCanvas";
import Popup from "./Component/UIComponent/Popup";

function App() {
  const TRACKING_ID = "G-RXSEE0D376";
  ReactGA.initialize(TRACKING_ID);

  const [showNav, setShowNav] = useState(true);
  const [showFoot, setShowFoot] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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

  const notices = [
    "Hey! I'm a notice. I'm here to tell you something important. So, please pay attention to me.",
    "Hey! I'm a notice. I'm here to tell you something important. So, please pay attention to me.",
    "Hey! I'm a notice. I'm here to tell you something important. So, please pay attention to me.",
  ];

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="App" id="App">
      <BrowserRouter>
        <div id="cursor">
          <img src={flag} alt="" />
        </div>

        {showNav && <Navbar showNav={showNav} />}

        <AnimatedCanvas onCanvasClick={openPopup} />
        <Popup isOpen={true} onClose={closePopup} notices={notices} />

          <div className="webBody">
            <Routes>
              <Route path="/membership"  element={<Membership />} />
              <Route path="/download"    element={<Download />} />
              <Route path="/services"    element={<Services />} />
              <Route path="/gallery"     element={<Gallery setShowNav={setShowNav} />} />
              <Route path="/contact"     element={<Contact />} />
              <Route path="/history"     element={<History setShowNav={setShowNav} />} />
              <Route path="/marksheet"      element={<CalenderAndNotice />} />
              <Route path="/admin"       element={<Admin setShowNav={setShowNav} setShowFoot={setShowFoot} />} />
              <Route path="/blog"        element={<Blog />} />
              <Route path="/"            element={<Home setShowNav={setShowNav} />} />

              <Route path="/shuri-karate-kobudo-hozonkai" element={<Hozonkai />} />
              
              <Route path="/lineage-and-dojokun" element={<LineageAndDojoKun />} />
              <Route path="/term-and-condition" element={<TAndC />} />
              <Route path="/karate-and-kobudo"  element={<KarateAndKobudo />} />
              <Route path="/shubukan-okinawa"   element={<ShubukanOkinawa />} />
              <Route path="/shubukan-india"     element={<ShubukanIndia />} />
              <Route path="/help-and-faqs"      element={<HAndF />} />
              <Route path="/registration"       element={<Registration />} />
              <Route path="/contributor"        element={<Contributor />} />
              <Route path="/shubukan-world"     element={<ShubukanWorld setShowNav={setShowNav} />} />
            </Routes>
          </div>

          {showFoot && <Footer />}

          <Banner />
        </BrowserRouter>
      </div>
  );
}

export default App;
