import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Membership.scss";
import { IoSearch } from "react-icons/io5";
import dipak_maity from "../../dojo_instructors/dipak_maity.jpeg"
import sabyasachi_giri from "../../dojo_instructors/sabyasachi_giri.jpg"
import nanak_roy from "../../dojo_instructors/nanak_roy.jpg"
import raj_chatterjee from "../../dojo_instructors/raj_chatterjee.jpg"
import shaswata_sagar from "../../dojo_instructors/shaswata_sagar.jpg"


export default function Membership() {
  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //   });
  // }, []);

  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      navigate("/contact");
    }, 800);
  };

  const dojoArr = [
    {
      dojoName: "Shorin Ryu Shubukan Uema dojo India",
      dojoType: "Honbu Dojo",
      instructor: "Sabyasachi Giri",
      image: sabyasachi_giri,
      contact: [
        ["Phone", "9851852499"],
        ["Email", "shorinryushubukanindia@gmail.com"],
      ],
      brunch: [
        {
          mainLocation: "West Bengal",
          brunchAddress: [
            "Dakshin Kumarpur, Contai, Purba Medinipur, West Bengal, India, 721401",
          ],
        },
      ],
    },
    {
      dojoName: "Fudoshin Martial Arts Academy",
      instructor: "Dipak Maity",
      image: dipak_maity,
      contact: [["Phone", "7478327686"]],
      brunch: [
        {
          mainLocation: "Purba Medinipur",
          brunchAddress: ["Egra, Purba Medinipur West Bengal"],
        },
      ],
    },
    {
      dojoName: "Roy Martial Arts Academy",
      instructor: "Nanak Roy",
      image: nanak_roy,
      contact: [
        ["Phone", "7001564694"],
        ["Address", "Belbari, Dakshin Dinajpur, West Bengal, 733124"],
      ],
      brunch: [
        {
          mainLocation: "Dakshin Dinajpur",
          brunchAddress: [
            "Nayabazar High School Moydan",
            "Gangarampur Football Club",
          ],
        },
      ],
    },
    {
      dojoName: "Karate Self Defense Academy",
      instructor: "Raj Chatterjee",
      image: raj_chatterjee,
      contact: [["Phone", "9734301071"]],
      brunch: [
        {
          mainLocation: "Paschim Medinipur",
          brunchAddress: [
            "Bengai Netaji Club Ground",
            "Goghat Debangan Nursery School Ground",
            "Patulsara Primary School Ground",
            "Badanganj Swastik Club Ground",
          ],
        },
        {
          mainLocation: "Hooghly",
          brunchAddress: ["Ramjibanpur Babulal High School Ground"],
        },
      ],
    },
    {
      dojoName: "Shoshin Martial Arts Academy",
      instructor: "Shaswata Sagar",
      image: shaswata_sagar,
      contact: [
        ["Phone", "9037358074"],
        ["Email", "s.sagar111987@gmail.com"],
      ],
      brunch: [
        {
          mainLocation: "Kerala",
          brunchAddress: [
            "Kadakampally Lane, Anayara, Thiruvananthapuram, Kerala",
          ],
        },
      ],
    },
  ];

  return (
    <div className="Membership">
      <section className="Hero">
        <h1>Membership</h1>
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
        <div className="dojoNav">
          <h1>Dojo Index</h1>
          <IoSearch className="search" />
        </div>

        <div className="dojoList">
          {dojoArr.map((dojo, index) => (
            <div key={index} className="dojoBox">
              {dojo.dojoName && <h2 className="dojoName">{dojo.dojoName}</h2>}
              {dojo.dojoType && <p className="dojoType">{dojo.dojoType}</p>}

              {(dojo.image || dojo.contact || dojo.instructor) && (
                <div className="dojoDetail">
                  <div className="imageBox">
                    {dojo.image && <img src={dojo.image} alt="Dojo" />}
                  </div>

                  <div className="details">
                    {dojo.instructor && (
                      <div className="instructor">
                        <p className="instA">Instructor: {""}</p>
                        <p className="instB">{dojo.instructor}</p>
                      </div>
                    )}

                    {dojo.contact.length != 0 &&
                      dojo.contact.map((contact, index) => (
                        <div className="contact">
                          <p className="contA" key={index}>
                            {contact[0]}: {""}
                          </p>
                          <p className="contB" key={index}>
                            {contact[1]}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {dojo.brunch.length != 0 &&
                dojo.brunch.map((branch, index) => (
                  <div key={index} className="brunch">
                    {branch.mainLocation && (
                      <p className="mainLocation">{branch.mainLocation}</p>
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

              <div className="line"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
