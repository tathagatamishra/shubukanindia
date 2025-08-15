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
import { IoIosArrowBack } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";

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
  const [selectedComponent, setSelectedComponent] = useState(null);
  const editBoard = [
    { boardName: "Gallery", component: <GalleryBoard /> },
    { boardName: "Marksheet", component: <MarksheetBoard /> },
    { boardName: "Notice", component: <NoticeBoard /> },
    { boardName: "Registration", component: <RegBoard /> },
    { boardName: "Dojo", component: <DojoBoard /> },
  ];

  return isAdmin ? (
    <div className="AdminDashboard">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        height="0"
        width="0"
        className="wobble"
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

      <div className="header">
        <button
          className="w-[26px] h-[26px] sm:w-fit sm:h-fit"
          onClick={() => {
            setSelectedBoard("Admin");
            setSelectedComponent(null);
          }}
        >
          <IoIosArrowBack />
          <p className="hidden sm:flex">GO BACK</p>
        </button>

        <p>{selectedBoard}</p>
        
        <button
          className="w-[26px] h-[26px] sm:w-fit sm:h-fit"
          onClick={() => logout()}
        >
          <TbLogout2 />
          <p className="hidden sm:flex">LOGOUT</p>
        </button>
      </div>

      {selectedComponent ? (
        <>{selectedComponent}</>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {editBoard.map((board, index) => (
            <div
              key={index}
              className="editBoard"
              onClick={() => {
                setSelectedBoard(board.boardName);
                setSelectedComponent(board.component);
              }}
            >
              <p className="boardHeading">{board.boardName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className="AdminDashboard"></div>
  );
}
