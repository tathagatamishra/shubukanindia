import React from "react";
import "./ImgPop.scss";
import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";

export default function ImgPop(props) {
  return (
    <>
      {props.isOpen && (
        <div className="Modal">
          <div
            className="modal-bg"
            onClick={() => props.setIsOpen(false)}
          ></div>

          <div className="img-holder">
            <img src={props.image} alt="" />

            <p className="comment">{props.comment}</p>

            <h1 className="title">{props.heading}</h1>

            <p className="description">{props.content}</p>

            <div className="crossBtn">
              <IonIcon
                icon={close}
                className="label"
                onClick={() => props.setIsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
