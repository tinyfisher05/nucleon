import { Link, Outlet } from "umi";
import styles from "./index.less";
import logo from "../assets/logo.svg";
import logotxt from "../assets/logotxt.png";

import logomp4 from "../assets/logo.mp4";
import phone from "../assets/phone.png";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import logo4 from "../assets/logo4.png";
import logo5 from "../assets/logo5.png";
import logo6 from "../assets/logo6.png";
import logo7 from "../assets/logo7.png";
import learn from "../assets/learn.png";
import menu from "../assets/menu.png";

import "antd/dist/antd.css";
import { Col, Row, Modal } from "antd";

import React, { memo, useCallback, useState } from "react";
import {
  useStatus,
  useAccount,
  useChainId,
  useBalance,
  connect,
  Unit,
  sendTransaction,
} from "@cfxjs/use-wallet-react/ethereum";

const warning = () => {
  Modal.warning({
    wrapClassName: styles.zzzz,
    bodyStyle: { backgroundColor: "#393942", color: "#ffffff" },
    content: "Fluent Or MetaMask Not Install",
  });
};

export default function Layout() {
  const status = useStatus();

  const [showMenu, setShowMenu] = useState("none");

  async function showMeun() {
    setShowMenu("block");
  }

  async function hideMeun() {
    window.scrollTo(0, 0);
    setShowMenu("none");
  }

  const WalletInfo: React.FC = memo(() => {
    const account = useAccount();
    const chainId = useChainId()!;
    const balance = useBalance()!;

    // Send 1 native token to self (connected account)
    const handleClickSendTransaction = useCallback(async () => {
      // For ts Type Guards. when status turn to 'active', account|chainId|balance must be exist.
      if (!account) return;

      // try {
      //   const TxnHash = await sendTransaction({
      //     to: account,
      //     value: Unit.fromStandardUnit("1").toHexMinUnit(),
      //   });
      //   console.log(TxnHash);
      // } catch (err) {
      //   console.error(err);
      // }
    }, [account]);

    return (
      <span onClick={handleClickSendTransaction}>
        {account?.slice(0, 7) +
          "..." +
          account?.slice(account.length - 5, account.length)}
      </span>
    );
  });

  return (
    <div>
      <div id="bg" className={[styles.container, styles.bg].join(" ")}>
        <div style={{ minHeight: "700px" }}>
          <Outlet />
        </div>
        <div className={styles.footer}>
          <div className={styles.inner}>
            <div className={styles.s1}>
              <Row style={{ padding: "50px 20px 0 10px" }}>
                <Col span={20}>
                  <Link to="/">
                    <img
                      src={logo}
                      height="32px"
                      style={{ padding: "0 10px 0 0" }}
                    />
                  </Link>
                  <img src={logotxt} height="16px" />
                  <div style={{ padding: "40px 0" }}>
                    <a
                      target={"_blank"}
                      href="https://github.com/article-i/nucleon"
                    >
                      <img src={logo4} style={{ width: "40px" }} />
                    </a>
                    <a
                      target={"_blank"}
                      href="https://twitter.com/OfficialNucleon"
                    >
                      <img src={logo3} style={{ width: "40px" }} />
                    </a>
                    <a target={"_blank"} href="https://t.me/nucleonspace">
                      <img src={logo2} style={{ width: "40px" }} />
                    </a>
                    <a
                      target={"_blank"}
                      href="https://nucleon-official.medium.com"
                    >
                      <img
                        src={logo6}
                        style={{
                          width: "32px",
                          borderRadius: "50%",
                          marginLeft: "6px",
                        }}
                      />
                    </a>
                  </div>
                  <div style={{ color: "#fff", fontSize: "22px" }}>
                    <a
                      target="_blank"
                      style={{ color: "#fff" }}
                      href={"https://github.com/article-i/nucleon-contracts-Audit"}
                    >
                      Audited by Hacken
                    </a>
                  </div>
                  <div
                    style={{
                      padding: "32px 0 0",
                      color: "#fff",
                      fontSize: "16px",
                      // textAlign: "center",
                    }}
                  >
                    © 2022-2023 Nucleon. All Rights Reserved.
                  </div>
                </Col>
                <Col span={4} style={{ display: "none" }}>
                  <div className={styles.t}>Information</div>
                  <p style={{ cursor: "pointer" }}>
                    {status !== "in-detecting" && status !== "active" && (
                      <span onClick={connect}>
                        {status === "in-activating" && "connecting..."}
                        {status === "not-installed" && "MetaMask Not Install"}
                        {status === "not-active" && "Connect Wallet"}
                      </span>
                    )}
                    {status === "active" && <WalletInfo />}
                  </p>
                  <p>
                    <Link to="/data/analytics" style={{ color: "#FFF" }}>
                      Analytics
                    </Link>
                  </p>
                  <p>Lorem ipsum</p>
                </Col>
                <Col span={4}>
                  <div className={styles.t}>Information</div>
                  <p>
                    <Link to="/" onClick={function() {
                      window.scrollTo(0, 0)
                      }} style={{ color: "#FFF" }}>
                    Home Page
                    </Link>
                  </p>
                  <p>
                    <a
                      style={{ color: "#fff" }}
                      target="_blank"
                      href="https://docs.nucleon.network/" 
                    >
                      Documentation
                    </a>
                  </p>
                  <p>
                    <a
                      style={{ color: "#fff" }}
                      target="_blank"
                      href="https://github.com/article-i/nucleon"
                    >
                      Developers
                    </a>
                  </p>
                  <p>
                    <Link to="/data/analytics" style={{ color: "#FFF" }}>
                      Analytics
                    </Link>
                  </p>
                </Col>
              </Row>
            </div>
            <div className={styles.s2}>
              <img src={logo} height="26px" />
              <img src={logotxt} height="14px" />
              <div style={{ padding: "30px 0 0 5px" }}>
                <Row>
                  <Col span={12}>
                    <div className={styles.t}>Information</div>
                    <p>
                    <Link to="/" onClick={function() {
                      window.scrollTo(0, 0)
                      }} style={{ color: "#FFF" }}>
                    Home Page
                    </Link>
                    </p>
                  </Col>
                  <Col span={12}>
                    <div style={{ paddingLeft: "40px" }}>
                      <p>
                        <a
                          style={{ color: "#fff" }}
                          target="_blank"
                          href="https://docs.nucleon.network/"
                    >
                      Documentation
                    </a>
                  </p>
                    <p>
                    <a
                      style={{ color: "#fff" }}
                      target="_blank"
                          href="https://github.com/article-i/nucleon"
                        >
                          Developers
                        </a>
                      </p>
                      <p>
                    <Link to="/data/analytics" style={{ color: "#FFF" }}>
                      Analytics
                    </Link>
                  </p>
                    </div>
                  </Col>
                </Row>
                <div style={{ padding: "10px 0 0" }}>
                  <a
                    target={"_blank"}
                    href="https://github.com/article-i/nucleon"
                  >
                    <img src={logo4} style={{ width: "40px" }} />
                  </a>
                  <a
                    target={"_blank"}
                    href="https://twitter.com/OfficialNucleon"
                  >
                    <img src={logo3} style={{ width: "40px" }} />
                  </a>
                  <a target={"_blank"} href="https://t.me/nucleonspace">
                    <img src={logo2} style={{ width: "40px" }} />
                  </a>
                  <a
                    target={"_blank"}
                    href="https://nucleon-official.medium.com"
                  >
                    <img
                      src={logo6}
                      style={{
                        width: "32px",
                        borderRadius: "50%",
                        marginLeft: "6px",
                      }}
                    />
                  </a>
                </div>
                <div style={{ color: "#fff" }}>
                  <a
                    target="_blank"
                    style={{ color: "#fff" }}
                    href={"https://github.com/article-i/nucleon-contracts-Audit"}
                  >
                    Audited by Hacken
                  </a>
                </div>
                <div>
                  <div style={{ color: "#fff" }}>
                    © 2022-2023 Nucleon. All Rights Reserved.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="spinner"
        className="spinner-box"
        style={{
          height: "100%",
          zIndex: "10000",
          background: "rgba(0,0,0,.7)",
          display: "none",
        }}
      >
        <div
          className="solar-system"
          style={{ transform: "scale(50%,50%)", height: "500px" }}
        >
          <div className="earth-orbit orbit">
            <div className="planet earth"></div>
            <div className="venus-orbit orbit">
              <div className="planet venus"></div>
              <div className="mercury-orbit orbit">
                <div className="planet mercury"></div>
                <div className="sun"></div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "fixed",
            width: "100%",
            fontSize: "22px",
            color: "#EAB966",
            top: "330px",
          }}
        >
          Waiting For Confirmation
        </div>
      </div>
    </div>
  );
}
