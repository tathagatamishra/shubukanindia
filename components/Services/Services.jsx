import React, { useEffect, useState } from "react";
import "./Services.scss";
import { NavLink } from "react-router-dom";

export default function Services() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="Services">
      <section className="Hero">
        <p className="heading">Services</p>
        <p>Emerge with us to find truth</p>
      </section>

      <section className="plans">
        <div className="plan-box">
          <p className="heading">Workshop</p>
          <ul>
            <li>
              <p className="title">Holistic Approach:</p>
              <p className="description">
                Comprehensive workshops covering technique, philosophy, and
                conditioning.
              </p>
            </li>
            <li>
              <p className="title">All Levels:</p>
              <p className="description">
                Inclusive workshops for beginners to advanced practitioners.
              </p>
            </li>
            <li>
              <p className="title">Cultural Insight:</p>
              <p className="description">
                Explore the history, etiquette, and cultural significance.
              </p>
            </li>
            <li>
              <p className="title">Mind-Body Connection:</p>
              <p className="description">
                Focus on meditation, breathing, and mental conditioning.
              </p>
            </li>
          </ul>
        </div>
        <div className="plan-box">
          <p className="heading">Seminar</p>
          <ul>
            <li>
              <p className="title">Expert-Led:</p>
              <p className="description">
                Learn from accomplished martial arts experts in Okinawan karate.
              </p>
            </li>
            <li>
              <p className="title">Deep Understanding:</p>
              <p className="description">
                Explore advanced techniques, philosophy, and history.
              </p>
            </li>
            <li>
              <p className="title">Interactive Q&A:</p>
              <p className="description">
                Engage with presenters, seek clarification, and connect with
                peers.
              </p>
            </li>
            <li>
              <p className="title">Skill Workshops:</p>
              <p className="description">
                Hands-on sessions for refining specific techniques.
              </p>
            </li>
          </ul>
        </div>
        <div className="plan-box">
          <p className="heading">Self Defence</p>
          <ul>
            <li>
              <p className="title">Real-world Skills:</p>
              <p className="description">
                Practical techniques for real-world self-defense situations.
              </p>
            </li>
            <li>
              <p className="title">Empowerment:</p>
              <p className="description">
                Gain confidence and awareness for personal safety.
              </p>
            </li>
            <li>
              <p className="title">Adaptive Techniques:</p>
              <p className="description">
                Suitable for all ages and physical abilities.
              </p>
            </li>
            <li>
              <p className="title">Scenario-based Training:</p>
              <p className="description">
                Simulations for effective response under pressure.
              </p>
            </li>
          </ul>
        </div>
        <div className="plan-box">
          <p className="heading">Weapon Training</p>
          <ul>
            <li>
              <p className="title">Traditional Mastery:</p>
              <p className="description">
                Expert guidance in mastering Okinawan traditional weapons.
              </p>
            </li>
            <li>
              <p className="title">Practical Application:</p>
              <p className="description">
                Learn to use weapons for self-defense with practical techniques.
              </p>
            </li>
            <li>
              <p className="title">Weapons Kata:</p>
              <p className="description">
                Explore the artistry and efficacy of traditional weapon forms.
              </p>
            </li>
            <li>
              <p className="title">Safety Priority:</p>
              <p className="description">
                Emphasize proper handling and techniques for a secure training
                environment.
              </p>
            </li>
          </ul>
        </div>
        <div className="plan-box">
          <p className="heading">Online Training</p>
          <ul>
            <li>
              <p className="title">Flexibility:</p>
              <p className="description">
                Learn from anywhere, anytime with our online platform.
              </p>
            </li>
            <li>
              <p className="title">Personalized Guidance:</p>
              <p className="description">
                Individual attention and feedback from experienced instructors.
              </p>
            </li>
            <li>
              <p className="title">Interactive Sessions:</p>
              <p className="description">
                Engage in live classes, sparring, and drills for a sense of
                community.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className="connect">
        <div className="contactBtn">
          <NavLink to="/contact">
            {/* <button>Tell us what's in your mind</button> */}
            <button>State your urge</button>
          </NavLink>
        </div>
      </section>
    </div>
  );
}
