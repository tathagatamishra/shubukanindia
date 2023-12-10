import React from "react";

export default function ImageModal(props) {
  return (
    <div className="Modal">
      <div className="modal-bg"></div>

      <div className="img-holder">
        <img src={props.image} alt="" />

        <p className="comment"></p>

        <h1 className="title">{props.heading}</h1>

        <p className="description">{props.content}</p>
      </div>
    </div>
  );
}
