import React from "react";
import "./LineageAndDojoKun.scss";
import { IonIcon } from "@ionic/react";
import {
  chevronDownSharp,
  chevronBackSharp,
  chevronForwardSharp,
} from "ionicons/icons";
import pattern from "../../assets/pattern.jpg";
import kun from "../../assets/dojokun.png";

export default function LineageAndDojoKun() {
  return (
    <div className="LineageAndDojoKun">
      <section className="Lineage-Hero">
        <h1>Lineage</h1>
        <p>Discovering the Way of Words</p>

        {/* <div className="arrow">
          <IonIcon icon={chevronDownSharp} className="label" />
        </div> */}

        {/* <div className="line">
          <IonIcon icon={chevronBackSharp} className="label" />
        </div> */}

        <div className="family-tree">
          <div className="top">
            <div className="top-main">
              <div className="main-box">
                <p className="name">name</p>
                <p className="date">date</p>
                <div className="arrow">
                  <IonIcon icon={chevronDownSharp} className="label" />
                </div>
              </div>
              <div className="main-box">
                <p className="name">name</p>
                <p className="date">date</p>
                <div className="arrow">
                  <IonIcon icon={chevronDownSharp} className="label" />
                </div>
              </div>
              <div className="main-box">
                <p className="name">name</p>
                <p className="date">date</p>
                <div className="arrow">
                  <IonIcon icon={chevronDownSharp} className="label" />
                </div>
              </div>
              <div className="main-box">
                <p className="name">name</p>
                <p className="date">date</p>
                <div className="arrow">
                  <IonIcon icon={chevronDownSharp} className="label" />
                </div>
              </div>
              <div className="main-box">
                <p className="name">name</p>
                <p className="date">date</p>
                <div className="arrow">
                  <IonIcon icon={chevronDownSharp} className="label" />
                </div>
              </div>
            </div>

            <div className="top-line">
              <div className="line-box"></div>
              <div className="line-box"></div>
              <div className="line-box"></div>
              <div className="line-box"></div>
              <div className="line-box"></div>
              <div className="line-box">
                <div className="line"></div>
              </div>
            </div>

            <div className="top-2nd">
              <div className="box-2nd">
                <p className="name">name</p>
                <p className="date">date</p>
              </div>
              <div className="box-2nd">
                <p className="name">name</p>
                <p className="date">date</p>
              </div>
              <div className="box-2nd">
                <p className="name">name</p>
                <p className="date">date</p>
              </div>
              <div className="box-2nd">
                <p className="name">name</p>
                <p className="date">date</p>
              </div>
              <div className="box-2nd">
                <p className="name">name</p>
                <p className="date">date</p>
              </div>
              <div className="box-2nd">
                <p className="name">name</p>
                <p className="date">date</p>
              </div>
            </div>

            <div className="top-3rd">
              <div className="box-3rd">
                <div className="line">
                <IonIcon icon={chevronBackSharp} className="label" />
                </div>
                <div className="box">
                  <p className="name">name</p>
                  <p className="date">date</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mid">
            <div className="mid-box">
              <div className="box">
                <p className="name">name</p>
                <p className="date">date</p>
                <div className="line"></div>
              </div>
              <div className="box">
                <p className="name">name</p>
                <p className="date">date</p>
                <div className="line"></div>
              </div>
            </div>
            <div className="mid-line">
              <IonIcon icon={chevronDownSharp} className="label1" />
              <IonIcon icon={chevronDownSharp} className="label2" />
            </div>
          </div>

          <div className="bottom">
            <div className="bottom-box1">
              <div className="box">
                <p className="name">name</p>
                <p className="date">date</p>
              </div>
              <div className="line">
                <IonIcon icon={chevronForwardSharp} className="label" />
              </div>
            </div>

            <div className="bottom-box2">
              <div className="box">
                <p className="name">name</p>
                <p className="date">date</p>
                <div className="arrow">
                  <IonIcon icon={chevronDownSharp} className="label" />
                </div>
              </div>
              <div className="box">
                <p className="name">name</p>
                <p className="date">date</p>
                <div className="arrow">
                  <IonIcon icon={chevronDownSharp} className="label" />
                </div>
              </div>
              <div className="box">
                <p className="name">name</p>
                <p className="date">date</p>
              </div>
            </div>

            <div className="bottom-line">
              <div className="line">
                <IonIcon icon={chevronBackSharp} className="label" />
              </div>
              <div className="line-box"></div>
            </div>

            <div className="bottom-box3">
              <div className="box">
                <p className="name">name</p>
                <p className="date">date</p>
              </div>
              <div className="box">
                <p className="name">name</p>
                <p className="date">date</p>
              </div>
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
