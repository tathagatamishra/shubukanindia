"use client";
import { useEffect, useState } from "react";
import "./LineageAndDojoKun.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";

export default function LineageAndDojoKun() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <main className="LineageAndDojoKun">
      <section className="Lineage-Hero">
        <p className="heading">Lineage</p>

        <div className="family-tree">
          <div className="top">
            <div className="top-main">
              <div className="main-box">
                <p className="name">Tuken Iekata Morinori</p>
                <p className="date">( 1624 - 1709 )</p>
                <div className="arrow">
                  <IoIosArrowDown className="label" />
                </div>
              </div>
              <div className="main-box">
                <p className="name">Sakugawa Todi</p>
                <p className="date">( 1762 - 1843 )</p>
                <div className="arrow">
                  <IoIosArrowDown className="label" />
                </div>
              </div>
              <div className="main-box">
                <p className="name">Matsumura Sokon</p>
                <p className="date">( 1809 - 1899 )</p>
                <div className="arrow">
                  <IoIosArrowDown className="label" />
                </div>
              </div>
              <div className="main-box">
                <p className="name">Itosu Yasutsune</p>
                <p className="date">( 1831 - 1915 )</p>
                <div className="arrow">
                  <IoIosArrowDown className="label" />
                </div>
              </div>
              <div className="main-box">
                <p className="name">Chibana Choshin</p>
                <p className="date">( 1885 - 1969 )</p>
                <div className="arrow">
                  <IoIosArrowDown className="label" />
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
                <p className="name">Uema Kama</p>
                <p className="date">( 1855 - 1926 )</p>
              </div>
              <div className="box-2nd">
                <p className="name">Wan Huien</p>
                <p className="date">( 1864 - ? )</p>
              </div>
              <div className="box-2nd">
                <p className="name">Kyan Chotoku</p>
                <p className="date">( 1870 - 1945 )</p>
              </div>
              <div className="box-2nd">
                <p className="name">Gusukuma Shinpan</p>
                <p className="date">( 1890 - 1954 )</p>
              </div>
              <div className="box-2nd">
                <p className="name">Uezato Chuei</p>
                <p className="date">( 1899 - 1945 )</p>
              </div>
              <div className="box-2nd">
                <p className="name">Shimabukuro taro</p>
                <p className="date">( 1905 - 1980 )</p>
              </div>
            </div>

            <div className="top-3rd">
              <div className="box-3rd">
                <div className="line">
                  <IoIosArrowBack className="label" />
                </div>
                <div className="box">
                  <p className="name">Sesoku Hideharu</p>
                  <p className="date">( 1648 - 1701 )</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mid">
            <div className="mid-box">
              <div className="box1">
                <p className="name">Uema Joki</p>
                <p className="date">( 1920 - 2011 )</p>
              </div>

              <div className="box-mid">
                <div className="box">
                  <p className="name">Nakama Chozo</p>
                  <p className="date">( 1899 - 1982 )</p>
                </div>
                <div className="lineX">
                  <IoIosArrowForward className="label" />
                </div>
                <div className="box">
                  <p className="name">Nakaya Takao</p>
                  <p className="date">( 1948 - )</p>
                </div>
              </div>

              <div className="box2">
                <p className="name">Uema Joki</p>
                <p className="date">( 1920 - 2011 )</p>
              </div>
            </div>
            <div className="mid-line">
              <div className="line1">
                <div className="lineY"></div>
                <div className="line">
                  <IoIosArrowDown className="label" />
                </div>
              </div>
              <div className="line2">
                <IoIosArrowDown className="label1" />
                <IoIosArrowDown className="label2" />
              </div>
              <div className="line3">
                <IoIosArrowDown className="label" />
              </div>
            </div>
          </div>

          <div className="bottom">
            <div className="bottom-frontline">
              <div className="bottom-underline">
                <IoIosArrowForward className="label" />
              </div>
            </div>

            <div className="bottom-box1">
              <div className="box">
                <p className="name">China Taikichi</p>
                <p className="date">( 1924 - 2003 )</p>
              </div>
              <div className="box">
                <p className="name">Ishikawa Seitoku</p>
                <p className="date">( 1925 - 2013 )</p>
              </div>
            </div>

            <div className="bottom-line">
              <div className="line-box"></div>
              <div className="line">
                <IoIosArrowForward className="label" />
              </div>
            </div>

            <div className="bottom-box2">
              <div className="box">
                <p className="name">Uema Yasuhiro</p>
                <p className="date">( 1945 - 2025 )</p>
                <div className="arrow">
                  <IoIosArrowDown className="label" />
                </div>
              </div>
              <div className="box">
                <p className="name">Uema Takeshi</p>
                <p className="date">( 1975 - )</p>
                <div className="arrow">
                  <IoIosArrowDown className="label" />
                </div>
              </div>
              <div className="box">
                <p className="name">Giri Sabyasachi</p>
                <p className="date">( 1990 - )</p>
              </div>
            </div>

            <div className="bottom-box3">
              <div className="box">
                <p className="name">Gyuris Jan</p>
                <p className="date">( 1965 - )</p>
              </div>
              <div className="line">
                <IoIosArrowBack className="label" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pattern">
        <img src="/assets/pattern.jpg" alt="" />
      </section>

      <section className="DojoKun-Hero">
        <img src="/assets/dojokun.png" alt="" />

        <p className="heading">DojoKun</p>
        <h2 className="jap">道場訓</h2>

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

        <p className="heading">Three pledges</p>
        <h2 className="jap">三誓</h2>

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
    </main>
  );
}
