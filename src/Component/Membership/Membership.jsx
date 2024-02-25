import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Membership.scss";
import { IoSearch } from "react-icons/io5";

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

  const dojoArr = [
    {
      dojoName: "Shorin Ryu Shubukan Uema dojo India",
      dojoType: "Honbu Dojo",
      instructor: "Sabyasachi Giri",
      image: "",
      contact: [
        ["Phone", "9851852499"],
        ["Email", "shorinryushubukanindia@gmail.com"],
      ],
      brunch: [
        {
          mainLocation: "",
          brunchAddress: [
            "Dakshin Kumarpur, Contai, Purba Medinipur, West Bengal, India, 721401",
          ],
        },
      ],
    },
    {
      dojoName: "Fudoshin Martial Arts Academy",
      instructor: "Dipak Maity",
      image: "",
      contact: [["Phone", "7478327686"]],
      brunch: [
        {
          mainLocation: "",
          brunchAddress: [
            "Egra, Purba Medinipur West Bengal",
          ],
        },
      ],
    },
    {
      dojoName: "Roy Martial Arts Academy",
      instructor: "Nanak Roy",
      image: "",
      contact: [["Phone", "7001564694"], ['Address', 'Belbari, Dakshin Dinajpur, West Bengal, 733124']],
      brunch: [
        {
          mainLocation: "Dakshin Dinajpur",
          brunchAddress: [
            "Nayabazar High School Moydan",
            "Gangarampur Football Club"
          ],
        },
      ],
    },
    {
      dojoName: "Karate Self Defense Academy",
      instructor: "Raj Chatterjee",
      image: "",
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
          brunchAddress: [
            "Ramjibanpur Babulal High School Ground",
          ],
        },
      ],
    },
    {
      dojoName: "Shoshin Martial Arts Academy",
      instructor: "Shaswata Sagar",
      image: "",
      contact: [
        ["Phone", "9037358074"],
        ["Email", "s.sagar111987@gmail.com"],
      ],
      brunch: [
        {
          mainLocation: "Kerala",
          brunchAddress: ['Kadakampally Lane, Anayara, Thiruvananthapuram, Kerala'],
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
              <h2>{dojo.dojoName}</h2>
              <p>Instructor: {dojo.instructor}</p>
              <p>Dojo Type: {dojo.dojoType}</p>
              <img src={dojo.image} alt="Dojo" />
              <h3>Contact:</h3>
              <ul>
                {dojo.contact.map((contact, index) => (
                  <li key={index}>
                    {contact[0]}: {contact[1]}
                  </li>
                ))}
              </ul>
              <h3>Branch:</h3>
              <ul>
                {dojo.brunch.map((branch, index) => (
                  <li key={index}>
                    <p>Main Location: {branch.mainLocation}</p>
                    <ul>
                      {branch.brunchAddress.map((address, index) => (
                        <li key={index}>{address}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <div className="line"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
