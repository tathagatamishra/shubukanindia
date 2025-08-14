"use client";
import React, { useEffect, useState } from "react";
import "./Admin.scss";
import GalleryBoard from "./Gallery/GalleryBoard";
import MarksheetBoard from "./Marksheet/MarksheetBoard";
import NoticeBoard from "./Notice/NoticeBoard";
import DojoBoard from "./Dojo/DojoBoard";
import axios from "axios";
import { shubukan_api } from "../../config";
import RegBoard from "./Registration/RegBoard";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState("");
  const [allDojo, setAllDojo] = useState([]);

  // ---------------------------------------------
  // authenticating admin
  const checkAdmin = (token) => {
    shubukan_api
      .post(
        `/admin/validate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          setIsAdmin(true);
          return;
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

  // logout
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/auth";
  };

  // ---------------------------------------------

  // Dojo
  const createDojo = async (dojoData) => {
    await shubukan_api.post(`/dojo`, dojoData).then((res) => {
      if (res.data.success === true) {
        console.log("dojo created");
      } else {
        console.log("dojo not created");
      }
    });
  };

  const getDojo = async () => {
    const res = await shubukan_api.get(`/dojo`);
    return res.data;
  };

  const updateDojo = async () => {};

  const deleteDojo = async () => {};

  useEffect(() => {
    const fetchDojo = async () => {
      const data = await getDojo();
      setAllDojo(data);
    };
    fetchDojo();
  }, []);

  const [selectedBoard, setSelectedBoard] = useState(null);
  const editBoard = [
    { boardName: "Gallery", component: <GalleryBoard /> },
    { boardName: "Marksheet", component: <MarksheetBoard /> },
    { boardName: "Notice", component: <NoticeBoard /> },
    { boardName: "Registration", component: <RegBoard /> },
    {
      boardName: "Dojo",
      component: (
        <DojoBoard
          token={token}
          allDojo={allDojo}
          onCreateDojo={createDojo}
          onUpdateDojo={updateDojo}
          onDeleteDojo={deleteDojo}
        />
      ),
    },
  ];

  return isAdmin ? (
    <div className="AdminDashboard">
      <div className="header" onClick={() => logout()}>
        <p>Logout</p>
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
          <div
            className="editBoard"
            key={i}
            onClick={() => {
              setSelectedBoard(board.boardName);
            }}
          >
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
      </div>
    </div>
  ) : (
    <div className="AdminDashboard"></div>
  );
}
