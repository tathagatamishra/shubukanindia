import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Membership.scss";
import { IoSearch } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

import dipak_maity from "../../dojo_instructors/dipak_maity.jpeg";
import sabyasachi_giri from "../../dojo_instructors/sabyasachi_giri.jpg";
import nanak_roy from "../../dojo_instructors/nanak_roy.jpg";
import raj_chatterjee from "../../dojo_instructors/Raj Chatterjee.jpeg";
import shaswata_sagar from "../../dojo_instructors/shaswata_sagar.jpeg";
import prasanta_dolui from "../../dojo_instructors/prasanta_dolui.jpg";
import basundhara_bag from "../../dojo_instructors/basundhara_bag.jpg";
import img2 from "../../thumbnail/sabyasachi1.jpg";

export default function Membership() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      navigate("/contact");
    }, 800);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDojos, setFilteredDojos] = useState([]);

  const dojoArr = [
    {
      dojoName: "Shorin Ryu Shubukan Uema dojo India",
      dojoType: "Honbu Dojo",
      instructor: ["Sensei Sabyasachi Giri"],
      image: [img2],
      contact: [
        [
          ["Phone", "9851852499"],
          ["Email", "shorinryushubukanindia@gmail.com"],
        ],
      ],
      brunch: [
        [
          {
            mainLocation: "West Bengal",
            brunchAddress: [
              "Dakshin Kumarpur, Contai, Purba Medinipur, West Bengal, India, 721401",
            ],
          },
        ],
      ],
    },
    {
      dojoName: "Fudoshin Martial Arts Academy",
      instructor: ["Dipak Kumar Maity", "Basundhara Bag"],
      image: [dipak_maity, basundhara_bag],
      contact: [[["Phone", "7478327686"]], [["Phone", "8537952108"]]],
      brunch: [
        [
          {
            mainLocation: "Purba Medinipur",
            brunchAddress: [
              "Egra Sarada Shashi Bhusan College, Egra, Purba Medinipur West Bengal",
            ],
          },
        ],
        [
          {
            mainLocation: "Purba Medinipur",
            brunchAddress: ["Kharui Kotbarh, Kharuigarh, Patashpur, 721429"],
          },
        ],
      ],
    },
    {
      dojoName: "Roy Martial Arts Academy",
      instructor: ["Nanak Roy"],
      image: [nanak_roy],
      contact: [
        [
          ["Phone", "7001564694"],
          ["Address", "Belbari, Dakshin Dinajpur, West Bengal, 733124"],
        ],
      ],
      brunch: [
        [
          {
            mainLocation: "Dakshin Dinajpur",
            brunchAddress: [
              "Nayabazar High School Moydan",
              "Gangarampur Football Club",
            ],
          },
        ],
      ],
    },
    {
      dojoName: "Shoshin Martial Arts Academy",
      instructor: ["Shaswata Sagar"],
      image: [shaswata_sagar],
      contact: [
        [
          ["Phone", "9037358074"],
          ["Email", "s.sagar111987@gmail.com"],
        ],
      ],
      brunch: [
        [
          {
            mainLocation: "Kerala",
            brunchAddress: [
              "Kadakampally Lane, Anayara, Thiruvananthapuram, Kerala",
              "Caterpillar Kinder Garten Dojo. Near Eve's cafe, Pump house junction, Anayara"
            ],
          },
        ],
      ],
    },
    {
      dojoName: "Prasen Karate Academy",
      instructor: ["Prasanta Dalui"],
      image: [prasanta_dolui],
      contact: [
        [
          ["Phone", "9007065973"],
          ["Address", "Bauria chaukashi 2 no colony, Howrah"],
        ],
      ],
      brunch: [
        [
          {
            mainLocation: "Howrah",
            brunchAddress: [
              "West Burikhali, Bauria, Howrah, West Bengal, 711310",
            ],
          },
        ],
      ],
    },
    {
      dojoName: "Karate Self Defense Academy",
      instructor: ["Raj Chatterjee"],
      image: [raj_chatterjee],
      contact: [[["Phone", "9734301071"]]],
      brunch: [
        [
          {
            mainLocation: "Hooghly",
            brunchAddress: [
              "Bengai Netaji Club Ground",
              "Goghat Debangan Nursery School Ground",
              "Patulsara Primary School Ground",
              "Badanganj Swastik Club Ground",
            ],
          },
          {
            mainLocation: "Paschim Medinipur",
            brunchAddress: ["Ramjibanpur Babulal High School Ground"],
          },
        ],
      ],
    },
  ];

  // Filter dojos based on search term
  // *******  Filter is not array based, it need to changed
  const handleSearch = () => {
    const filtered = dojoArr.filter((dojo) => {
      // Check if any branch location matches the search term
      const branchMatch = dojo.brunch.some(
        (branch) =>
          branch.mainLocation
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          branch.brunchAddress.some((address) =>
            address.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );

      // Check if any contact detail matches the search term
      const contactMatch = dojo.contact.some(
        (contact) => contact[1].toLowerCase().includes(searchTerm.toLowerCase()) // Assuming contact[1] contains the contact detail value
      );

      // Check if instructor, dojo name, branch location, branch address, or contact detail matches the search term
      return (
        dojo.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dojo.dojoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branchMatch ||
        contactMatch
      );
    });
    setFilteredDojos(filtered);
  };

  // Handle input change in the search bar
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    handleSearch();
  };

  // Handle keypress event to trigger search on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const dojoNavStyle = {
    float: "right",
    transition: "300ms",
  };
  const searchContainerStyle = {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    transition: "300ms",
    transform: "translateY(70px)",
  };

  const [searchStyle, setSearchStyle] = useState({});
  const [navStyle, setNavStyle] = useState({});
  const [containerStyle, setContainerStyle] = useState({});
  const [inputStyle, setInputStyle] = useState({
    width: "100%",
    transition: "300ms",
  });
  const [dojoListStyle, setDojoListStyle] = useState({});
  const [crossStyle, setCrossStyle] = useState({});
  const [isInput, setIsInput] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isInput) {
      setNavStyle(dojoNavStyle);
      setContainerStyle(searchContainerStyle);
      setSearchStyle({ position: "absolute" });
      setInputStyle({ width: "100%", transition: "300ms" });
      setDojoListStyle({ marginTop: "80px" });
      if (windowWidth < 340) {
        setCrossStyle({ transform: "translateY(-66px)", opacity: "1" });
      } else if (windowWidth < 430) {
        setCrossStyle({ transform: "translateY(-70px)", opacity: "1" });
      } else if (windowWidth < 500) {
        setCrossStyle({ transform: "translateY(-72px)", opacity: "1" });
      } else {
        setCrossStyle({ transform: "translateY(-72px)", opacity: "1" });
      }
    } else {
      setNavStyle({});
      setContainerStyle({});
      setSearchStyle({});
      setInputStyle({});
      setSearchTerm("");
      setDojoListStyle({});
    }
  }, [isInput, windowWidth]);

  return (
    <div className="Membership">
      <section className="Hero">
        <p className="heading">Membership</p>
        <p>
          Shubukan India accepts membership in its certain conditions and terms.
          We practice Shorin Ryu and Okinawan Kobudo. We focus on practical self
          defence and combat, Shorin Ryu shubukan is an Okinawan traditional
          karate. We accepts club district and state membership. Remember,
          training is the strongest piller of Shubukan India school. Contact us
          to join Shubukan India.
        </p>

        <p className="alert">
          ** Membership of Shubukan India abide by rules and regulation. Please
          contact us for more details.
        </p>

        <div className="contactBtn">
          {/* <NavLink to="/contact"> */}
          <button onClick={handleClick} disabled={clicked}>
            contact us
          </button>
          {/* </NavLink> */}
        </div>
      </section>

      <div className="division"></div>

      <section className="Dojo">
        <div className="dojoNav" style={navStyle}>
          <p className="heading">Dojo Index</p>

          <div className="searchContainer" style={containerStyle}>
            {isInput && (
              <input
                style={inputStyle}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
              />
            )}
            {isInput && (
              <IoClose
                className="cross"
                onClick={() => setIsInput(false)}
                style={crossStyle}
              />
            )}
            <IoSearch
              className="search"
              style={searchStyle}
              onClick={() => {
                handleSearch();
                setIsInput(true);
              }}
            />
          </div>
        </div>

        <div className="dojoList" style={dojoListStyle}>
          {(filteredDojos.length ? filteredDojos : dojoArr).map(
            (dojo, index) => (
              <div key={index} className="dojoBox">
                {dojo.dojoName && <h2 className="dojoName">{dojo.dojoName}</h2>}
                {dojo.dojoType && <p className="dojoType">{dojo.dojoType}</p>}

                {(dojo.image || dojo.contact || dojo.instructor.length !== 0) &&
                  dojo.instructor.map((instructor, index) => (
                    <div className="dojoDetail" key={index}>
                      <div className="dojoDiv">
                        <div className="imageBox">
                          {dojo.image && (
                            <img src={dojo.image[index]} alt="Dojo" />
                          )}
                        </div>

                        <div className="details">
                          {dojo.instructor.length != 0 && (
                            <div className="instructor">
                              <p className="instA">Instructor: {""}</p>
                              <p className="instB">{instructor}</p>
                            </div>
                          )}

                          {dojo.contact.length != 0 &&
                            dojo.contact[index] != undefined &&
                            dojo.contact[index].map((contact, i) => (
                              <div key={i} className="contact">
                                <p className="contA">{contact[0]}:</p>
                                <p className="contB">{contact[1]}</p>
                              </div>
                            ))}
                        </div>
                      </div>

                      {dojo.brunch.length != 0 &&
                        dojo.brunch[index].map((branch, index) => (
                          <div key={index} className="brunch">
                            {branch.mainLocation && (
                              <p className="mainLocation">
                                {branch.mainLocation}
                              </p>
                            )}

                            {branch.brunchAddress.length != 0 && (
                              <ul className="locationList">
                                {branch.brunchAddress.map((address, index) => (
                                  <li key={index} className="location">
                                    {address}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                    </div>
                  ))}

                <div className="line"></div>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
