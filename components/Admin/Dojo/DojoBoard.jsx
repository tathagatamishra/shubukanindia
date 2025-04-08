import React, { useState, useEffect } from "react";
import "./DojoBoard.scss";

export default function DojoBoard(props) {
  const [dojoData, setDojoData] = useState({
    token: props.token,
    dojoName: "",
    dojoType: "",
    instructor: [""],
    image: [],
    contact: [[]],
    brunch: [[{ mainLocation: "", brunchAddress: [""] }]],
  });
  const [showDojoList, setShowDojoList] = useState(false);

  return (
    <>
      <div className="allDojo">
        {showDojoList && (
          <div className="dojoList">
            {props.allDojo.map((dojo, index) => (
              <div key={index}>{dojo.dojoName}</div>
            ))}
          </div>
        )}
        <input type="text" onClick={() => setShowDojoList(!showDojoList)} />
      </div>

      <div className="line"></div>
      <label htmlFor="header">header</label>
      <input type="text" id="header" />

      <label htmlFor="subtitle">subtitle</label>
      <input type="text" id="subtitle" />

      <label htmlFor="description">description</label>
      <textarea name="" id="description"></textarea>

      <label htmlFor="dojoname">dojo name</label>
      <input type="text" id="dojoname" />

      <label htmlFor="dojotype">dojo type</label>
      <input type="text" id="dojotype" />

      <label htmlFor="instructor">instructor</label>
      <input type="text" id="instructor" />

      <label htmlFor="image">image</label>
      <input type="text" id="image" />

      <label htmlFor="contact">contact</label>
      <input type="text" id="contact" />

      <label htmlFor="brunch">brunch</label>
      <input type="text" id="brunch" />
    </>
  );
}
