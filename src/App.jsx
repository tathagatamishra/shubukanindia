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
import Marksheet from "./Component/Marksheet/Marksheet";
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
import AdminAuth from "./Component/Admin/Auth/AdminAuth";
import MouseTrail from "./Component/UIComponent/MouseTrail";
import { isDesktop } from "react-device-detect";

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
    <p>
      The Registration is Open. Fill the form with necessary details. To check
      your email for your registration confirmation. Register to Shubukan India.
      <br />
      Click here for <a href="/registration">Registration</a>.
    </p>,
    <p>
      To check your marksheet, Obtain your unique code from your instructor.
      Enter the code to view your marksheet. <br />
      Click here for <a href="/marksheet">Marksheet</a>.
    </p>,
  ];

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="App" id="App">
      <BrowserRouter>
        {/* <div id="cursor">
          <img src={flag} alt="" />
        </div> */}

        {isDesktop && <MouseTrail />}

        {showNav && !window.location.href.includes("/admin") && (
          <Navbar showNav={showNav} />
        )}

        {!window.location.href.includes("/admin") && (
          <AnimatedCanvas onCanvasClick={openPopup} />
        )}
        {!window.location.href.includes("/admin") && (
          <Popup
            isOpen={isPopupOpen}
            onBtnClick={closePopup}
            notices={notices}
            title="NOTICE"
          />
        )}

        <div className="webBody">
          <Routes>
            <Route path="/membership" element={<Membership />} />
            <Route path="/download" element={<Download />} />
            <Route path="/services" element={<Services />} />
            <Route
              path="/gallery"
              element={<Gallery setShowNav={setShowNav} />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/history"
              element={<History setShowNav={setShowNav} />}
            />
            <Route path="/marksheet" element={<Marksheet />} />

            <Route path="/blog" element={<Blog />} />
            <Route path="/" element={<Home setShowNav={setShowNav} />} />

            <Route
              path="/shuri-karate-kobudo-hozonkai"
              element={<Hozonkai />}
            />

            <Route
              path="/lineage-and-dojokun"
              element={<LineageAndDojoKun />}
            />
            <Route path="/term-and-condition" element={<TAndC />} />
            <Route path="/karate-and-kobudo" element={<KarateAndKobudo />} />
            <Route path="/shubukan-okinawa" element={<ShubukanOkinawa />} />
            <Route path="/shubukan-india" element={<ShubukanIndia />} />
            <Route path="/help-and-faqs" element={<HAndF />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/contributor" element={<Contributor />} />
            <Route
              path="/shubukan-world"
              element={<ShubukanWorld setShowNav={setShowNav} />}
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <Admin setShowNav={setShowNav} setShowFoot={setShowFoot} />
              }
            />
            <Route
              path="/admin/auth"
              element={
                <AdminAuth setShowNav={setShowNav} setShowFoot={setShowFoot} />
              }
            />
          </Routes>
        </div>

        {showFoot && !window.location.href.includes("/admin") && <Footer />}

        {/* if path contains /admin, dont show banner */}

        {!window.location.href.includes("/admin") && <Banner />}
      </BrowserRouter>
    </div>
  );
}

export default App;
