import React from "react";
import "./LineageAndDojoKun.scss";
import { IonIcon } from "@ionic/react";
import { chevronDownSharp } from "ionicons/icons";
import pattern from "../../assets/pattern.jpg";
import kun from "../../assets/dojokun.png";

export default function LineageAndDojoKun() {
  return (
    <div className="LineageAndDojoKun">
      <section className="Lineage-Hero">
        <h1>Lineage</h1>
        <p>Discovering the Way of Words</p>

        <div className="family-tree">
          <div className="tree-box">
            <div className="box">
              <p className="name">Tuken iekata morinori</p>
              <p className="date">1624 - 1709</p>
              <div className="arrow">
                <IonIcon icon={chevronDownSharp} className="label" />
              </div>
            </div>

            <div className="box">
              <p className="name">Todi Sakugawa</p>
              <p className="date">1762 - 1843</p>
              <div className="arrow">
                <IonIcon icon={chevronDownSharp} className="label" />
              </div>
            </div>

            <div className="box">
              <p className="name">Matsumura Sokon</p>
              <p className="date">1809 - 1899</p>
              <div className="arrow">
                <IonIcon icon={chevronDownSharp} className="label" />
              </div>
            </div>

            <div className="box">
              <p className="name">Itosu Anko</p>
              <p className="date">1831 - 1915</p>
              <div className="arrow">
                <IonIcon icon={chevronDownSharp} className="label" />
              </div>
            </div>

            <div className="box">
              <p className="name">Chibana Choshin</p>
              <p className="date">1885 - 1969</p>
              <div className="arrow">
                <IonIcon icon={chevronDownSharp} className="label" />
              </div>
            </div>

            <div className="box">
              <p className="name">Uema Joki</p>
              <p className="date">1920 - 2011</p>
              <div className="arrow">
                <IonIcon icon={chevronDownSharp} className="label" />
              </div>
            </div>

            <div className="box">
              <p className="name">Uema Yasuhiro</p>
              <p className="date">1945 -</p>
              <div className="arrow">
                <IonIcon icon={chevronDownSharp} className="label" />
              </div>
            </div>

            <div className="box">
              <p className="name">Uema Takeshi</p>
              <p className="date">1975 -</p>
              <div className="arrow">
                <IonIcon icon={chevronDownSharp} className="label" />
              </div>
            </div>

            <div className="box">
              <p className="name">Giri Sabyasachi</p>
              <p className="date">1990 -</p>
            </div>
          </div>

          <div className="tree-box">
            <div className="box">
              
            </div>

            <div className="box">
              
            </div>

            <div className="box">
             
            </div>

            <div className="box">
              
            </div>

            <div className="box">
              
            </div>

            <div className="box">

            </div>

            <div className="box">

            </div>

            <div className="box">

            </div>

            <div className="box">

            </div>
          </div>
        </div>
      </section>

      <section className="pattern">
        <img src={pattern} alt="" />
      </section>

      <section className="DojoKun-Hero">
        <img src={kun} alt="" />

        <h1>DojoKun</h1>
        <h2>道場訓</h2>

        <ul>
          <li>
            {/* 一、人格完成に努めること  */}
            Strive to complete your character.
          </li>
          <li>
            {/* 一誠の道を守ること  */}
            Protect the way of the truth.
          </li>
          <li>
            {/* 一、 努力の精神を養うこと  */}
            Foster a spirit of effort.
          </li>
          <li>
            {/* 礼儀を重んずること  */}
            Respect others and the principles of etiquette.
          </li>
          <li>
            {/* 一、 血気の勇をること */}
            Refrain from violent behavior.
          </li>
        </ul>

        <h1>Three pledges</h1>
        <h2>三誓</h2>

        <ul>
          <li>
            {/* 空手は礼に始まり礼に終る */}
            Karate begins and ends with courtesy and respect.
          </li>
          <li>
            {/* 意地が出たら手を引け手が出たら意地を引け  */}
            When your anger goes out withdraw your hand, when your hand goes out
            withdraw your anger.
          </li>
          <li>
            {/* 空手は湯の如し熱を与えねば水に変る */}
            Karate is like hot water, if you do not give it heat constantly, it
            will again become cold water.
          </li>
        </ul>
      </section>
    </div>
  );
}
