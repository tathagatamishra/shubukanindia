import React from "react";
import "./LineageAndDojoKun.scss";
import { IonIcon } from "@ionic/react";
import { chevronDownSharp } from "ionicons/icons";

export default function LineageAndDojoKun() {
  return (
    <div className="LineageAndDojoKun">
      <section className="Lineage-Hero">
        <h1>Lineage</h1>
        <p>Discovering the Way of Words</p>

        <div className="family-tree">
          <p className="name">Tuken iekata morinori</p>
          <p>1624 - 1709</p>
          <div><IonIcon icon={chevronDownSharp} className="label" /></div>

          <p className="name">TodiSakugawa</p>
          <p>1762 - 1843</p>
          <div><IonIcon icon={chevronDownSharp} className="label" /></div>

          <p className="name">MatsumuraSokon</p>
          <p>1809 - 1899</p>
          <div><IonIcon icon={chevronDownSharp} className="label" /></div>

          <p className="name">ItosuAnko</p>
          <p>1831 - 1915</p>
          <div><IonIcon icon={chevronDownSharp} className="label" /></div>

          <p className="name">Chibana Choshin</p>
          <p>1885 - 1969</p>
          <div><IonIcon icon={chevronDownSharp} className="label" /></div>

          <p className="name">Uema Joki</p>
          <p>1920 - 2011</p>
          <div><IonIcon icon={chevronDownSharp} className="label" /></div>

          <p className="name">Uema Yasuhiro</p>
          <p>1945 -</p>
        </div>
      </section>

      <section className="DojoKun-Hero">
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