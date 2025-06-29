import React, { useState, useEffect } from "react";
import "./RegBoard.scss";

import {
  TbStarFilled,
  TbStarOff,
  TbTrash,
  TbChevronUp,
  TbChevronDown,
} from "react-icons/tb";

import axios from "axios";
import { shubukan_api } from "../../../config";

export default function RegBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchRegistrations = async () => {
    try {
      const response = await shubukan_api.get(`/registration`);
      // Filter out deleted registrations and sort favorites to top
      const activeRegistrations = response.data.data
        .filter((reg) => !reg.isDeleted)
        .sort((a, b) => {
          if (a.isFavorite !== b.isFavorite) return b.isFavorite ? 1 : -1;
          return 0;
        });
      setRegistrations(activeRegistrations);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const registration = registrations.find((r) => r._id === id);
      await shubukan_api.put(`/registration/${id}`, {
        ...registration,
        isFavorite: !registration.isFavorite,
      });
      fetchRegistrations();
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await shubukan_api.put(`/registration/${id}`, {
        isDeleted: true,
      });
      fetchRegistrations();
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedRegistrations = () => {
    const filteredRegistrations = registrations.filter((reg) => {
      if (!searchTerm) return true;
      return reg[searchField]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });

    return filteredRegistrations.sort((a, b) => {
      let compareA = a[sortField];
      let compareB = b[sortField];

      if (sortField === "age") {
        compareA = new Date(a.dob);
        compareB = new Date(b.dob);
      }

      if (compareA < compareB) return sortDirection === "asc" ? -1 : 1;
      if (compareA > compareB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  return (
    <section className="registrations-table">
      <table>
        <thead>
          <tr>
            <th className="fav">Favorite</th>
            <th className="name" onClick={() => handleSort("name")}>
              Name{" "}
              {sortField === "name" &&
                (sortDirection === "asc" ? <TbChevronUp /> : <TbChevronDown />)}
            </th>
            <th className="email">Email</th>
            <th className="phone">Phone</th>
            <th className="state" onClick={() => handleSort("state")}>
              State{" "}
              {sortField === "state" &&
                (sortDirection === "asc" ? <TbChevronUp /> : <TbChevronDown />)}
            </th>
            <th className="age" onClick={() => handleSort("age")}>
              Age{" "}
              {sortField === "age" &&
                (sortDirection === "asc" ? <TbChevronUp /> : <TbChevronDown />)}
            </th>
            <th className="dob">DOB</th>
            <th className="gender" onClick={() => handleSort("gender")}>
              Gender{" "}
              {sortField === "gender" &&
                (sortDirection === "asc" ? <TbChevronUp /> : <TbChevronDown />)}
            </th>
            <th className="karate">Karate Exp.</th>
            <th className="other">Other Exp.</th>
            <th className="action">Delete</th>
          </tr>
        </thead>
        <tbody>
          {getSortedRegistrations().map((registration) => (
            <tr key={registration._id}>
              <td className="fav">
                <button
                  className="icon-button"
                  onClick={() => toggleFavorite(registration._id)}
                >
                  {registration.isFavorite ? (
                    <TbStarFilled className="star-filled" />
                  ) : (
                    <TbStarOff />
                  )}
                </button>
              </td>
              <td className="name">{registration.name}</td>
              <td className="email">{registration.xmail}</td>
              <td className="phone">{registration.phone}</td>
              <td className="state">{registration.state}</td>
              <td className="age">{registration.age}</td>
              <td className="dob">{registration.dob.split("T")[0]}</td>
              <td className="gender">{registration.gender}</td>
              <td className="karate">{registration.karateExperience}</td>
              <td className="other">
                {registration.otherMartialArtsExperience}
              </td>
              <td className="action">
                <button
                  className="icon-button delete"
                  onClick={() => handleDelete(registration._id)}
                >
                  <TbTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
