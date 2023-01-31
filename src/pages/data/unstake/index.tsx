import { useEffect, useCallback, useState, memo } from "react";
// import React from "react";
import { Helmet } from "react-helmet";
import * as echarts from "echarts";
var moment = require("moment");
import waitTransactionReceipt from './../../../utils/waitTranscationReceipt'; 
import { Link } from "umi";
import styles from "./../../../layouts/index.less";
import style from "./index.less";

import logo from "../../../assets/logo.svg";
import logotxt from "../../../assets/logotxt.svg";
import logo8 from "../../../assets/logo8.png";
import arrow from "../../../assets/arrow.png";
import yuan from "../../../assets/yuan.png";
import { Button, Col, Row, Divider, Input} from "antd";

import "./../../../locales/config"; // 引用配置文件
import { useTranslation, Trans } from "react-i18next";

import axios from "axios";

// 区块链引用部分
import {
  useStatus,
  useAccount,
  useChainId,
  useBalance,
  connect,
  Unit,
  sendTransaction,
  watchAsset,
  switchChain,
  addChain
} from "@cfxjs/use-wallet-react/ethereum";
const BigNumber = require("bignumber.js");
import { ethers, utils } from "ethers";
const { Drip } = require("js-conflux-sdk");
const { addressExc, abiExc } = require("./../../../ABI/ExchangeRoom.json");
const { addressXcfx, abiXcfx } = require("./../../../ABI/Xcfx.json");
const { addressNut, abiNut } = require("./../../../ABI/Nut.json");
const { formatNumber} = require("../../../utils/tools.js");

const domain = "https://api.nucleon.network";
function getStatistics(cond: string, limit = 24): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        axios.get(
          domain +
            "/api/v1/statistics?condition=" +
            cond +
            "&offset=0&limit=" +
            limit
        )
      );
    }, 1000);
  });
}

let myacc: any;
export default function Page() {
  myacc = useAccount();
  const [mynut, setMynut] = useState("--");
  const { t, i18n } = useTranslation();

  const [staketotal, setStaketotal] = useState("00.00");
  const [exchangeRate, setExchangeRate] = useState("00.0000");
  const [burnVal, setBurnVal] = useState("");
  const [xcfxVal, setXcfxVal] = useState("");
  const [balancevalue, setBalancevalue] = useState("");
  const [xcfxAmount, setXcfxAmount] = useState("00.00");
  const [xcfxAmountTotal, setXcfxAmountTotal] = useState("00.0000");
  const [shareofthePool, setShareofthePool] = useState("--");
  const [cfxapy, setCfxapy] = useState("--");
  const [totalStaked, setTotalStaked] = useState("--");
  const [holder, setHolder] = useState("--");
  const [price, setPrice] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [unlocking, setUnlocking] = useState(0);
  const [period, setPeriod] = useState(0);
  const [blockNumber, setBlockNumber] = useState(0);
  const [finialUnlockTime, setFinialUnlockTime] = useState(0);

  const [userOutQueue, setUserOutQueue] = useState([]);
  let xCFXToken = {
    address: "0x092690013ef7aF87eaf45030906baa86b8fAA411", // The address of the token contract
    symbol: "xCFX", // A ticker symbol or shorthand, up to 5 characters
    decimals: 18, // The number of token decimals
    image: "https://integration.swappi.io/static/media/0x092690013ef7aF87eaf45030906baa86b8fAA411.a0ecb3fe.png", // A string url of the token logo
  };
  const provider = new ethers.providers.JsonRpcProvider(
    "https://evmtestnet.confluxrpc.com"
  );
  const excContract = new ethers.Contract(addressExc, abiExc, provider);
  const excinterface = new utils.Interface(abiExc);
  const xcfxContract = new ethers.Contract(addressXcfx, abiXcfx, provider);
  //币种
  const nutoContract = new ethers.Contract(addressNut, abiNut, provider);
  const nutoInterface = new utils.Interface(abiNut);
  const [tranHash, setTranHash] = useState("");
  const [operation, setOperation] = useState("Details:");
  const [tokenUsed, setTokenUsed] = useState("xCFX");
  // web3 钱包登录
  const WalletInfo: React.FC = memo(() => {
    const account = useAccount();
    const chainId = useChainId()!;
    const balance = useBalance()!;

    //const balanceT = balance?.toDecimalStandardUnit();
    //setStaketotal(balanceT);
    //init(balanceT);

    const handleClickSendTransaction = useCallback(async () => {
      if (!account) return;
      setTimeout(() => {
        init();
        // 加载隐藏
        (document.getElementById("spinner") as any).style.display = "none";
      }, 2000);
    }, [account]);
    return (
      <div onClick={handleClickSendTransaction}>
        {account?.slice(0, 7) +
          "..." +
          account?.slice(account.length - 5, account.length)}
      </div>
    );
  });

  // Function 切换网络--------------------------------------------
function reloadPage() {
  setTimeout(function () {
      location.reload();
  }, 100)
}
const onSwitchNetwork = async () => {
  try {
    await switchChain("0x47"); // 切换网络
    reloadPage();
  } catch (error) {
    const AddChainParameter = {
      chainId: "0x47", // A 0x-prefixed hexadecimal string   0x47   0x406
      chainName: "conflux espace testnet",
      nativeCurrency: {
        name: "CFX",
        symbol: "CFX", // 2-6 characters long
        decimals: 18,
      },
      rpcUrls: ["https://evmtestnet.confluxrpc.com"], // https://evmtestnet.confluxrpc.com  https://evm.confluxrpc.com
      //blockExplorerUrls: ['aaaa'],
      //iconUrls: ['https://'], // Currently ignored.
    };
    await addChain(AddChainParameter); // 添加网络
    reloadPage();
  }
};

// if (chainId != "71") {onSwitchNetwork()}

  const MyModal: React.FC = memo(() => {
    function closeCurr() {
      setTranHash("");
    }
    async function  onToken() {
      const watchAssetParams = {
        type: "ERC20", // In the future, other standards will be supported
        options: xCFXToken
      };
      try{
        (document.getElementById("spinner") as any).style.display = "block";
        await watchAsset(watchAssetParams); // 添加网络
      } catch (error) {
        setIsModalOpen2("none");
        (document.getElementById("spinner") as any).style.display = "none";
      }
      (document.getElementById("spinner") as any).style.display = "none";
    }
    return (
      <div
        className="ant-modal-content"
        style={{
          display: tranHash === "" ? "none" : "block",
          width: "400px",
          position: "fixed",
          left: "50%",
          marginLeft: "-200px",
          top: "300px",
          zIndex: "10000000",
          borderRadius: "10px",
          backgroundColor:"#393942"
        }}
      >
        <div className="ant-modal-body">
          <div className="ant-modal-confirm-body-wrapper">
            <div className="ant-modal-confirm-body">
              <div style={{ color: "#000", textAlign: "left" }}>
                <h5 style={{fontSize:"16px", fontWeight: "blod",color:"#fff"}}>{operation}</h5>
                <span
                  role="img"
                  aria-label="check-circle"
                  className="anticon anticon-check-circle"
                >
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="check-circle"
                    width="30px"
                    height="30px"
                    fill="currentColor"
                    aria-hidden="true"
                    style={{color:"rgb(234, 185, 102)"}}
                  >
                    <path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"></path>
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                  </svg>
                </span>
              </div>
              <div
                className="ant-modal-confirm-content"
                style={{ color: "#fff" }}
              >
                Hash: <a target="_blank" style={{ color: "#fff" }} href={'https://evmtestnet.confluxscan.io/tx/' + tranHash}>{tranHash}</a>
              </div>
            </div>

          </div>
        </div>
        <div
          className="ant-modal-confirm-btns"
          style={{ textAlign: "right", margin: "30px 0" }}
        >
          <button
            type="button"
            className="ant-btn ant-btn-primary"
            style={{
              background: "rgb(234, 185, 102)",
              borderColor: "rgb(234, 185, 102)",
              float: "left",
              width: "250px",
            }}
            onClick={onToken}
          >
            <span>Add {tokenUsed} to Metamask</span>
          </button>
          <div
            style={{
              height: "62px",
              width: "62px",
              borderRadius: "50%",
              position: "absolute",
              zIndex: "100",
              backgroundColor: "#fff",
              padding: "4px",
              right: "100px",
              bottom: "15px",
              overflow: "hidden",
            }}
          >
            <img
              className={styles.coin2}
              src={yuan}
              style={{
                marginTop: "3px",
                height: "90%",
                width: "100%",
              }}
            />
          </div>
          <button
            type="button"
            className="ant-btn ant-btn-primary"
            style={{
              background: "rgb(234, 185, 102)",
              borderColor: "rgb(234, 185, 102)",
              width: "150px",
            }}
            onClick={closeCurr}
          >
            <span style={{padding:"0 0 0 30px"}}>OK</span>
          </button>
        </div>
      </div>
    );
  });

  const UnStakeButton: React.FC = memo(() => {
    const account = useAccount();
    const chainId = useChainId()!;
    const handleClickSendTransaction = useCallback(async () => {
      if (!account) return;
      if (!burnVal) return;

      const data = excinterface.encodeFunctionData("XCFX_burn", [
        Unit.fromStandardUnit(burnVal).toHexMinUnit(),
      ]);
      if (chainId != "71") {
        onSwitchNetwork();
        alert('  You have used the wrong network.\r\n  Now we will switch to the Conflux Espace test network!');//switch
        return;
      }
      (document.getElementById("spinner") as any).style.display = "block";
      try {
        const TxnHash = await sendTransaction({
          to: addressExc,
          data,
          //value: Unit.fromStandardUnit(1).toHexMinUnit(),
        });
      const txReceipt = await waitTransactionReceipt(TxnHash);//cfx_back, speedMode
      console.log("BBB",TxnHash);
      console.log(txReceipt);
      if(period ===0){
        setOperation("Details: "+burnVal+ "xCFX Unstaked; "
                    + Drip(Unit.fromStandardUnit(txReceipt.logs[1].data).toDecimalStandardUnit()).toCFX()
                    +" CFX will unfreeze after about "
                    +"16 days.")
      }else{
        setOperation("Details: "+burnVal+ "xCFX Unstaked; "
                    + Drip(Unit.fromStandardUnit(txReceipt.logs[1].data).toDecimalStandardUnit()).toCFX()
                    +" CFX will unfreeze after about "
                    +period +"48 hours.")
      }
      
      setTimeout(setTranHash(TxnHash),3690);
      } 
      catch (error) {
        (document.getElementById("spinner") as any).style.display = "none";
      }
      setTimeout(() => {
        init();
        // 加载隐藏
        (document.getElementById("spinner") as any).style.display = "none";
      }, 10000);
    }, [account]);
    return (
      <Button
        onClick={handleClickSendTransaction}
        style={{
          background: "#161621",
          border: "0",
          marginTop: "22px",
          color: "#E29346",
        }}
        shape={"round"}
        size={"large"}
        block
        ghost
        className={style.stake_btn}
      >
        Unstake
      </Button>
    );
  });

  const ClaimButton: React.FC = memo(() => {
    const account = useAccount();
    const chainId = useChainId()!;
    const balance = useBalance()!;

    const handleClickSendTransaction = useCallback(async () => {
      if (!account) return;
      if (unlocked <= 0) return;
      if (chainId != "71") {
        onSwitchNetwork();
        alert('  You have used the wrong network.\r\n  Now we will switch to the Conflux Espace test network!');//switch
        return;
      }

      const data = excinterface.encodeFunctionData("getback_CFX", [
        Unit.fromStandardUnit(unlocked).toHexMinUnit(),
      ]);
      try {
      (document.getElementById("spinner") as any).style.display = "block";
      const TxnHash = await sendTransaction({
        to: addressExc,
        data,
      });
      
      // const txReceipt = await waitTransactionReceipt(txnHash);//cfx_back, speedMode
      console.log("CCC",TxnHash);
      setOperation("Details: "+unlocked+" CFX will be Transferred to your address.")
      setTimeout(setTranHash(TxnHash),3690);
      setTimeout(() => {
        init();
        // 加载隐藏
        (document.getElementById("spinner") as any).style.display = "none";
      }, 10000);
      }
      catch (error) {
        (document.getElementById("spinner") as any).style.display = "none";
      }
    }, [account]);
    return (
      <Button
        onClick={handleClickSendTransaction}
        className={style.unstake_btn}
        type="primary"
        shape="round"
        size="large"
        style={{
          background: "rgb(226, 147, 70)",
          color: "#161621",
          border: 0,
          width: "250px",
          marginTop: "55px",
        }}
      >
        {t("stake.Claim")}
      </Button>
    );
    
  });

  // web3 钱包登录状态
  const status = useStatus();
  const account = useAccount();
  const balaT = useBalance();

  // 预估值
  async function changeBurn(e: any) {
    if (!account) {
      connect();
      return;
    }

    const val = e.target.value;
    setBurnVal(val);
    var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
    if (!re.test(val)) {
      return;
    }

    const rest = await excContract.XCFX_burn_estim(
      Unit.fromStandardUnit(val).toHexMinUnit()
    );
    setXcfxVal(parseFloat(Drip(rest[0]).toCFX()).toFixed(2));

    // period 时间
    setPeriod(rest[1].toNumber());
  }

  // 全部下注
  async function max1() {
    if (status === "not-active") {
      connect();
      return;
    }
    if (+xcfxAmount < 1) {
      setBurnVal(0);
      setXcfxVal(0);
    } else {
      // const val = await xcfxContract.balanceOf(account);// val ~= xcfxAmount; val is more accurate;
      const val = Unit.fromStandardUnit(+xcfxAmount.toString()).toHexMinUnit();
      console.log(xcfxAmount,val);
      setBurnVal(parseFloat((+xcfxAmount).toString()).toFixed(3));
      const rest = await excContract.XCFX_burn_estim(val);
      console.log(rest,Drip(rest).toCFX());
      setXcfxVal(parseFloat(Drip(rest).toCFX()).toFixed(3));
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    // 监听
    //window.addEventListener("resize", resizeChange);
    init();

    const spinner2Timer = setInterval(() => {
      getBlockNumber();
    }, 14000);
    return () => clearInterval(spinner2Timer);
  }, []);

  function getBlockNumber() {
    axios
      .get("https://evmtestnet.confluxscan.io/v1/homeDashboard")
      .then(async (response) => {
        setBlockNumber(response.data.result.blockNumber);
      });
  }

  async function init() {
    (async () => {
      const mynut = await nutoContract.balanceOf(myacc);
      setMynut(Drip(mynut.toString()).toCFX().toString());

      const summary = await excContract.Summary();
      const xcfxvalues = Drip(summary.xcfxvalues).toCFX();
      setExchangeRate(xcfxvalues);

      const confluxscanData = await axios.get(
        "https://www.confluxscan.io/stat/tokens/by-address?address=cfx%3Aacg158kvr8zanb1bs048ryb6rtrhr283ma70vz70tx&fields=iconUrl&fields=transferCount&fields=price&fields=totalPrice&fields=quoteUrl"
      );
      const data = confluxscanData.data.data;
      const holderCount = data.holderCount;
      setHolder(holderCount);
      setPrice(data.price);
      const balancevalueT = parseFloat(
        (+xcfxvalues * +data.price).toString()
      ).toFixed(4);
      setBalancevalue(balancevalueT);

      const totalxcfxs = Drip(summary.totalxcfxs).toCFX();

      const totalxcfxs0 = new BigNumber(totalxcfxs);
      const xcfxvalues0 = new BigNumber(xcfxvalues);
      const totalvalues = totalxcfxs0.multipliedBy(xcfxvalues0);
      const val = BigNumber(totalvalues * data.price).toFixed(2);
      console.log(val);
      setShareofthePool(val);

      if (account) {
        const rest = await xcfxContract.balanceOf(account);
        const num = Drip(rest).toCFX().toString();
        setXcfxAmount(num);

        var x = new BigNumber(balancevalueT);
        const att = x.times(num);
        setXcfxAmountTotal(parseFloat(att).toFixed(4));

        const userSummary = await excContract.userSummary(account);
        setUnlocking(Drip(userSummary.unlocking.toString()).toCFX().toString());
        setUnlocked(Drip(userSummary.unlocked.toString()).toCFX().toString());

        const userOutQueueArray = await excContract.userOutQueue(account);

        const block = await axios.get(
          "https://evmtestnet.confluxscan.io/v1/homeDashboard"
        );
        const blockNumberT = block.data.result.blockNumber;
        setBlockNumber(blockNumberT);

        let tmp: any = [];
        let maxtime = 0;
        var timestamp = new Date().valueOf();
        userOutQueueArray.forEach((element: any[], index: number) => {
          let ss = element[2].toString() - blockNumberT; // 到期秒数
          var t = timestamp + ss * 1000;
          if (t > maxtime) {
            const tt = moment(t).format("MM/DD/YYYY HH:mm:ss");
            setFinialUnlockTime(tt); // 获取最新block
          }
          maxtime = t;
          tmp.push({
            key: index + 1,
            xCFXAmounts: element[0].toString() / 1000000000000000000,
            votePower: element[1].toString() / 1000000000000000000,
            endBlock: moment(t).format("MM/DD/YYYY HH:mm:ss"),
            status: t - timestamp > 0 ? "In process" : "Claimable",
          });
        });
        setUserOutQueue(tmp.reverse());
        // 获账户balance
        const balaT = await excContract.espacebalanceof(account);
        const bala = Drip(balaT).toCFX();
        setStaketotal(parseFloat(bala.toString()).toFixed(2));
      }

      // const apy = await axios.get("https://confluxscan.net/stat/pos-info");
      // setCfxapy((apy.data.data.apy / 100).toString());
      const res3: {
        data: { count: any; rows: [{ apy: 0.0 }] };
      } = await getStatistics("", 1);
      const apyT = parseFloat(res3.data.rows[0].apy.toString()).toFixed(4);
      setCfxapy(apyT);
    })();
  }
  return (
    <div>
    <MyModal />
    <div className={style.unstake}>
      <Helmet>
        <link rel="stylesheet" href="style.css"></link>
      </Helmet>
      <div className={styles.inner} style={{ backgroundColor: "#171520" }}>
        <div className={style.sub_nav2}>
          <Link to="/data/stake" style={{ color: "#FFF" }}>
            {t("stake.Stake_CFX")}
          </Link>
          <Link to="/data/unstake" style={{ color: "#EAB764" }}>
            {t("stake.unStake_CFX")}
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
        <div style={{clear:"both"}}></div>
        <Row gutter={32} className={style.brief}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <div className={style.box1}>
              <Row>
                <Col span={24}>
                  Available to unstake <div className={style.board}></div>
                  <br />
                  <b>{formatNumber(parseFloat(xcfxAmount).toFixed(2))} xCFX</b>
                </Col>
              </Row>
              <div className={style.line}></div>
              <Row>
                <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                  CFX Balance
                  <br />
                  <b>{formatNumber(parseFloat(staketotal).toFixed(2))} CFX</b>
                </Col>
                <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                  CFX APY{" "}
                  <b style={{ fontWeight: "normal" }}>
                    {parseFloat((+cfxapy * 100).toString()).toFixed(2)}%
                  </b>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={7}
                  lg={7}
                  xl={7}
                  style={{ textAlign: "right" }}
                >
                  <Button
                    style={{
                      background: "#EBB974",
                      borderRadius: "8px",
                      border: "0",
                      color: "#161621",
                      height: "50px",
                      width: "150px",
                      marginTop: "20px",
                      fontSize: "24px",
                      display: "none",
                    }}
                  >
                    Lock time
                  </Button>
                </Col>
              </Row>
              <div className={style.line}></div>
              <Row
                style={{
                  background: "#EBB974",
                  borderRadius: "13px",
                  padding: "15px 10px",
                  margin: "20px 0",
                }}
              >
                <Col xs={10} sm={10} md={4} lg={4} xl={4}>
                  <img className={styles.coin1} src={logo8} height="80px" />
                </Col>
                <Col xs={14} sm={14} md={10} lg={10} xl={10}>
                  Amount <br />
                  <b>
                    <Input
                      placeholder="0"
                      onChange={changeBurn}
                      value={burnVal}
                      type="number"
                      style={{
                        display: "inline-block",
                        backgroundColor: "transparent",
                        width: "130px",
                        border: 0,
                        fontFamily: "Univa Nova Bold",
                        padding: 0,
                        fontSize: "32px",
                      }}
                    />
                    xCFX
                  </b>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={10}
                  lg={10}
                  xl={10}
                  style={{ textAlign: "right" }}
                >
                  <Button
                    style={{
                      background: "rgba(22, 22, 33, 0.4)",
                      borderRadius: "8px",
                      border: "0",
                      color: "#ffffff",
                      height: "60px",
                      width: "120px",
                      fontSize: "24px",
                      margin: "15px 15px 0 0",
                    }}
                    onClick={max1}
                  >
                    MAX
                  </Button>
                </Col>
              </Row>
              <UnStakeButton />
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <div className={style.box2} style={{ textAlign: "center" }}>
              <div className={style.box6} style={{ height: "80px" }}>
                <Row>
                  <Col span={14} style={{ textAlign: "right" }}>
                    {" "}
                    Total CFX in Unlocking Period :
                  </Col>
                  <Col span={10}>
                    {parseFloat(unlocking.toString()).toFixed(3)}
                  </Col>
                </Row>
              </div>
              <div className={style.line}></div>
              <div className={style.box6} style={{ height: "69px" }}>
                <Row>
                  <Col span={14} style={{ textAlign: "right" }}>
                    {" "}
                    Unlocked & Available to Claim :
                  </Col>
                  <Col span={10}>
                    {parseFloat(unlocked.toString()).toFixed(3)}
                  </Col>
                </Row>
              </div>
              <div className={style.line}></div>
              <div className={style.box6} style={{ height: "64px" }}>
                <Row>
                  <Col span={14} style={{ textAlign: "center" }}>
                    {" "}
                    The Final Unlock Time :
                  </Col>
                  <Col span={10}>{finialUnlockTime}</Col>
                </Row>
              </div>
              <div className={style.line}></div>
              <img
                className={style.arrow}
                src={arrow}
                height="80px"
                width="80px"
              />
              <ClaimButton />
            </div>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <div className={style.box3}>
              <Row gutter={32}>
                <Col span={12}>You will Receive</Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  {xcfxVal} CFX
                </Col>
                <Col span={12}>Exchange Rate</Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  1xCFX= {parseFloat(exchangeRate).toFixed(4)}CFX
                </Col>
                <Col span={16}>Estimated Cool Down Period</Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  {period === 1 ? "48 hours" : "16 days"}
                </Col>
                <Col span={12}>Current Block Number</Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <div
                    id="spinner2"
                    className="spinner-box2"
                    style={{
                      transform: "scale(15%,15%)",
                      position: "absolute",
                      top: "-34px",
                      right: "110px",
                    }}
                  >
                    <div className="configure-border-1">
                      <div className="configure-core"></div>
                    </div>
                    <div className="configure-border-2">
                      <div className="configure-core"></div>
                    </div>
                  </div>
                  {formatNumber(blockNumber)}
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <div className={style.box3}>
              Current Balance
              <Row gutter={32} style={{ marginTop: "30px" }}>
                <Col span={6}>
                  <span className={style.mintxt}>Value</span>
                  <div>${balancevalue}</div>
                </Col>
                <Col span={10}>
                  <div className={style.vbar}>
                    <b>${xcfxAmountTotal}</b>
                    <div className={style.mintxt} style={{ color: "#418A55" }}>
                      &nbsp;
                    </div>
                  </div>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <span className={style.mintxt}>Share of the Pool</span>
                  <div>
                    {+parseFloat(xcfxAmountTotal).toFixed(0) /
                      +parseFloat(shareofthePool).toFixed(0) <
                    0.0001
                      ? "< .1%"
                      : "~ " +
                        (
                          (+parseFloat(xcfxAmountTotal).toFixed(0) /
                            +parseFloat(shareofthePool).toFixed(0)) *
                          100
                        ).toFixed(2) +
                        "%"}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <div style={{ top: "100px", position: "relative" }}>
          <h4 style={{ color: "#EAB966", textAlign: "left" }}>
            Unstaking Details
          </h4>
          <div className={style.box4}>
            <Row style={{ padding: "10px 20px 5px" }}>
              <Col span={4}>{t("stake.QueueHistory")}</Col>
              <Col span={5}>{t("stake.UnstakedxCFX")}</Col>
              <Col span={5}>{t("stake.LockingCFX")}</Col>
              <Col span={6}>{t("stake.EstimatedUnlockDate")}</Col>
              <Col span={4}>{t("stake.Status")}</Col>
            </Row>
            <Divider
              style={{ borderTop: "1px solid #EAB966", margin: "12px 0" }}
            />
            {userOutQueue.map((item: any) => {
              return (
                <div key={item.key}>
                  <Row
                    style={{
                      padding: "5px 20px 5px",
                      fontFamily: "Univa Nova Bold",
                      fontSize: "20px",
                    }}
                  >
                    <Col span={4}>{item.key}</Col>
                    <Col span={5}>
                      {formatNumber(
                        parseFloat(item.xCFXAmounts.toString()).toFixed(3)
                      )}
                    </Col>
                    <Col span={5}>
                      {formatNumber(
                        parseFloat(item.votePower.toString()).toFixed(3)
                      )}
                    </Col>
                    <Col span={6}>{item.endBlock}</Col>
                    <Col span={4}>
                      <span style={{ color: "#EAB966" }}>{item.status}</span>
                    </Col>
                  </Row>
                  <Divider
                    style={{ borderTop: "1px solid #EAB966", margin: "12px 0" }}
                  />
                </div>
              );
            })}
            <div style={{ height: "7px" }}></div>
          </div>
          <h4 style={{ marginTop: "80px" }}>About Nucleon Stake</h4>
          <div className={style.box5}>
            <p>
              Nucleon is a liquid staking solution for Conflux PoS backed by
              industry-leading staking providers. Nucleon lets users stake their
              CFX by exchange CFX to xCFX - without locking assets or
              maintaining infrastructure.
            </p>
            <p>
              The value in xCFX will be automatically compounded and the xCFX
              value expands automatically
            </p>
            <p>
              Our goal is to solve the problems associated with Conflux PoS
              staking - illiquidity, immovability and accessibility - making
              staked CFX liquid and allowing for participation with any amount
              of CFX to improve security of the Conflux network.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div> 
  );
}
