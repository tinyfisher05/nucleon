import { useEffect, useRef, useState } from "react";
import { Link } from "umi";
import styles from "./../../../layouts/index.less";
import style from "./index.less";

import { Button, Col, Row, Radio, Divider, RadioChangeEvent,DatePicker, Space, DatePickerProps } from "antd";
import Icon, { CloseOutlined } from "@ant-design/icons";

import arrow2 from "../../../assets/arrow2.png";
import nut from "../../../assets/nut.png";
import clock1 from "../../../assets/clock1.png";
import clock2 from "../../../assets/clock2.png";

import "./../../../locales/config"; // 引用配置文件
import { useTranslation, Trans } from "react-i18next";
import {
  useStatus,
  useAccount,
  useChainId,
  useBalance,
  connect,
  Unit,
  sendTransaction,
} from "@cfxjs/use-wallet-react/ethereum";
import { ethers, utils } from "ethers";
const BigNumber = require("bignumber.js");
import axios from "axios";

const { Drip } = require("js-conflux-sdk");
const { addressPool } = require("./../../../ABI/Pools.json");
const { addressExc, abiExc } = require("./../../../ABI/ExchangeRoom.json");
const { addressNut, abiNut } = require("./../../../ABI/Nut.json");
const { formatNumber} = require("../../../utils/tools.js");

const provider = new ethers.providers.JsonRpcProvider(
  "https://evmtestnet.confluxrpc.com"
);
//币种
const nutoContract = new ethers.Contract(addressNut, abiNut, provider);
const nutoInterface = new utils.Interface(abiNut);

let myacc: any;
export default function Page() {
  myacc = useAccount();
  const [mynut, setMynut] = useState("--");
  const { t, i18n } = useTranslation();

  const [createLock, setCreateLock] = useState(false);
  const [manage, setManage] = useState(false);
  const [value, setValue] = useState(1);
  const [rewards, setRewards] = useState(false);

  const handleShowClaim = () => {
    setRewards(true);
  };
  const handleCloseClaim = () => {
    setRewards(false);
  };

  const onCreateLock = () => {
    setCreateLock(true);
  };
  const onCloseCreateLock = () => {
    setCreateLock(false);
  };

  const onManage = () => {
    setManage(true);
  };
  const onManageExistingLock = () => {
    setManage(false);
  };
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const onChangeDatePicker: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // 监听
    //window.addEventListener("resize", resizeChange);
    (async () => {
      const mynut = await nutoContract.balanceOf(myacc);
      setMynut(Drip(mynut.toString()).toCFX().toString());

    })();
  }, []);

  return (
    <div className={style.nut}>
      <div
        className={styles.inner}
        style={{ backgroundColor: "#171520", minHeight: "960px" }}
      >
        <div className={style.sub_nav2}>
          <Link to="/data/unt" style={{ color: "#EAB764" }}>
            NUT
          </Link>
          <span
            style={{
              color: "rgb(234, 183, 100)",
              padding: "5px 10px 0 0",
              fontSize: "20px",
              float: "right",
            }}
          >
            Your NUTs：{ parseFloat(mynut).toFixed(2) }
          </span>
        </div>
        <div className={style.box2}>
          <Row gutter={30}>
            <Col span={8}>
              NUTSupply
              <div className={style.box3}>$162.5</div>
            </Col>
            <Col span={8}>
              Locked NUT
              <div className={style.box3}>$162.5</div>
            </Col>
            <Col span={8}>
              % CIRC. NUT Locked
              <div className={style.box3}>0.0000894%</div>
            </Col>
            <Col span={8}>
              Avg. Lock Time (years)
              <div className={style.box3}>$162.5</div>
            </Col>
            <Col span={8}>
              Est. Yield Per week
              <div className={style.box3}>433.552.78 USDC</div>
            </Col>
            <Col span={8}>
              APR
              <div className={style.box3}>1400000%</div>
            </Col>
          </Row>
        </div>
        <div style={{ textAlign: "center", padding: "60px" }}>
          <Button
            onClick={onCreateLock}
            type="primary"
            shape="round"
            size="large"
            style={{
              background: "#EAB966",
              color: "#161621",
              border: 0,
              fontSize: "16px",
              width: "240px",
            }}
          >
            LOCK NUT
          </Button>
        </div>
        <div className={style.box2}>
          <Row style={{ padding: "10px 20px 5px" }}>
            <Col span={3}>{t("nut.NFTID")}</Col>
            <Col span={3}>{t("nut.VestAmount")}</Col>
            <Col span={3}>{t("nut.VestValue")}</Col>
            <Col span={4}>{t("nut.VestExpires")}</Col>
            <Col span={4}>{t("nut.APR")}</Col>
            <Col span={7} style={{ textAlign: "center" }}>
              Action
            </Col>
          </Row>
          <Divider
            style={{ borderTop: "1px solid #EAB966", margin: "12px 0" }}
          />
          <Row
            style={{
              padding: "5px 20px 5px",
              fontFamily: "Univa Nova Bold",
              fontSize: "20px",
            }}
          >
            <Col span={3}>401</Col>
            <Col span={3}>874.04</Col>
            <Col span={3}>109.47</Col>
            <Col span={4}>2023-05-11</Col>
            <Col span={4}>3.1%</Col>
            <Col span={7} style={{ textAlign: "right" }}>
              <Button
                onClick={onManage}
                type="primary"
                shape="round"
                size="large"
                style={{
                  background: "#161621",
                  color: "#EAB966",
                  border: 0,
                  fontSize: "16px",
                }}
              >
                {t("pools.Manage")}
              </Button>

              <Button
                onClick={handleShowClaim}
                type="primary"
                shape="round"
                size="large"
                style={{
                  background: "#161621",
                  color: "#EAB966",
                  border: 0,
                  fontSize: "16px",
                  margin: "0 0 0 5px",
                }}
              >
                {t("nut.Claim")}
              </Button>

              <Button
                type="primary"
                shape="round"
                size="large"
                style={{
                  background: "#161621",
                  color: "#EAB966",
                  border: 0,
                  fontSize: "16px",
                  margin: "0 0 0 5px",
                }}
              >
                {t("nut.Withdraw")}
              </Button>
            </Col>
          </Row>
          <Divider
            style={{ borderTop: "1px solid #EAB966", margin: "12px 0" }}
          />
          <Row
            style={{
              padding: "5px 20px 5px",
              fontFamily: "Univa Nova Bold",
              fontSize: "20px",
            }}
          >
            <Col span={3}>401</Col>
            <Col span={3}>874.04</Col>
            <Col span={3}>109.47</Col>
            <Col span={4}>2023-05-11</Col>
            <Col span={4}>3.1%</Col>
            <Col span={7} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                shape="round"
                size="large"
                style={{
                  background: "#161621",
                  color: "#EAB966",
                  border: 0,
                  fontSize: "16px",
                }}
              >
                {t("pools.Manage")}
              </Button>

              <Button
                type="primary"
                shape="round"
                size="large"
                style={{
                  background: "#161621",
                  color: "#EAB966",
                  border: 0,
                  fontSize: "16px",
                  margin: "0 0 0 5px",
                }}
              >
                {t("nut.Claim")}
              </Button>

              <Button
                type="primary"
                shape="round"
                size="large"
                style={{
                  background: "#161621",
                  color: "#EAB966",
                  border: 0,
                  fontSize: "16px",
                  margin: "0 0 0 5px",
                }}
              >
                {t("nut.Withdraw")}
              </Button>
            </Col>
          </Row>
          <div style={{ height: "7px" }}></div>
        </div>
      </div>

      <div style={{ display: rewards ? "block" : "none" }}>
        <div className="ant-modal-mask"></div>
        <div
          role="dialog"
          aria-modal="true"
          className="ant-modal ant-modal-confirm ant-modal-confirm-info"
          style={{
            zIndex: "100000",
            width: "100%",
            top: "25%",
            left: "0",
            position: "fixed",
            borderRadius: "20px",
          }}
        >
          <div
            className="ant-modal-content"
            style={{
              backgroundColor: "#393942",
              width: "40%",
              maxWidth: "40%",
              margin: "0 auto",
              borderRadius: "20px",
            }}
          >
            <div
              className="ant-modal-body"
              style={{
                backgroundColor: "#393942",
                borderRadius: "20px",
                color: "#FFFFFF",
              }}
            >
              <div className="ant-modal-confirm-body-wrapper">
                <div className="ant-modal-confirm-body">
                  <div className="disclaimer">
                    <Row className={style.modal}>
                      <Col span={12}>Rewards</Col>
                      <Col span={12}>
                        <CloseOutlined
                          onClick={handleCloseClaim}
                          style={{ float: "right", cursor: "pointer" }}
                        />
                      </Col>
                      <Col span={12} style={{ padding: "10px 0" }}>
                        Total rewards
                      </Col>
                      <Col
                        span={12}
                        style={{
                          textAlign: "right",
                          padding: "10px 0",
                          fontFamily: "Univa Nova Bold",
                        }}
                      >
                        $0.00
                      </Col>
                      <Col
                        span={24}
                        style={{ textAlign: "right", fontSize: "14px" }}
                      >
                        Unclaimed Balance
                      </Col>
                    </Row>
                  </div>
                </div>
                <div
                  className="ant-modal-confirm-btns"
                  style={{ textAlign: "center" }}
                >
                  <Button
                    block
                    type="primary"
                    style={{
                      backgroundColor: "#EAB966",
                      border: "0",
                      width: "80%",
                      margin: "0 auto",
                      fontSize: "25px",
                      height: "56px",
                      borderRadius: "28px",
                      color: "#161621",
                    }}
                  >
                    <b style={{ fontFamily: "Univa Nova Bold" }}>
                      {t("pools.Claimrewards")}
                    </b>
                  </Button>
                </div>
                <div className={style.shuom}>
                  Disclaimer: you can only claim 4 posititons (not tokens) in
                  one transaction because of wallet limitations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: manage ? "block" : "none" }}>
        <div
          className="ant-modal-mask"
          style={{ top: "0px", backgroundColor: " rgba(0, 0, 0, .9)" }}
        />
        <div
          role="dialog"
          aria-modal="true"
          className="ant-modal ant-modal-confirm ant-modal-confirm-info"
          style={{
            zIndex: "100000",
            width: "100%",
            top: "50%",
            left: "0",
            position: "absolute",
            borderRadius: "20px",
          }}
        >
          <div
            className="ant-modal-content"
            style={{
              backgroundColor: "#393942",
              width: "50%",
              maxWidth: "50%",
              margin: "0 auto",
              paddingBottom: "80px",
              boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
              borderRadius: "20px",
            }}
          >
            <div
              className="ant-modal-body"
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                borderRadius: "20px",
                color: "#FFFFFF",
                boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
              }}
            >
              <div className="ant-modal-confirm-body-wrapper">
                <div className="ant-modal-confirm-body">
                  <div className="disclaimer2">
                    <div style={{ padding: "0 0 20px" }}>
                      <img
                        alt=""
                        src={arrow2}
                        onClick={onManageExistingLock}
                        style={{
                          display: "inline-block",
                          margin: "0 10px 5px 0",
                          height: "14px",
                          cursor: "pointer",
                        }}
                      />
                      <span
                        style={{
                          cursor: "pointer",
                          margin: "0 40px",
                          color: "#EAB966",
                          fontSize: "24px",
                        }}
                      >
                        Manage Existing Lock
                      </span>
                    </div>
                    <div
                      className={style.innerbox}
                      style={{ fontSize: "18px" }}
                    >
                      <div className={style.innerbox}>
                        <div className={style.b2}>
                          <Row>
                            <Col
                              span={16}
                              style={{
                                textAlign: "left",
                                position: "relative",
                                paddingLeft: "80px",
                              }}
                            >
                              <img
                                style={{
                                  position: "absolute",
                                  left: "0",
                                  top: "0",
                                }}
                                src={nut}
                                height="53px"
                              />
                              <b style={{ fontFamily: "Univa Nova Bold" }}>
                                0.0
                              </b>
                              <div style={{ fontSize: "12px" }}>NUT</div>
                            </Col>
                            <Col span={8}>
                              {" "}
                              <span
                                style={{ color: "#979797", fontSize: "12px" }}
                              >
                                Balance: 0.00
                              </span>
                            </Col>
                          </Row>
                        </div>
                      </div>
                      <div
                        className="ant-modal-confirm-btns"
                        style={{ textAlign: "center" }}
                      >
                        <Button
                          block
                          type="primary"
                          style={{
                            backgroundColor: "#EAB966",
                            border: "0",
                            width: "80%",
                            margin: "0 auto",
                            fontSize: "25px",
                            height: "56px",
                            borderRadius: "28px",
                            color: "#161621",
                          }}
                        >
                          <b style={{ fontFamily: "Univa Nova Bold" }}>
                            Increase Lock Amount
                          </b>
                        </Button>
                      </div>
                      <div className={style.innerbox}>
                        <div className={style.b2}>
                          <Row>
                            <Col
                              span={16}
                              style={{
                                textAlign: "left",
                                position: "relative",
                                paddingLeft: "80px",
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  left: "2px",
                                  top: "0",
                                  backgroundColor: "rgba(255, 255, 255, 0.35)",
                                  padding: "10px",
                                  borderRadius: "50%",
                                  border: "1px solid #ffffff",
                                }}
                              >
                                <img
                                  style={{
                                    backgroundColor: "#EAB966",
                                    padding: "5px",
                                    borderRadius: "50%",
                                    width: "30px",
                                  }}
                                  src={clock1}
                                />
                              </div>
                              <b
                                style={{
                                  fontFamily: "Univa Nova Bold",
                                  display: "block",
                                  letterSpacing: "1px",
                                  marginTop: "10px",
                                }}
                              >
                                2023/05/18
                              </b>
                            </Col>
                            <Col span={8}>
                              <img src={clock2} height="20px" />
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "0 0 50px", color: "#EAB966 " }}>
                    Expires:
                    <Radio.Group
                      onChange={onChange}
                      value={value}
                      style={{ margin: "0 0 0 20px" }}
                    >
                      <Radio value={1}>2 week</Radio>
                      <Radio value={2}>1 month</Radio>
                      <Radio value={3}>4 years</Radio>
                    </Radio.Group>
                  </div>
                  <Row>
                    <Col span={12}>
                      Your voting power is:
                      <div style={{ fontFamily: "Univa Nova Bold" }}>
                        109.47 veNUT
                      </div>
                    </Col>
                    <Col span={12}>
                      874.05 NUT locked expires in 6 months Locked until
                      2023/05/11
                    </Col>
                  </Row>
                  <div className={style.line}></div>
                  <Row>
                    <Col span={12}>
                      Your voting power will be:
                      <div style={{ fontFamily: "Univa Nova Bold" }}>
                        109.47 veNUT
                      </div>
                    </Col>
                    <Col span={12}>
                      874.05 NUT locked expires in 6 months Locked until
                      2023/05/11
                    </Col>
                  </Row>
                  <div
                    className="ant-modal-confirm-btns"
                    style={{ textAlign: "center", padding: "40px 0 0" }}
                  >
                    <Button
                      block
                      type="primary"
                      style={{
                        backgroundColor: "#EAB966",
                        border: "0",
                        width: "80%",
                        margin: "0 auto",
                        fontSize: "25px",
                        height: "56px",
                        borderRadius: "28px",
                        color: "#161621",
                      }}
                    >
                      <b style={{ fontFamily: "Univa Nova Bold" }}>
                        Increase duration
                      </b>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: createLock ? "block" : "none" }}>
        <div
          className="ant-modal-mask"
          style={{ top: "0px", backgroundColor: " rgba(0, 0, 0, .9)" }}
        />
        <div
          role="dialog"
          aria-modal="true"
          className="ant-modal ant-modal-confirm ant-modal-confirm-info"
          style={{
            zIndex: "100000",
            width: "100%",
            top: "5%",
            left: "0",
            position: "absolute",
            borderRadius: "20px",
          }}
        >
          <div
            className="ant-modal-content"
            style={{
              backgroundColor: "#393942",
              width: "50%",
              maxWidth: "50%",
              margin: "0 auto",
              paddingBottom: "80px",
              boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
              borderRadius: "20px",
            }}
          >
            <div
              className="ant-modal-body"
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                borderRadius: "20px",
                color: "#FFFFFF",
                boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
              }}
            >
              <div className="ant-modal-confirm-body-wrapper">
                <div className="ant-modal-confirm-body">
                  <div className="disclaimer2">
                    <div style={{ padding: "0 0 20px" }}>
                      <img
                        alt=""
                        src={arrow2}
                        onClick={onCloseCreateLock}
                        style={{
                          display: "inline-block",
                          margin: "0 10px 5px 0",
                          height: "14px",
                          cursor: "pointer",
                        }}
                      />
                      <span
                        style={{
                          cursor: "pointer",
                          margin: "0 40px",
                          color: "#EAB966",
                          fontSize: "24px",
                        }}
                      >
                        Create new lock
                      </span>
                    </div>
                    <div
                      className={style.innerbox}
                      style={{ fontSize: "18px" }}
                    >
                      <div className={style.innerbox}>
                        <div className={style.b2}>
                          <Row>
                            <Col
                              span={16}
                              style={{
                                textAlign: "left",
                                position: "relative",
                                paddingLeft: "80px",
                              }}
                            >
                              <img
                                style={{
                                  position: "absolute",
                                  left: "0",
                                  top: "0",
                                }}
                                src={nut}
                                height="53px"
                              />
                              <b style={{ fontFamily: "Univa Nova Bold" }}>
                                0.0
                              </b>
                              <div style={{ fontSize: "12px" }}>NUT</div>
                            </Col>
                            <Col span={8}>
                              {" "}
                              <span
                                style={{ color: "#979797", fontSize: "12px" }}
                              >
                                Balance: 0.00
                              </span>
                            </Col>
                          </Row>
                        </div>
                      </div>

                      <div className={style.innerbox}>
                        <div className={style.b2}>
                          <Row>
                            <Col
                              span={24}
                              style={{
                                textAlign: "left",
                                position: "relative",
                                paddingLeft: "80px",
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  left: "2px",
                                  top: "0",
                                  backgroundColor: "rgba(255, 255, 255, 0.35)",
                                  padding: "10px",
                                  borderRadius: "50%",
                                  border: "1px solid #ffffff",
                                }}
                              >
                                <img
                                  style={{
                                    backgroundColor: "#EAB966",
                                    padding: "5px",
                                    borderRadius: "50%",
                                    width: "30px",
                                  }}
                                  src={clock1}
                                />
                              </div>
                              <b
                                style={{
                                  fontFamily: "Univa Nova Bold",
                                  display: "block",
                                  letterSpacing: "1px",
                                  marginTop: "5px",
                                }}
                              >
                                <DatePicker style={{width:"100%"}} suffixIcon={<img
                                  style={{
                                    width: "22px"
                                  }}
                                  src={clock2}
                                />} bordered={false} onChange={onChangeDatePicker}></DatePicker>
                              </b>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "0 0 50px", color: "#EAB966 " }}>
                    Expires:
                    <Radio.Group
                      onChange={onChange}
                      value={value}
                      style={{ margin: "0 0 0 20px" }}
                    >
                      <Radio value={1}>2 week</Radio>
                      <Radio value={2}>1 month</Radio>
                      <Radio value={3}>4 years</Radio>
                    </Radio.Group>
                  </div>
                  <Row>
                    <Col span={12}>
                      Your voting power is:
                      <div style={{ fontFamily: "Univa Nova Bold" }}>
                        109.47 veNUT
                      </div>
                    </Col>
                    <Col span={12}>
                      874.05 NUT locked expires in 6 months Locked until
                      2023/05/11
                    </Col>
                  </Row>
                  <div className={style.line}></div>
                  <div>
                    1 NUT locked for 4 years = 1.00 veNUT
                    <br />
                    1 NUT locked for 3 years = 0.75 veNUT
                    <br />
                    1 NUT locked for 2years = 0.50 veNUT
                    <br />
                    1 NUT locked for 1 years = 0.25 veNUT
                    <br />
                  </div>
                  <div
                    className="ant-modal-confirm-btns"
                    style={{ textAlign: "center", padding: "40px 0 0" }}
                  >
                    <Button
                      block
                      type="primary"
                      style={{
                        backgroundColor: "#EAB966",
                        border: "0",
                        width: "80%",
                        margin: "0 auto",
                        fontSize: "25px",
                        height: "56px",
                        borderRadius: "28px",
                        color: "#161621",
                      }}
                    >
                      <b style={{ fontFamily: "Univa Nova Bold" }}>
                        Approve NUT / Lock NUT
                      </b>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "120%",
          zIndex: "100000",
          background: "rgba(0,0,0,.76)",
          display: "block"
        }}>
          <div style={{
            width: "600px",
            margin: "260px auto",
            color: "#ccc",
            fontSize: "26px",
            maxWidth: "70%"
          }}>Let's start the journey of NUT in the near future！</div>
        </div>
    </div>
  );
}
