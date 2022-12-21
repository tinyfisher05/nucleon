import { useEffect, useRef, useState } from "react";

import { Link } from "umi";
import styles from "./../../../layouts/index.less";
import style from "./index.less";

import logo7 from "../../../assets/logo7.png";
import logo8 from "../../../assets/logo8.png";
import logo9 from "../../../assets/logo9.png";
import nut from "../../../assets/nut.png";
import arrow2 from "../../../assets/arrow2.png";
import "./../../../locales/config"; // 引用配置文件
import { useTranslation, Trans } from "react-i18next";

import type { SliderMarks } from "antd/es/slider";
import { Button, Col, Row, Slider, Divider, InputNumber } from "antd";
import Icon, { CloseOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const marks: SliderMarks = {
  0: {
    style: {
      color: "#fff",
    },
    label: <strong>0%</strong>,
  },
  25: {
    style: {
      color: "#fff",
    },
    label: <strong>25%</strong>,
  },
  50: {
    style: {
      color: "#fff",
    },
    label: <strong>50%</strong>,
  },
  75: {
    style: {
      color: "#fff",
    },
    label: <strong>75%</strong>,
  },
  100: {
    style: {
      color: "#fff",
    },
    label: <strong>100%</strong>,
  },
};

// 区块链部分
import {
  useStatus,
  useAccount,
  useChainId,
  useBalance,
  connect,
  Unit,
  sendTransaction,
} from "@cfxjs/use-wallet-react/ethereum";
const BigNumber = require("bignumber.js");
import { ethers, utils } from "ethers";
const { Drip } = require("js-conflux-sdk");
const { addressNut, abiNut } = require("./../../../ABI/Nut.json");
const { addressPool, abiPool } = require("./../../../ABI/Pools.json");
const {
  addressNUT_CFX,
  addressXCFX_CFX,
  abiLP,
} = require("./../../../ABI/Lp.json");
const provider = new ethers.providers.JsonRpcProvider(
  "https://evmtestnet.confluxrpc.com"
);
const poolsContract = new ethers.Contract(addressPool, abiPool, provider);
const poolsInterface = new utils.Interface(abiPool);
//LP
const nutContract = new ethers.Contract(addressNUT_CFX, abiLP, provider);
const nutInterface = new utils.Interface(abiLP);
//LP
const xcfxContract = new ethers.Contract(addressXCFX_CFX, abiLP, provider);
const xcfxInterface = new utils.Interface(abiLP);
//币种
const nutoContract = new ethers.Contract(addressNut, abiNut, provider);
const nutoInterface = new utils.Interface(abiNut);

let myacc: any;
let timer: any;

function sleep(d){
  for(var t = Date.now;Date.now - t <= d;);
}

export default function Page() {
  const { t, i18n } = useTranslation();

  const [userOutQueue1, setUserOutQueue1] = useState([]);
  const [userOutQueue2, setUserOutQueue2] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState("none");
  const [isModalOpen2, setIsModalOpen2] = useState("none");
  const [isModalOpen3, setIsModalOpen3] = useState("none");
  const [isModalOpen4, setIsModalOpen4] = useState("none");
  const [stake, setStake] = useState(true);
  const [mynut, setMynut] = useState("--");

  const [unclaimed, setUnclaimed] = useState("");

  const [isModalOpen1Val, setIsModalOpen1Val] = useState("0"); // 货币类型 1 0
  const [isModalOpen1Val2, setIsModalOpen1Val2] = useState("0"); // 货币总数
  const [isModalOpen1Val3, setIsModalOpen1Val3] = useState("0"); // 货币默认值
  const [percentage1, setPercentage1] = useState(25);

  const [isModalOpen2Val, setIsModalOpen2Val] = useState("0"); // 货币类型 1 0
  const [isModalOpen2Val2, setIsModalOpen2Val2] = useState("0"); // 货币总数
  const [isModalOpen2Val3, setIsModalOpen2Val3] = useState("0"); // 货币默认值
  const [percentage2, setPercentage2] = useState(25);

  const [isModalOpen3Val, setIsModalOpen3Val] = useState("0"); // 货币类型 1 0
  const [isModalOpen3Val2, setIsModalOpen3Val2] = useState("0"); // 货币总数
  const [isModalOpen3Val3, setIsModalOpen3Val3] = useState("0"); // 货币默认值
  const [percentage, setPercentage] = useState(25);

  myacc = useAccount();

  const claimRewards = (i: any) => {
    return async (e: any) => {
      setIsModalOpen("block");
      setIsModalOpen1Val(i);
      const val = await poolsContract.pendingSushi(i, myacc);
      setUnclaimed(Drip(val).toCFX());
    };
  };
  const onClaimRewards = async () => {
    const data = poolsInterface.encodeFunctionData("harvest", [
      +isModalOpen1Val,
      myacc,
    ]);
    const txParams = {
      to: addressPool,
      data,
    };
    try {
      (document.getElementById("spinner") as any).style.display = "block";
      const TxnHash = await sendTransaction(txParams);
    } catch (error) {
      setIsModalOpen("none");
      (document.getElementById("spinner") as any).style.display = "none";
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      init();
      (document.getElementById("spinner") as any).style.display = "none";
      setIsModalOpen("none");
    }, 10000);
  };

  // const handleOk = () => {
  //   setIsModalOpen("none");
  // };

  //  manage handleOkStake
  const handleOkStake = async () => {
    let allowance = "";
    if (+isModalOpen1Val === 0) {
      allowance = await nutContract.allowance(myacc, addressPool);
    } else if (+isModalOpen1Val === 1) {
      allowance = await xcfxContract.allowance(myacc, addressPool);
    }
    clearTimeout(timer);
    (document.getElementById("spinner") as any).style.display = "block";
    let LPInterface: any;
    // 授权
    console.log(Drip(allowance).toCFX());
    console.log(isModalOpen1Val3);
    let time = 0;
    if (+Drip(allowance).toCFX() <= +isModalOpen1Val3) {
      // +Drip(allowance).toCFX() <= +isModalOpen1Val3
      // 对应币种合约
      if (+isModalOpen1Val === 0) {
        LPInterface = nutInterface;
      } else if (+isModalOpen1Val === 1) {
        LPInterface = xcfxInterface;
      }

      const data = LPInterface.encodeFunctionData("approve", [
        addressPool,
        Unit.fromStandardUnit(+isModalOpen1Val3 + 1).toHexMinUnit(),
      ]);

      const txParams = {
        to: +isModalOpen1Val === 0 ? addressNUT_CFX : addressXCFX_CFX,
        data,
      };
      try {
        const TxnHash = await sendTransaction(txParams);
      } catch (error) {
        setIsModalOpen2("none");
        (document.getElementById("spinner") as any).style.display = "none";
        return;
      }

      time = 5000;
    }
    clearTimeout(timer);
    (document.getElementById("spinner") as any).style.display = "block";
    var step;
    for(step=0;step<10;step++){
      if (+isModalOpen1Val === 0) {
        allowance = await nutContract.allowance(myacc, addressPool);
      } else if (+isModalOpen1Val === 1) {
        allowance = await xcfxContract.allowance(myacc, addressPool);
      }
      // 测试授权金额状态
      console.log(Drip(allowance).toCFX());
      console.log(isModalOpen1Val3);
      if (+Drip(allowance).toCFX() <= +isModalOpen1Val3) {
        sleep(5000);
      }
      else{
        break;
      }
    }
    clearTimeout(timer);
    (document.getElementById("spinner") as any).style.display = "block";
    setTimeout(async () => {
      // 执行
      const data = poolsInterface.encodeFunctionData("deposit", [
        +isModalOpen1Val,
        Unit.fromStandardUnit(isModalOpen1Val3).toHexMinUnit(),
        myacc,
      ]);
      const txParams = {
        to: addressPool,
        data,
      };
      try {
        const TxnHash = await sendTransaction(txParams);
      } catch (error) {
        setIsModalOpen2("none");
        (document.getElementById("spinner") as any).style.display = "none";
      }

      timer = setTimeout(() => {
        init();
        (document.getElementById("spinner") as any).style.display = "none";
        setIsModalOpen2("none");
      }, 10000);
    }, time);
  };
  // manage handleOkWithdraw
  const handleOkWithdraw = async () => {
    // 执行
    const data = poolsInterface.encodeFunctionData("withdraw", [
      +isModalOpen2Val,
      Unit.fromStandardUnit(isModalOpen2Val3).toHexMinUnit(),
      myacc,
    ]);
    const txParams = {
      to: addressPool,
      data,
    };

    try {
      (document.getElementById("spinner") as any).style.display = "block";
      const TxnHash = await sendTransaction(txParams);
    } catch (error) {
      setIsModalOpen2("none");
      (document.getElementById("spinner") as any).style.display = "none";
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      init();
      (document.getElementById("spinner") as any).style.display = "none";
      setIsModalOpen2("none");
    }, 10000);
  };

  const handleClose = () => {
    setIsModalOpen("none");
  };
  // 弹出
  const manage = (val: any, val2: any, val3: any) => {
    return async (e: any) => {
      // withdraw
      setIsModalOpen2("block");
      setIsModalOpen2Val(val);
      setIsModalOpen2Val2(val3);
      setPercentage2(25);
      setIsModalOpen2Val3(parseFloat((val3 * 0.25).toString()).toFixed(2));

      // stake
      setIsModalOpen1Val(val);
      setIsModalOpen1Val2(val2);
      setPercentage1(25);
      setIsModalOpen1Val3(parseFloat((val2 * 0.25).toString()).toFixed(2));

      // 显示授权额度
      let allowance = "";
      if (+isModalOpen1Val === 0) {
        allowance = await nutContract.allowance(myacc, addressPool);
      } else if (+isModalOpen1Val === 1) {
        allowance = await xcfxContract.allowance(myacc, addressPool);
      }
    };
  };
  // 选择百分比
  const dateChangeHandler1 = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setPercentage1((value / +isModalOpen1Val2) * 100);
    setIsModalOpen1Val3(value.toString());
  };
  const onChange1 = (value: number) => {
    setPercentage1(value);
    setIsModalOpen1Val3(
      parseFloat(((+isModalOpen1Val2 * +value) / 100).toString()).toFixed(2)
    );
  };
  const dateChangeHandler2 = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setPercentage2((value / +isModalOpen2Val2) * 100);
    setIsModalOpen2Val3(value.toString());
  };
  const onChange2 = (value: number) => {
    setPercentage2(value);
    setIsModalOpen2Val3(
      parseFloat(((+isModalOpen2Val2 * +value) / 100).toString()).toFixed(2)
    );
  };

  const handleClose2 = () => {
    setIsModalOpen2("none");
  };

  const handleWithdraw = () => {
    setStake(false);
  };

  // My Pools -> Stake 标签切换
  const handleStake = async () => {
    setStake(true);
  };

  // Other Pools -> Stake
  const handleStake2 = (val: any, val2: any) => {
    return (e: any) => {
      setIsModalOpen3("block");
      setIsModalOpen3Val(val);
      setIsModalOpen3Val2(val2);
      setPercentage(25);
      setIsModalOpen3Val3(parseFloat((val2 * 0.25).toString()).toFixed(2));
    };
  };
  // Other Pools -> Stake -> close
  const handleClose3 = () => {
    setIsModalOpen3("none");
  };
  // Other Pools -> Percentage
  const dateChangeHandler = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setPercentage((value / +isModalOpen3Val2) * 100);
    setIsModalOpen3Val3(value.toString());
  };
  // Other Pools -> Percentage
  const onChange = (value: number) => {
    setPercentage(value);
    setIsModalOpen3Val3(
      parseFloat(((+isModalOpen3Val2 * +value) / 100).toString()).toFixed(2)
    );
  };
  // Other Pools -> Stake -> Stake Liquidity
  const handleStakeNow = async () => {
    // 授权与否
    let allowance = "";
    if (+isModalOpen3Val === 0) {
      allowance = await nutContract.allowance(myacc, addressPool);
    } else if (+isModalOpen3Val === 1) {
      allowance = await xcfxContract.allowance(myacc, addressPool);
    }
    clearTimeout(timer);
    (document.getElementById("spinner") as any).style.display = "block";

    // 对应币种合约
    let LPInterface: any;
    console.log(Drip(allowance).toCFX());
    console.log(isModalOpen3Val3);
    let time = 0;
    if (+Drip(allowance).toCFX() <= +isModalOpen3Val3) {
      if (+isModalOpen3Val === 0) {
        LPInterface = nutInterface;
      } else if (+isModalOpen3Val === 1) {
        LPInterface = xcfxInterface;
      }

      const data = LPInterface.encodeFunctionData("approve", [
        addressPool,
        Unit.fromStandardUnit(+isModalOpen3Val3 + 1).toHexMinUnit(),
      ]);

      const txParams = {
        to: +isModalOpen3Val === 0 ? addressNUT_CFX : addressXCFX_CFX,
        data,
        //value: Unit.fromStandardUnit(0).toHexMinUnit(),
      };

      try {
        const TxnHash = await sendTransaction(txParams);
      } catch (error) {
        setIsModalOpen3("none");
        (document.getElementById("spinner") as any).style.display = "none";
        return;
      }
      time = 5000;
    }
    clearTimeout(timer);
    (document.getElementById("spinner") as any).style.display = "block";
    var step;
    for(step=0;step<10;step++){
      if (+isModalOpen1Val === 0) {
        allowance = await nutContract.allowance(myacc, addressPool);
      } else if (+isModalOpen1Val === 1) {
        allowance = await xcfxContract.allowance(myacc, addressPool);
      }
      // 测试授权金额状态
      console.log(Drip(allowance).toCFX());
      console.log(isModalOpen1Val3);
      if (+Drip(allowance).toCFX() <= +isModalOpen1Val3) {
        sleep(5000);
      }
      else{
        break;
      }
    }
    clearTimeout(timer);
    (document.getElementById("spinner") as any).style.display = "block";
    setTimeout(async () => {
      const data = poolsInterface.encodeFunctionData("deposit", [
        +isModalOpen3Val,
        Unit.fromStandardUnit(isModalOpen3Val3).toHexMinUnit(),
        myacc,
      ]);
      const txParams = {
        to: addressPool,
        data,
      };

      try {
        const TxnHash = await sendTransaction(txParams);
      } catch (error) {
        setIsModalOpen3("none");
        (document.getElementById("spinner") as any).style.display = "none";
      }
      
      timer = setTimeout(() => {
        setIsModalOpen3("none");
        (document.getElementById("spinner") as any).style.display = "none";
        init();
      }, 10000);
    }, time);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    init();
  }, []);

  async function init() {
    if (myacc) {
      const mynut = await nutoContract.balanceOf(myacc);
      setMynut(Drip(mynut.toString()).toCFX().toString());

      let tmp1: any = [];
      let tmp2: any = [];
      for (let index = 0; index < 2; index++) {
        const pools = await poolsContract.userInfo(index, myacc);
        const pendingrewards = await poolsContract.pendingSushi(index, myacc);

        // 每个lp的价值
        // nut的价值
        // 常数：sushiPerBlock
        // 此种lp的总量
        // totalAllocPoint获取一个值为Alloc总值
        // poolInfo获取三个值，取第三个值：allocPoint
        // 常数：一年的总秒数：31,536,000

        let myLiquidity = 0;
        let val = 0;
        let totalLPs = 0;
        if (index === 0) {
          val = await nutContract.totalSupply();
          myLiquidity = await nutContract.balanceOf(myacc);
          totalLPs = await poolsContract.PoolLPSum(index);
        } else {
          val = await xcfxContract.totalSupply();
          myLiquidity = await xcfxContract.balanceOf(myacc);
          totalLPs = await poolsContract.PoolLPSum(index);
        }
        totalLPs = Drip(totalLPs).toCFX();

        if (pools[0].toString() === "0") {
          tmp2.push({
            i: index,
            val: Drip(pools[0]).toCFX(),
            totalLiquidity: Drip(val).toCFX(),
            myLiquidity: Drip(myLiquidity).toCFX(),
            totalLPs: totalLPs,
          });
        } else {
          tmp1.push({
            i: index,
            val: Drip(pools[0]).toCFX(),
            totalLiquidity: Drip(val).toCFX(),
            myLiquidity: Drip(myLiquidity).toCFX(),
            totalLPs: totalLPs,
            pendingrewards: Drip(pendingrewards).toCFX(),
          });
        }
      }
      setUserOutQueue1(tmp1);
      setUserOutQueue2(tmp2);
    }
  }

  return (
    <div className={style.pools}>
      <div
        className={styles.inner}
        style={{ backgroundColor: "#171520", minHeight: "960px" }}
      >
        <div className={style.sub_nav2}>
          <Link to="/data/pools" style={{ color: "#EAB764" }}>
            {t("pools.mypools")}
          </Link>
          <span
            style={{
              color: "rgb(234, 183, 100)",
              padding: "5px 10px 0 0",
              fontSize: "20px",
              float: "right",
            }}
          >
            Your NUTs：{parseFloat(mynut).toFixed(2)}
          </span>
        </div>
        <div className={style.box2}>
          <Row style={{ padding: "10px 20px 5px" }}>
            <Col span={3}>{t("pools.PoolName")}</Col>
            <Col span={2}>{t("pools.APR")}</Col>
            <Col span={3}>{t("pools.TotalLiquidity")}</Col>
            <Col span={3}>LPs in Pool</Col>
            <Col span={3}>{t("pools.StakedLquidity")}</Col>
            <Col span={3}>{t("pools.AvailableLquidity")}</Col>
            <Col span={2}>Pending Rewards</Col>
          </Row>
          {userOutQueue1.map((item: any) => {
            return (
              <div key={item.i}>
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
                  <Col span={3}>
                    {item.i.toString() === "0" ? "NUT/CFX" : "XCFX/CFX"}
                  </Col>
                  <Col span={2}>--%</Col>
                  <Col span={3}>
                    {parseFloat(item.totalLiquidity.toString()).toFixed(2)}
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.totalLPs.toString()).toFixed(2)}
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.val.toString()).toFixed(2)}
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.myLiquidity.toString()).toFixed(2)}
                  </Col>
                  <Col span={2}>
                    {parseFloat(item.pendingrewards.toString()).toFixed(2)}
                  </Col>
                  <Col span={5} style={{ textAlign: "right" }}>
                    <Button
                      onClick={manage(
                        item.i.toString(),
                        item.myLiquidity.toString(),
                        item.val.toString()
                      )}
                      type="primary"
                      shape="round"
                      size="large"
                      style={{
                        background: "#161621",
                        color: "#EAB966",
                        border: 0,
                        fontSize: "14px",
                        marginRight: "10px",
                        width: "90px",
                      }}
                    >
                      {t("pools.Manage")}
                    </Button>
                    <Button
                      onClick={claimRewards(item.i.toString())}
                      type="primary"
                      shape="round"
                      size="large"
                      style={{
                        background: "#161621",
                        color: "#EAB966",
                        border: 0,
                        fontSize: "14px",
                        width: "140px",
                      }}
                    >
                      {t("pools.Claimrewards")}
                    </Button>
                  </Col>
                </Row>
              </div>
            );
          })}
          <Divider
            style={{ borderTop: "1px solid #EAB966", margin: "12px 0" }}
          />
          <div style={{ height: "35px" }}></div>
        </div>
        <div className={style.sub_nav2}>
          <Link to="/data/pools" style={{ color: "#FFF" }}>
            Other Pools
          </Link>
        </div>
        <div className={style.box2}>
          <Row style={{ padding: "10px 20px 5px" }}>
            <Col span={3}>{t("pools.PoolName")}</Col>
            <Col span={2}>{t("pools.APR")}</Col>
            <Col span={3}>{t("pools.TotalLiquidity")}</Col>
            <Col span={3}>LPs in Pool</Col>
            <Col span={4}>{t("pools.Myliquidity")}</Col>
          </Row>
          {userOutQueue2.map((item: any) => {
            return (
              <div key={item.i}>
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
                  <Col span={3}>
                    {item.i.toString() === "0" ? "NUT/CFX" : "XCFX/CFX"}
                  </Col>
                  <Col span={2}>--%</Col>
                  <Col span={3}>
                    {parseFloat(item.totalLiquidity.toString()).toFixed(2)}
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.totalLPs.toString()).toFixed(2)}
                  </Col>
                  <Col span={5}>
                    {parseFloat(item.myLiquidity.toString()).toFixed(2)}
                  </Col>
                  <Col span={8} style={{ textAlign: "right" }}>
                    <Button
                      onClick={handleStake2(
                        item.i.toString(),
                        item.myLiquidity.toString()
                      )}
                      type="primary"
                      shape="round"
                      size="large"
                      style={{
                        background: "#161621",
                        color: "#EAB966",
                        border: 0,
                        fontSize: "14px",
                        marginRight: "10px",
                        width: "90px",
                      }}
                    >
                      {t("pools.Stake")}
                    </Button>
                    <Button
                      type="primary"
                      shape="round"
                      size="large"
                      style={{
                        background: "#161621",
                        color: "#EAB966",
                        border: 0,
                        fontSize: "14px",
                        width: "140px",
                      }}
                      target="_blank"
                      href="https://integration.swappi.io/#/pool/v2"
                    >
                      {t("pools.AddLiquidity")}
                    </Button>
                  </Col>
                </Row>
              </div>
            );
          })}
          <Divider
            style={{ borderTop: "1px solid #EAB966", margin: "12px 0" }}
          />
          <div style={{ height: "35px" }}></div>
        </div>
        <div style={{ display: isModalOpen }}>
          <div className="ant-modal-mask"></div>
          <div
            role="dialog"
            aria-modal="true"
            className="ant-modal ant-modal-confirm ant-modal-confirm-info"
            style={{
              zIndex: "100000",
              width: "100%",
              top: "25%",
              left: "50%",
              right: "50%",
              transform: "translate(-50%, 0)",
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
                            style={{ float: "right", cursor: "pointer" }}
                            onClick={handleClose}
                          />
                        </Col>
                        <Col span={12} style={{ padding: "10px 0" }}>
                          Total Rewards
                        </Col>
                        <Col
                          span={12}
                          style={{
                            textAlign: "right",
                            padding: "10px 0",
                            fontFamily: "Univa Nova Bold",
                          }}
                        >
                          {parseFloat(unclaimed).toFixed(2)} NUT
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
                      onClick={onClaimRewards}
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
                  <div className={style.shuom}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: isModalOpen2 }}>
          <div
            className="ant-modal-mask"
            style={{ top: "0px", backgroundColor: " rgba(23, 21, 32, 1)" }}
          ></div>
          <div
            role="dialog"
            aria-modal="true"
            className="ant-modal ant-modal-confirm ant-modal-confirm-info"
            style={{
              zIndex: "100000",
              width: "100%",
              top: "1%",
              left: "50%",
              right: "50%",
              transform: "translate(-50%, 0)",
              position: "fixed",
              borderRadius: "20px",
            }}
          >
            <div
              className="ant-modal-content"
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                width: "50%",
                maxWidth: "50%",
                margin: "0 auto",
                boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
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
                    <div
                      className="disclaimer2"
                      style={{
                        fontSize: "24px",
                        display: stake === true ? "block" : "none",
                      }}
                    >
                      <img
                        alt=""
                        src={arrow2}
                        onClick={handleClose2}
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
                          textShadow: "1px 2px 13px #EAB966",
                        }}
                        onClick={handleStake}
                      >
                        Stake
                      </span>{" "}
                      <span
                        onClick={handleWithdraw}
                        style={{ cursor: "pointer" }}
                      >
                        Withdraw
                      </span>
                      <div
                        className={style.innerbox}
                        style={{ fontSize: "18px" }}
                      >
                        <span style={{ color: "#979797", fontSize: "17px" }}>
                          Selected Pool:
                        </span>{" "}
                        CFX-{isModalOpen2Val === "1" ? "xCFX" : "NUT"}
                        <Button
                          type="primary"
                          shape="round"
                          size="large"
                          style={{
                            background: "#161621",
                            color: "#EAB966",
                            border: 0,
                            fontSize: "16px",
                            marginRight: "10px",
                            marginTop: "-5px",
                            float: "right",
                          }}
                          target="_blank"
                          href="https://integration.swappi.io/#/pool/v2"
                        >
                          Get LPs
                        </Button>
                      </div>
                      <div className={style.innerbox}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <div className={style.b1}>
                              <img
                                style={{
                                  float: "left",
                                  margin: "3px 20px 0 10px",
                                }}
                                src={logo7}
                                height="50px"
                              />
                              <img
                                style={{
                                  position: "absolute",
                                  left: "46px",
                                  top: "15px",
                                  display:
                                    isModalOpen1Val === "0" ? "none" : "block",
                                }}
                                src={logo8}
                                height="50px"
                              />
                              <img
                                style={{
                                  position: "absolute",
                                  left: "46px",
                                  top: "20px",
                                  display:
                                    isModalOpen1Val === "1" ? "none" : "block",
                                }}
                                src={nut}
                                height="43px"
                              />
                              <div
                                style={{
                                  float: "left",
                                  margin: " 0 0 0 10px",
                                }}
                              >
                                <div>
                                  CFX/
                                  {isModalOpen1Val === "1" ? "xCFX" : "NUT"}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  Price: $2.67
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className={style.b2}>
                              <div>
                                <InputNumber
                                  min={0}
                                  max={+parseFloat(isModalOpen1Val2).toFixed(2)}
                                  step={0.01}
                                  placeholder="0"
                                  onChange={dateChangeHandler1}
                                  value={
                                    +parseFloat(isModalOpen1Val3).toFixed(2)
                                  }
                                />
                              </div>
                              <div style={{ fontSize: "14px" }}>$0.00</div>
                            </div>
                            <div
                              style={{
                                textAlign: "left",
                                padding: "5px 0",
                                fontSize: "12px",
                              }}
                            >
                              In Wallet:{" "}
                              {parseFloat(isModalOpen1Val2).toFixed(2)}
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className={style.innerbox}>
                        <Slider
                          className={style.slider}
                          marks={marks}
                          onChange={onChange1}
                          value={percentage1}
                        />
                      </div>
                      <div className={style.innerbox}>
                        <Row
                          style={{
                            textAlign: "center",
                            color: "#EAB966",
                            fontSize: "18px",
                          }}
                        >
                          <Col span={8}>
                            <div
                              style={{ color: "#ffffff", fontWeight: "bold" }}
                            >
                              --
                            </div>
                            My Liquility
                          </Col>
                          <Col span={8}>
                            <div style={{ color: "#ffffff" }}>--</div>
                            Share Of Pool
                          </Col>
                          <Col span={8}>
                            <div style={{ color: "#ffffff" }}>--%</div>APR
                          </Col>
                        </Row>
                      </div>
                    </div>

                    <div
                      className="disclaimer2"
                      style={{
                        fontSize: "24px",
                        display: stake === true ? "none" : "block",
                      }}
                    >
                      <img
                        alt=""
                        src={arrow2}
                        onClick={handleClose2}
                        style={{
                          display: "inline-block",
                          margin: "0 10px 5px 0",
                          height: "14px",
                          cursor: "pointer",
                        }}
                      />
                      <span
                        style={{ cursor: "pointer", margin: "0 40px" }}
                        onClick={handleStake}
                      >
                        Stake
                      </span>{" "}
                      <span
                        onClick={handleWithdraw}
                        style={{
                          cursor: "pointer",
                          color: "#EAB966",
                          textShadow: "1px 2px 13px #EAB966",
                        }}
                      >
                        Withdraw
                      </span>
                      <div
                        className={style.innerbox}
                        style={{ fontSize: "18px" }}
                      >
                        <span style={{ color: "#979797", fontSize: "17px" }}>
                          Selected Pool:
                        </span>{" "}
                        CFX-{isModalOpen2Val === "1" ? "xCFX" : "NUT"}
                      </div>
                      <div className={style.innerbox}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <div className={style.b1}>
                              <img
                                style={{
                                  float: "left",
                                  margin: "3px 20px 0 10px",
                                }}
                                src={logo7}
                                height="50px"
                              />
                              <img
                                style={{
                                  position: "absolute",
                                  left: "46px",
                                  top: "15px",
                                  display:
                                    isModalOpen2Val === "0" ? "none" : "block",
                                }}
                                src={logo8}
                                height="50px"
                              />
                              <img
                                style={{
                                  position: "absolute",
                                  left: "46px",
                                  top: "20px",
                                  display:
                                    isModalOpen2Val === "1" ? "none" : "block",
                                }}
                                src={nut}
                                height="43px"
                              />
                              <div
                                style={{
                                  float: "left",
                                  margin: " 0 0 0 10px",
                                }}
                              >
                                <div>
                                  CFX/
                                  {isModalOpen2Val === "1" ? "xCFX" : "NUT"}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  Price: $2.67
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className={style.b2}>
                              <div>
                                <InputNumber
                                  min={0}
                                  max={+parseFloat(isModalOpen2Val2).toFixed(2)}
                                  step={0.01}
                                  placeholder="0"
                                  onChange={dateChangeHandler2}
                                  value={
                                    +parseFloat(isModalOpen2Val3).toFixed(2)
                                  }
                                />
                              </div>
                              <div style={{ fontSize: "14px" }}>$0.00</div>
                            </div>
                            <div
                              style={{
                                textAlign: "left",
                                padding: "5px 0",
                                fontSize: "12px",
                              }}
                            >
                              In Pool: {parseFloat(isModalOpen2Val2).toFixed(2)}
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className={style.innerbox}>
                        <Slider
                          className={style.slider}
                          marks={marks}
                          onChange={onChange2}
                          value={percentage2}
                        />
                      </div>
                      <div className={style.innerbox}>
                        <Row
                          style={{
                            textAlign: "center",
                            color: "#EAB966",
                            fontSize: "18px",
                          }}
                        >
                          <Col span={8}>
                            <div
                              style={{ color: "#ffffff", fontWeight: "bold" }}
                            >
                              --
                            </div>
                            My Liquility
                          </Col>
                          <Col span={8}>
                            <div style={{ color: "#ffffff" }}>--</div>
                            Share Of Pool
                          </Col>
                          <Col span={8}>
                            <div style={{ color: "#ffffff" }}>--%</div>APR
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                  <div
                    className="ant-modal-confirm-btns"
                    style={{ textAlign: "center" }}
                  >
                    <Button
                      onClick={handleOkWithdraw}
                      block
                      type="primary"
                      style={{
                        display: stake === true ? "none" : "block",
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
                        {t("pools.WithdrawLiquidity")}
                      </b>
                    </Button>
                    <Button
                      onClick={handleOkStake}
                      block
                      type="primary"
                      style={{
                        display: stake === true ? "block" : "none",
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
                        {t("pools.StakeLiquidity")}
                      </b>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: isModalOpen3 }}>
          <div
            className="ant-modal-mask"
            style={{ top: "0px", backgroundColor: " rgba(23, 21, 32, 1)" }}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="ant-modal ant-modal-confirm ant-modal-confirm-info"
            style={{
              zIndex: "100000",
              width: "100%",
              top: "1%",
              left: "50%",
              right: "50%",
              transform: "translate(-50%, 0)",
              position: "fixed",
              borderRadius: "20px",
            }}
          >
            <div
              className="ant-modal-content"
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                width: "50%",
                maxWidth: "50%",
                margin: "0 auto",
                boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
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
                    <div
                      className="disclaimer2"
                      style={{
                        fontSize: "24px",
                        display: "block"
                      }}
                    >
                      <img
                        alt=""
                        src={arrow2}
                        onClick={handleClose3}
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
                        }}
                      >
                        Stake
                      </span>
                      <div
                        className={style.innerbox}
                        style={{ fontSize: "18px" }}
                      >
                        <span style={{ color: "#979797", fontSize: "17px" }}>
                          Selected Pool:
                        </span>{" "}
                        CFX-{isModalOpen3Val === "1" ? "xCFX" : "NUT"}
                      </div>
                      <div className={style.innerbox}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <div className={style.b1}>
                              <img
                                style={{
                                  float: "left",
                                  margin: "3px 20px 0 10px",
                                }}
                                src={logo7}
                                height="50px"
                              />
                              <img
                                style={{
                                  position: "absolute",
                                  left: "46px",
                                  top: "15px",
                                  display:
                                    isModalOpen3Val === "0" ? "none" : "block",
                                }}
                                src={logo8}
                                height="50px"
                              />
                              <img
                                style={{
                                  position: "absolute",
                                  left: "46px",
                                  top: "20px",
                                  display:
                                    isModalOpen3Val === "1" ? "none" : "block",
                                }}
                                src={nut}
                                height="43px"
                              />
                              <div
                                style={{
                                  float: "left",
                                  margin: " 0 0 0 10px",
                                }}
                              >
                                <div>
                                  CFX/
                                  {isModalOpen3Val === "1" ? "xCFX" : "NUT"}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  Price: $2.67
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className={style.b2}>
                              <div>
                                <InputNumber
                                  min={0}
                                  max={+parseFloat(isModalOpen3Val2).toFixed(2)}
                                  step={0.01}
                                  placeholder="0"
                                  onChange={dateChangeHandler}
                                  value={
                                    +parseFloat(isModalOpen3Val3).toFixed(2)
                                  }
                                />
                              </div>
                              <div style={{ fontSize: "14px" }}>$0.00</div>
                            </div>
                            <div
                              style={{
                                textAlign: "left",
                                padding: "5px 0",
                                fontSize: "12px",
                              }}
                            >
                              In Wallet:{" "}
                              {parseFloat(isModalOpen3Val2).toFixed(2)}
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className={style.innerbox}>
                        <Slider
                          className={style.slider}
                          marks={marks}
                          onChange={onChange}
                          value={percentage}
                        />
                      </div>
                      <div className={style.innerbox}>
                        <Row
                          style={{
                            textAlign: "center",
                            color: "#EAB966",
                            fontSize: "18px",
                          }}
                        >
                          <Col span={8}>
                            <div
                              style={{ color: "#ffffff", fontWeight: "bold" }}
                            >
                              --
                            </div>
                            My Liquility
                          </Col>
                          <Col span={8}>
                            <div style={{ color: "#ffffff" }}>--</div>
                            Share Of Pool
                          </Col>
                          <Col span={8}>
                            <div style={{ color: "#ffffff" }}>--%</div>APR
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                  <div
                    className="ant-modal-confirm-btns"
                    style={{ textAlign: "center" }}
                  >
                    <Button
                      onClick={handleStakeNow}
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
                        {t("pools.StakeLiquidity")}
                      </b>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
