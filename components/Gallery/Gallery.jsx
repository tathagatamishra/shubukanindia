"use client";
import React, { useEffect, useState } from "react";
import "./Gallery.scss";
import { shubukan_api } from "../../config";
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { CiGrid42, CiGrid2H } from "react-icons/ci";
import { HiMiniUserGroup } from "react-icons/hi2";
import { GiDragonSpiral, GiPunch } from "react-icons/gi";
import { TbCameraSelfie } from "react-icons/tb";
import { FaToriiGate } from "react-icons/fa";

import img_1 from "../../images/chibana.jpg";
import img_4 from "../../images/contai_group.jpeg";
import img_3 from "../../images/family1.jpeg";
import img_5 from "../../images/group (1).jpeg";
import img_6 from "../../images/group (10).jpeg";
import img_7 from "../../images/group (11).jpeg";
import img_8 from "../../images/group (2).jpeg";
import img_9 from "../../images/group (3).jpeg";
import img_10 from "../../images/group (4).jpeg";
import img_11 from "../../images/group (5).jpeg";
import img_12 from "../../images/group (6).jpeg";
import img_13 from "../../images/group (7).jpeg";
import img_14 from "../../images/group (8).jpeg";
import img_15 from "../../images/group (9).jpeg";
import img_16 from "../../images/img.jpeg";
import img_17 from "../../images/img.jpg";
import img_18 from "../../images/jan1.jpeg";
import img_19 from "../../images/joki_block.jpg";
import img_20 from "../../images/joki_profile.jpg";
import img_21 from "../../images/joki_sai.jpg";
import img_22 from "../../images/kaynChotuku.png";
// import img_23 from "../../images/mae_keri.webp";
import img_24 from "../../images/Matsumura.png";
import img_25 from "../../images/oldGroup.jpg";
import img_26 from "../../images/press1.jpg";
import img_27 from "../../images/press2.jpg";
import img_28 from "../../images/selfie (1).jpeg";
import img_29 from "../../images/selfie (2).jpeg";
import img_30 from "../../images/selfie (3).jpeg";
import img_31 from "../../images/selfie (4).jpeg";
import img_32 from "../../images/selfie (5).jpeg";
import img_33 from "../../images/shuri_castel.jpg";
import img_34 from "../../images/speech1.jpeg";
import img_35 from "../../images/speech2.jpeg";
// import img_36 from "../../images/takeshi_profile.jpg";
import img_37 from "../../images/training1.jpeg";
// import img_38 from "../../images/uema_teWaza (1).jpg";
// import img_39 from "../../images/uema_teWaza (1).webp";
// import img_40 from "../../images/uema_teWaza (2).jpg";
// import img_41 from "../../images/uema_teWaza (3).jpg";
// import img_42 from "../../images/uema_teWaza (4).jpg";
// import img_43 from "../../images/uema_teWaza (5).jpg";
// import img_44 from "../../images/yasuhiro_profile.jpg";
import img_45 from "../../images/training (4).jpeg";
import img_46 from "../../images/training (3).jpeg";
import img_47 from "../../images/training (2).jpeg";
import img_48 from "../../images/training (1).jpeg";
import img_49 from "../../images/speech (2).jpeg";
import img_50 from "../../images/speech (1).jpeg";
import img_51 from "../../images/group (15).jpeg";
import img_52 from "../../images/group (14).jpeg";
import img_53 from "../../images/group (13).jpeg";
import img_54 from "../../images/group (12).jpeg";
import img_55 from "../../images/cafe.jpeg";
import img_56 from "../../images/shuri_castel (2).jpg";
import img_57 from "../../images/shuri_castel (3).jpg";
import img_58 from "../../images/tori_gate.jpg";
import img_59 from "../../images/okinawa.jpg";
import img_60 from "../../images/okinawa (2).jpg";

import thumb_1 from "../../thumbnail/chibana.jpg";
import thumb_4 from "../../thumbnail/contai_group.jpeg";
import thumb_3 from "../../thumbnail/family1.jpeg";
import thumb_5 from "../../thumbnail/group (1).jpeg";
import thumb_6 from "../../thumbnail/group (10).jpeg";
import thumb_7 from "../../thumbnail/group (11).jpeg";
import thumb_8 from "../../thumbnail/group (2).jpeg";
import thumb_9 from "../../thumbnail/group (3).jpeg";
import thumb_10 from "../../thumbnail/group (4).jpeg";
import thumb_11 from "../../thumbnail/group (5).jpeg";
import thumb_12 from "../../thumbnail/group (6).jpeg";
import thumb_13 from "../../thumbnail/group (7).jpeg";
import thumb_14 from "../../thumbnail/group (8).jpeg";
import thumb_15 from "../../thumbnail/group (9).jpeg";
import thumb_16 from "../../thumbnail/img.jpeg";
import thumb_17 from "../../thumbnail/img.jpg";
import thumb_18 from "../../thumbnail/jan1.jpeg";
import thumb_19 from "../../thumbnail/joki_block.jpg";
import thumb_20 from "../../thumbnail/joki_profile.jpeg";
import thumb_21 from "../../thumbnail/joki_sai.jpg";
import thumb_22 from "../../thumbnail/kaynChotuku.jpg";
// import thumb_23 from "../../thumbnail/mae_keri.webp";
import thumb_24 from "../../thumbnail/Matsumura.jpg";
import thumb_25 from "../../thumbnail/oldGroup.jpg";
import thumb_26 from "../../thumbnail/press1.jpg";
import thumb_27 from "../../thumbnail/press2.jpg";
import thumb_28 from "../../thumbnail/selfie (1).jpeg";
import thumb_29 from "../../thumbnail/selfie (2).jpeg";
import thumb_30 from "../../thumbnail/selfie (3).jpeg";
import thumb_31 from "../../thumbnail/selfie (4).jpeg";
import thumb_32 from "../../thumbnail/selfie (5).jpeg";
import thumb_33 from "../../thumbnail/shuri_castel.jpg";
import thumb_34 from "../../thumbnail/speech1.jpeg";
import thumb_35 from "../../thumbnail/speech2.jpeg";
// import thumb_36 from "../../thumbnail/takeshi_profile.jpg";
import thumb_37 from "../../thumbnail/training1.jpeg";
// import thumb_38 from "../../thumbnail/uema_teWaza (1).jpg";
// import thumb_39 from "../../thumbnail/uema_teWaza (1).webp";
// import thumb_40 from "../../thumbnail/uema_teWaza (2).jpg";
// import thumb_41 from "../../thumbnail/uema_teWaza (3).jpg";
// import thumb_42 from "../../thumbnail/uema_teWaza (4).jpg";
// import thumb_43 from "../../thumbnail/uema_teWaza (5).jpg";
// import thumb_44 from "../../thumbnail/yasuhiro_profile.jpg";
import thumb_45 from "../../thumbnail/training (4).jpeg";
import thumb_46 from "../../thumbnail/training (3).jpeg";
import thumb_47 from "../../thumbnail/training (2).jpeg";
import thumb_48 from "../../thumbnail/training (1).jpeg";
import thumb_49 from "../../thumbnail/speech (2).jpeg";
import thumb_50 from "../../thumbnail/speech (1).jpeg";
import thumb_51 from "../../thumbnail/group (15).jpeg";
import thumb_52 from "../../thumbnail/group (14).jpeg";
import thumb_53 from "../../thumbnail/group (13).jpeg";
import thumb_54 from "../../thumbnail/group (12).jpeg";
import thumb_55 from "../../thumbnail/cafe.jpeg";
import thumb_56 from "../../thumbnail/shuri_castel (2).jpg";
import thumb_57 from "../../thumbnail/shuri_castel (3).jpg";
import thumb_58 from "../../thumbnail/tori_gate.jpg";
import thumb_59 from "../../thumbnail/okinawa.jpg";
import thumb_60 from "../../thumbnail/okinawa (2).jpg";

import ReactGA from "react-ga";
import ImageUploader from "../UIComponent/ImageUploader";
import useSound from "use-sound";
import audio from "../../Music/ui-click.mp3";
import audio2 from "../../Music/light-switch.mp3";

export default function Gallery({ setShowNav }) {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  const imgArray = [
    { imgItem: img_1 },
    { imgItem: img_21 },
    { imgItem: img_4 },
    { imgItem: img_3 },
    { imgItem: img_5 },
    { imgItem: img_6 },
    { imgItem: img_7 },
    { imgItem: img_8 },
    { imgItem: img_9 },
    { imgItem: img_10 },
    { imgItem: img_11 },
    { imgItem: img_12 },
    { imgItem: img_24 },
    { imgItem: img_25 },
    { imgItem: img_14 },
    { imgItem: img_13 },
    { imgItem: img_15 },
    { imgItem: img_16 },
    { imgItem: img_17 },
    { imgItem: img_18 },
    { imgItem: img_20 },
    { imgItem: img_26 },
    { imgItem: img_22 },
    { imgItem: img_19 },
    { imgItem: img_27 },
    { imgItem: img_28 },
    { imgItem: img_29 },
    { imgItem: img_30 },
    { imgItem: img_31 },
    { imgItem: img_32 },
    { imgItem: img_33 },
    { imgItem: img_34 },
    { imgItem: img_35 },
    { imgItem: img_37 },
    { imgItem: img_45 },
    { imgItem: img_46 },
    { imgItem: img_47 },
    { imgItem: img_48 },
    { imgItem: img_49 },
    { imgItem: img_50 },
    { imgItem: img_51 },
    { imgItem: img_52 },
    { imgItem: img_53 },
    { imgItem: img_54 },
    { imgItem: img_55 },
    { imgItem: img_56 },
    { imgItem: img_57 },
    { imgItem: img_58 },
    { imgItem: img_59 },
    { imgItem: img_60 },
  ];
  const thumbArray = [
    { imgItem: thumb_1, tags: ["sensei"] },
    { imgItem: thumb_21, tags: ["sensei"] },
    { imgItem: thumb_4, tags: ["group"] },
    { imgItem: thumb_3, tags: ["group"] },
    { imgItem: thumb_5, tags: ["group"] },
    { imgItem: thumb_6, tags: ["group"] },
    { imgItem: thumb_7, tags: ["group"] },
    { imgItem: thumb_8, tags: ["group"] },
    { imgItem: thumb_9, tags: ["group"] },
    { imgItem: thumb_10, tags: ["group"] },
    { imgItem: thumb_11, tags: ["group"] },
    { imgItem: thumb_12, tags: ["group"] },
    { imgItem: thumb_24, tags: ["sensei"] },
    { imgItem: thumb_25, tags: ["group"] },
    { imgItem: thumb_14, tags: ["group"] },
    { imgItem: thumb_13, tags: ["group"] },
    { imgItem: thumb_15, tags: ["group"] },
    { imgItem: thumb_16, tags: ["selfie"] },
    { imgItem: thumb_17, tags: ["selfie"] },
    { imgItem: thumb_18, tags: ["training"] },
    { imgItem: thumb_20, tags: ["sensei"] },
    { imgItem: thumb_26, tags: ["selfie"] },
    { imgItem: thumb_22, tags: ["sensei"] },
    { imgItem: thumb_19, tags: ["sensei"] },
    { imgItem: thumb_27, tags: ["selfie"] },
    { imgItem: thumb_28, tags: ["selfie"] },
    { imgItem: thumb_29, tags: ["selfie"] },
    { imgItem: thumb_30, tags: ["selfie"] },
    { imgItem: thumb_31, tags: ["selfie"] },
    { imgItem: thumb_32, tags: ["selfie"] },
    { imgItem: thumb_33, tags: ["okinawa"] },
    { imgItem: thumb_34, tags: ["selfie"] },
    { imgItem: thumb_35, tags: ["selfie"] },
    { imgItem: thumb_37, tags: ["training"] },
    { imgItem: thumb_45, tags: ["training"] },
    { imgItem: thumb_46, tags: ["training"] },
    { imgItem: thumb_47, tags: ["training"] },
    { imgItem: thumb_48, tags: ["training"] },
    { imgItem: thumb_49, tags: ["selfie"] },
    { imgItem: thumb_50, tags: ["group"] },
    { imgItem: thumb_51, tags: ["group"] },
    { imgItem: thumb_52, tags: ["group"] },
    { imgItem: thumb_53, tags: ["group"] },
    { imgItem: thumb_54, tags: ["group"] },
    { imgItem: thumb_55, tags: ["selfie"] },
    { imgItem: thumb_56, tags: ["okinawa"] },
    { imgItem: thumb_57, tags: ["okinawa"] },
    { imgItem: thumb_58, tags: ["okinawa"] },
    { imgItem: thumb_59, tags: ["okinawa"] },
    { imgItem: thumb_60, tags: ["okinawa"] },
  ];

  const tagsArray = ["sensei", "group", "training", "okinawa", "selfie"];
  const tagIcons = [
    <GiDragonSpiral className="icon" />,
    <HiMiniUserGroup className="icon" />,
    <GiPunch className="icon" />,
    <FaToriiGate className="icon" />,
    <TbCameraSelfie className="icon" />,
  ];

  const [selectedTag, setSelectedTag] = useState("");
  const [filteredArr, setFilteredArr] = useState([]);

  useEffect(() => {
    setFilteredArr(
      thumbArray.filter((item) => item.tags.includes(selectedTag))
    );
  }, [selectedTag]);

  const [isAlign, setIsAlign] = useState(true);
  const [popImg, setPopImg] = useState("");
  const [imgClicked, setImgClicked] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  function imgPop(srcValue) {
    if (imgClicked == true) {
      setPopImg("");
      setImgClicked(false);
      setShowNav(true);
    } else if (imgClicked == false) {
      setShowNav(false);
      setPopImg(srcValue);
      setImgClicked(true);
    }
  }

  const [play] = useSound(audio);


    const [galleries, setGalleries] = useState([]);
    useEffect(() => {
      fetchGalleries();
    }, []);
  
    // get api call
    const fetchGalleries = async () => {
      try {
        const { data } = await shubukan_api.get("/gallery");
        setGalleries(data.items);
      } catch (error) {
        console.error("Full error:", error);
        setError(
          "Failed to fetch galleries: " +
            (error.response?.data?.message || error.message)
        );
      }
    };

    useEffect(() => {
      console.log(galleries);
      
    }, [galleries]);

  return (
    <div className="Gallery">
      <section className="Hero">
        <p className="heading">Gallery</p>
        <p>Beyond the realms</p>
        {/* <ImageUploader /> */}
      </section>

      {/* {imgClicked && (
        <div className="popUp">
          <div className="popBack" onClick={imgPop}></div>
          <div className="imgPop" onClick={imgPop}>
            <img src={popImg} alt="image" />
          </div>
        </div>
      )} */}

      {isOpen && isAlign && (
        <Lightbox
          mainSrc={galleries[photoIndex].image}
          nextSrc={galleries[(photoIndex + 1) % galleries.length]}
          prevSrc={
            galleries[(photoIndex + galleries.length - 1) % galleries.length]
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + galleries.length - 1) % galleries.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % galleries.length)
          }
        />
      )}

      {isOpen && !isAlign && filteredArr.length !== 0 && (
        <Lightbox
          mainSrc={filteredArr[photoIndex].imgItem}
          nextSrc={filteredArr[(photoIndex + 1) % filteredArr.length]}
          prevSrc={
            filteredArr[
              (photoIndex + filteredArr.length - 1) % filteredArr.length
            ]
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + filteredArr.length - 1) % filteredArr.length
            )
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % filteredArr.length)
          }
        />
      )}

      <section className="align-option">
        <div className="options">
          {isAlign ? (
            <div
              className="align"
              onClick={() => {
                setIsAlign(false);
                play();
              }}
            >
              <CiGrid42 />
            </div>
          ) : (
            <div
              className="align"
              onClick={() => {
                setIsAlign(true);
                play();
              }}
            >
              <CiGrid2H />
            </div>
          )}
        </div>
      </section>

      {isAlign ? (
        <section className="align-image">
          <div>
            {galleries.map((image, index) => (
              <div
                className="image"
                key={index}
                onClick={() => {
                  setIsOpen(true);
                  setPhotoIndex(index);
                }}
              >
                <LazyLoadImage
                  className="img"
                  alt={`${image.tags.map((tag) => `${tag}`)}`}
                  effect="blur"
                  wrapperProps={{
                    // If you need to, you can tweak the effect transition using the wrapper style.
                    style: { transitionDelay: "0s" },
                  }}
                  src={image.image}
                />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="notAlign-image">
          {tagsArray.map((tag, i) => (
            <div className="align-image" key={i}>
              <h1>{tagIcons[i]}</h1>
              <div className="row">
                {thumbArray
                  .filter((item) => item.tags.includes(tag))
                  .map((image, index) => (
                    <div className="column" key={index}>
                      <div
                        className="image"
                        onClick={() => {
                          setSelectedTag(tag);
                          setIsOpen(true);
                          setPhotoIndex(index);
                        }}
                      >
                        <LazyLoadImage
                          className="img"
                          alt={`Image ${index + 1}`}
                          effect="blur"
                          wrapperProps={{
                            style: { transitionDelay: "0s" },
                          }}
                          src={image.imgItem}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </section>
      )}

      <div className="line"></div>
    </div>
  );
}
