import React, { useEffect, useState } from "react";
import "./Gallery.scss";

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
import img_23 from "../../images/mae_keri.webp";
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
import img_36 from "../../images/takeshi_profile.jpg";
import img_37 from "../../images/training1.jpeg";
import img_38 from "../../images/uema_teWaza (1).jpg";
import img_39 from "../../images/uema_teWaza (1).webp";
import img_40 from "../../images/uema_teWaza (2).jpg";
import img_41 from "../../images/uema_teWaza (3).jpg";
import img_42 from "../../images/uema_teWaza (4).jpg";
import img_43 from "../../images/uema_teWaza (5).jpg";
import img_44 from "../../images/yasuhiro_profile.jpg";
import img_45 from "../../images/sabyasachi1.jpg";
import img_46 from "../../images/sabyasachi2.jpg";

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
import thumb_23 from "../../thumbnail/mae_keri.webp";
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
import thumb_36 from "../../thumbnail/takeshi_profile.jpg";
import thumb_37 from "../../thumbnail/training1.jpeg";
import thumb_38 from "../../thumbnail/uema_teWaza (1).jpg";
import thumb_39 from "../../thumbnail/uema_teWaza (1).webp";
import thumb_40 from "../../thumbnail/uema_teWaza (2).jpg";
import thumb_41 from "../../thumbnail/uema_teWaza (3).jpg";
import thumb_42 from "../../thumbnail/uema_teWaza (4).jpg";
import thumb_43 from "../../thumbnail/uema_teWaza (5).jpg";
import thumb_44 from "../../thumbnail/yasuhiro_profile.jpg";
import thumb_45 from "../../thumbnail/sabyasachi1.jpg";
import thumb_46 from "../../thumbnail/sabyasachi2.jpg";

export default function Gallery({ setShowNav }) {
  const imgArray = [
    img_1,
    img_4,
    img_3,
    img_5,
    img_6,
    img_7,
    img_8,
    img_9,
    img_10,
    img_11,
    img_12,
    img_13,
    img_14,
    img_15,
    img_16,
    img_17,
    img_18,
    img_19,
    img_20,
    img_21,
    img_22,
    img_23,
    img_24,
    img_25,
    img_26,
    img_27,
    img_28,
    img_29,
    img_30,
    img_31,
    img_32,
    img_33,
    img_34,
    img_35,
    img_36,
    img_37,
    img_38,
    img_39,
    img_40,
    img_41,
    img_42,
    img_43,
    img_44,
    // img_45,
    // img_46,
  ];
  const thumbArray = [
    thumb_1,
    thumb_4,
    thumb_3,
    thumb_5,
    thumb_6,
    thumb_7,
    thumb_8,
    thumb_9,
    thumb_10,
    thumb_11,
    thumb_12,
    thumb_13,
    thumb_14,
    thumb_15,
    thumb_16,
    thumb_17,
    thumb_18,
    thumb_19,
    thumb_20,
    thumb_21,
    thumb_22,
    thumb_23,
    thumb_24,
    thumb_25,
    thumb_26,
    thumb_27,
    thumb_28,
    thumb_29,
    thumb_30,
    thumb_31,
    thumb_32,
    thumb_33,
    thumb_34,
    thumb_35,
    thumb_36,
    thumb_37,
    thumb_38,
    thumb_39,
    thumb_40,
    thumb_41,
    thumb_42,
    thumb_43,
    thumb_44,
    // thumb_45,
    // thumb_46,
  ];

  const [popImg, setPopImg] = useState("");
  const [imgClicked, setImgClicked] = useState(false);

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
  return (
    <div className="Gallery">
      <section className="Hero">
        <h1>Gallery</h1>
        <p>Beyond the realms</p>
      </section>
      {imgClicked && (
        <div className="popUp">
          <div className="popBack" onClick={imgPop}></div>
          <div className="imgPop">
            <img src={popImg} alt="image" />
          </div>
        </div>
      )}

      <section className="gallery-image">
        {/* <h1 className="galleryTop">Gallery</h1> */}
        <div>
          {thumbArray.map((image, index) => (
            <div className="image" key={index} onClick={() => imgPop(imgArray[index])}>
              <img src={image} alt={`Image ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      <div className="line"></div>
    </div>
  );
}
