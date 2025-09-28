import React, { useState, useEffect } from "react";
import {
  Star,
  StarOff,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import "./Admin.scss";
import { shubukan_api } from "../../config";

const CREDENTIALS = {
  username: "admin",
  password: "nimda",
};

const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookie = (name) => {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(cookieName)) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
};

export default function Admin({ setShowNav, setShowFoot }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const authToken = getCookie("adminAuth");
    if (authToken === "authenticated") {
      setIsAuthenticated(true);
      setShowNav(true);
      setShowFoot(true);
    } else {
      setShowLoginModal(true);
      setShowNav(false);
      setShowFoot(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
      setShowNav(true);
      setShowFoot(true);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (
      loginForm.username === CREDENTIALS.username &&
      loginForm.password === CREDENTIALS.password
    ) {
      setCookie("adminAuth", "authenticated", 7); // Cookie expires in 7 days
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get(
        `${shubukan_api}/registration`
      );
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
      await axios.put(
        `${shubukan_api}/registration/${id}`,
        {
          ...registration,
          isFavorite: !registration.isFavorite,
        }
      );
      fetchRegistrations();
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${shubukan_api}/registration/${id}`,
        {
          isDeleted: true,
        }
      );
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

  if (!isAuthenticated) {
    return (
      <div className="admin-login-overlay">
        <div className="admin-login-modal">
          <h2>Admin Login</h2>
          <div className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm({ ...loginForm, username: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />
            {loginError && <div className="login-error">{loginError}</div>}
            <div className="BtnDiv">
              <button className="button-54" onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="AdminDashboard">
      <section className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage Registrations</p>
        <div className="underline"></div>
      </section>

      {/* <section className="search-section">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder={`Search by ${searchField}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="state">State</option>
          </select>
        </div>
      </section> */}

      <section className="registrations-table">
        <table>
          <thead>
            <tr>
              <th className="fav">Favorite</th>
              <th className="name" onClick={() => handleSort("name")}>
                Name{" "}
                {sortField === "name" &&
                  (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
              </th>
              <th className="email">Email</th>
              <th className="phone">Phone</th>
              <th className="state" onClick={() => handleSort("state")}>
                State{" "}
                {sortField === "state" &&
                  (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
              </th>
              <th className="age" onClick={() => handleSort("age")}>
                Age{" "}
                {sortField === "age" &&
                  (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
              </th>
              <th className="dob">DOB</th>
              <th className="gender" onClick={() => handleSort("gender")}>
                Gender{" "}
                {sortField === "gender" &&
                  (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
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
                      <Star className="star-filled" />
                    ) : (
                      <StarOff />
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
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
