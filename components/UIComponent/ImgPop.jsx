import React from "react";
import "./ImgPop.scss";
import { IoClose } from "react-icons/io5";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function ImgPop(props) {
  return (
    <>
      {props.isOpen && (
        <div className="Modal">
          <div
            className="modal-bg"
            onClick={() => {
              props.setIsOpen(false);
              props.setShowNav(true);
            }}
          ></div>

          <div className="img-holder">
            <div className="img-box">
              <LazyLoadImage
                className="img"
                alt={props.image}
                effect="blur"
                wrapperProps={{
                  style: { transitionDelay: "0s" },
                }}
                src={props.image}
              />
            </div>

            <div className="content-box">
              <p className="comment">{props.comment}</p>

              <h1 className="title">{props.heading}</h1>

              <p className="description">{props.content}</p>
            </div>

            <div className="crossBtn">
              <IoClose
                className="label"
                onClick={() => {
                  props.setIsOpen(false);
                  props.setShowNav(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
