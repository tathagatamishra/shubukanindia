import React, { useEffect, useState } from "react";
import "./Admin.scss";
import { shubukan_api } from "../../config";
import axios from "axios";
import GalleryBoard from "./Gallery/GalleryBoard";
import MarksheetBoard from './Marksheet/MarksheetBoard'
import NoticeBoard from './Notice/NoticeBoard'

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = (token) => {
    axios
      .post(
        `${shubukan_api}/admin/validate`,
        { token: token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          window.location.href = "/admin/auth";
          return;
        }
      })
      .catch((err) => {
        setIsAdmin(false);
        window.location.href = "/admin/auth";
        return;
      });
  };

  // authenticating admin
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      checkAdmin(token);
    } else {
      setIsAdmin(false);
      window.location.href = "/admin/auth";
    }
  }, []);

  const editBoard = [
    { boardName: "Gallery", component: <GalleryBoard /> },
    { boardName: "Marksheet", component: <MarksheetBoard /> },
    { boardName: "Notice", component: <NoticeBoard/> },
  ];
  const [selectedBoard, setSelectedBoard] = useState(null);

  return isAdmin ? (
    <div className="AdminDashboard">
      <div className="header">
        <p>Dashboard</p>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        height="0"
        width="0"
      >
        <defs>
          <filter id="wobble">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".06"
              numOctaves="4"
            />
            <feDisplacementMap in="SourceGraphic" scale="6" />
          </filter>
        </defs>
      </svg>

      <div className="dashBoard">
        {editBoard.map((board, i) => (
          <div className="editBoard" key={i}>
            <p
              className="boardHeading"
              onClick={() => {
                setSelectedBoard(
                  selectedBoard === board.boardName ? null : board.boardName
                );
              }}
            >
              {board.boardName}
            </p>

            {selectedBoard === board.boardName ? (
              <div className="boardInput">{board.component}</div>
            ) : (
              <div className="boardPreview">
                <p></p>
              </div>
            )}
          </div>
        ))}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          height="0"
          width="0"
        >
          <defs>
            <filter id="wobble">
              <feTurbulence
                type="fractalNoise"
                baseFrequency=".06"
                numOctaves="4"
              />
              <feDisplacementMap in="SourceGraphic" scale="6" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  ) : (
    <div className="AdminDashboard"></div>
  );
}
