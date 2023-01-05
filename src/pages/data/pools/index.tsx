import { useEffect, useRef, useState, memo } from "react";

import { Link } from "umi";
import styles from "./../../../layouts/index.less";
import style from "./index.less";
import waitTransactionReceipt from './../../../utils/waitTranscationReceipt'; 
import logo7 from "../../../assets/logo7.png";
import logo8 from "../../../assets/logo8.png";
import logo9 from "../../../assets/logo9.png";
import nut from "../../../assets/nut.png";
import arrow2 from "../../../assets/arrow2.png";
import "./../../../locales/config"; // 引用配置文件
import { useTranslation, Trans } from "react-i18next";

import type { SliderMarks } from "antd/es/slider";
import { Button, Col, Row, Slider, Divider, InputNumber, Modal } from "antd";
import Icon, { CloseOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";

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
  watchAsset
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
const nutCfxContract = new ethers.Contract(addressNUT_CFX, abiLP, provider);
const nutCfxInterface = new utils.Interface(abiLP);
//LP
const xcfxCfxContract = new ethers.Contract(addressXCFX_CFX, abiLP, provider);
const xcfxCfxInterface = new utils.Interface(abiLP);
//币种
const nutContract = new ethers.Contract(addressNut, abiNut, provider);
const nutInterface = new utils.Interface(abiNut);

let myacc: any;
let timer: any;
let MyLiquilityarr = [];
let ShareOfPoolarr = [];
let Aprarr = [];
let LpPricearr = [];

export default function Page() {
  const { t, i18n } = useTranslation();

  const [userOutQueue1, setUserOutQueue1] = useState([]);
  const [userOutQueue2, setUserOutQueue2] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState("none");
  const [isModalOpen2, setIsModalOpen2] = useState("none");
  const [isModalOpen3, setIsModalOpen3] = useState("none");
  // const [isModalOpen4, setIsModalOpen4] = useState("none");
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

  const [myLiquility, setMyLiquility] = useState("--");
  const [shareOfPool, setShareOfPool] = useState("--");
  const [apr, setApr] = useState("--");
  const [lpprice, setlpprice] = useState("$--");
  const [userhave, setuserhave] = useState("$--");
  const [userWithdraw, setUserWithdraw] = useState("$--");
  const [tranHash, setTranHash] = useState("");
  const [operation, setOperation] = useState("Details:");
  const [tokenUsed, setTokenUsed] = useState("NUT");
  
  let NUTToken = {
    address: "0x48EE76131e70762DB59a37e6008ccE082805aB00", // The address of the token contract
    symbol: "NUT", // A ticker symbol or shorthand, up to 5 characters
    decimals: 18, // The number of token decimals
    image: "https://integration.swappi.io/static/media/0x48EE76131e70762DB59a37e6008ccE082805aB00.f202553a.png", // A string url of the token logo
  };
  const [tokenSetting, setTokenSetting] = useState(NUTToken);

  myacc = useAccount();

  const MyModal: React.FC = memo(() => {
    function closeCurr() {
      setTranHash("");
    }
    async function  onToken() {
      const watchAssetParams = {
        type: "ERC20", // In the future, other standards will be supported
        options: tokenSetting
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
          top: "400px",
          zIndex: "10000000",
        }}
      >
        <div className="ant-modal-body">
          <div className="ant-modal-confirm-body-wrapper">
            <div className="ant-modal-confirm-body">
              <div style={{ color: "#000", textAlign: "left" }}>
                <h5 style={{fontSize:"16px", fontWeight: "blod"}}>{operation}</h5>
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
                style={{ color: "#000" }}
              >
                Hash: <a target="_blank" style={{ color: "#000" }} href={'https://evmtestnet.confluxscan.io/tx/' + tranHash}>{tranHash}</a>
              </div>
            </div>
            <div
              className="ant-modal-confirm-btns"
              style={{ textAlign: "right" }}
            >
              <button
                type="button"
                className="ant-btn ant-btn-primary"
                style={{background:"rgb(234, 185, 102)",borderColor:"rgb(234, 185, 102)",float: "left"}}
                onClick={onToken}
              >
                <span>Add {tokenUsed} to Metamask</span>
              </button>
              <button
                type="button"
                className="ant-btn ant-btn-primary"
                style={{background:"rgb(234, 185, 102)",borderColor:"rgb(234, 185, 102)"}}
                onClick={closeCurr}
              >
                <span>OK</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

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
      const txReceipt = await waitTransactionReceipt(TxnHash);//cfx_back, speedMode
      console.log("CCC",TxnHash);
      setOperation("Details: "+unclaimed+ " NUT have been sent to your address.")
      setTimeout(setTranHash(TxnHash),3690);
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
      allowance = await nutCfxContract.allowance(myacc, addressPool);
    } else if (+isModalOpen1Val === 1) {
      allowance = await xcfxCfxContract.allowance(myacc, addressPool);
    }
    clearTimeout(timer);
    (document.getElementById("spinner") as any).style.display = "block";
    let LPInterface: any;
    // 授权
    console.log(Drip(allowance).toCFX());
    console.log(isModalOpen1Val3);
    let time = 0;
    if (+Drip(allowance).toCFX() < +isModalOpen1Val3) {
      // +Drip(allowance).toCFX() <= +isModalOpen1Val3
      // 对应币种合约
      if (+isModalOpen1Val === 0) {
        LPInterface = nutCfxInterface;
      } else if (+isModalOpen1Val === 1) {
        LPInterface = xcfxCfxInterface;
      }

      const data = LPInterface.encodeFunctionData("approve", [
        addressPool,
        Unit.fromStandardUnit(+isModalOpen1Val3*100000).toHexMinUnit(),
      ]);

      const txParams = {
        to: +isModalOpen1Val === 0 ? addressNUT_CFX : addressXCFX_CFX,
        data,
      };
      try {
        const TxnHash = await sendTransaction(txParams);
        const txReceipt = await waitTransactionReceipt(TxnHash);//cfx_back, speedMode
        console.log("AAA",TxnHash);
        setOperation("Details: Approve your Lps to be used in this pool.")
        setTimeout(setTranHash(TxnHash),3690);
      } catch (error) {
        setIsModalOpen2("none");
        (document.getElementById("spinner") as any).style.display = "none";
        return;
      }

      time = 2000;
    }
    var step;
    for (step = 0; step < 60; step++) {
      if (+isModalOpen1Val === 0) {
        allowance = await nutCfxContract.allowance(myacc, addressPool);
      } else if (+isModalOpen1Val === 1) {
        allowance = await xcfxCfxContract.allowance(myacc, addressPool);
      }
      if (+Drip(allowance).toCFX() < +isModalOpen1Val3) {
        for (
          var t = parseInt(new Date().getTime().toString());
          parseInt(new Date().getTime().toString()) - t <= time;
        );
      }
    }
    for (
      var t = parseInt(new Date().getTime().toString());
      parseInt(new Date().getTime().toString()) - 3600 <= time;
    );

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
        const txReceipt = await waitTransactionReceipt(TxnHash);//cfx_back, speedMode
        console.log("BBB",TxnHash);
        if(+isModalOpen1Val===0){
          setOperation("Details:"+isModalOpen1Val3+" NUT/CFX lps is staked to this pool.")
        }else if(+isModalOpen1Val===1){
          setOperation("Details:"+isModalOpen1Val3+" xCFX/CFX lps is staked to this pool.")
        }
        
        setTimeout(setTranHash(TxnHash),3690);
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
      const txReceipt = await waitTransactionReceipt(TxnHash);//cfx_back, speedMode
      console.log("BBB",TxnHash);
      if(+isModalOpen2Val === 0){
        setOperation("Details:"+isModalOpen2Val3+" NUT/CFX lps is transfered to your address.")
      }else if(+isModalOpen3Val === 1){
        setOperation("Details:"+isModalOpen2Val3+" xCFX/CFX lps is transfered to your address.")
      }
      setTimeout(setTranHash(TxnHash),3690);
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
      
      setMyLiquility(MyLiquilityarr[val]);
      setShareOfPool(ShareOfPoolarr[val]);
      setApr(Aprarr[val]);
      setlpprice('$'+ parseFloat(LpPricearr[val].toString()).toFixed(4));
      // withdraw
      setIsModalOpen2("block");
      setIsModalOpen2Val(val);
      setIsModalOpen2Val2(val3);
      setPercentage2(25);
      setIsModalOpen2Val3(parseFloat((val3 * 0.25).toString()));
      
      setUserWithdraw('$'+ parseFloat((val3 * 0.25 * LpPricearr[val]).toString()).toFixed(4));
      // stake
      setIsModalOpen1Val(val);
      setIsModalOpen1Val2(val2);
      setPercentage1(25);
      setIsModalOpen1Val3(parseFloat((val2 * 0.25).toString()));
      setuserhave('$'+ parseFloat((val2 * 0.25 * LpPricearr[val]).toString()).toFixed(4));
      console.log(val2,LpPricearr[val],0.25,val2 * 0.25 *LpPricearr[val]);
      // 显示授权额度
      let allowance = "";
      if (+isModalOpen1Val === 0) {
        allowance = await nutCfxContract.allowance(myacc, addressPool);
      } else if (+isModalOpen1Val === 1) {
        allowance = await xcfxCfxContract.allowance(myacc, addressPool);
      }
    };
  };
  // 选择百分比
  const dateChangeHandler1 = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setPercentage1((100*value / +isModalOpen1Val2));
    setIsModalOpen1Val3(value.toString());
    setuserhave('$'+parseFloat((LpPricearr[isModalOpen1Val]* +value).toString()).toFixed(4))
  };
  const onChange1 = (value: number) => {
    setPercentage1(value);
    if(value==100){
      setIsModalOpen1Val3(+isModalOpen1Val2);
    }
    else{
      setIsModalOpen1Val3((+isModalOpen1Val2 * +value) / 100);
    }
    setuserhave('$'+parseFloat((LpPricearr[isModalOpen1Val]* (+isModalOpen1Val2 * +value) / 100).toString()).toFixed(4))
  };
  const dateChangeHandler2 = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setPercentage2((value / +isModalOpen2Val2) * 100);
    setIsModalOpen2Val3(value.toString());
    setUserWithdraw('$'+parseFloat((LpPricearr[isModalOpen1Val]* +value).toString()).toFixed(4))
  };
  const onChange2 = (value: number) => {
    setPercentage2(value);
    if(value==100){
      setIsModalOpen2Val3(+isModalOpen2Val2);
    }
    else{
      setIsModalOpen2Val3((+isModalOpen2Val2 * +value) / 100);
    }
    setUserWithdraw('$'+parseFloat((LpPricearr[isModalOpen1Val]* (+isModalOpen2Val2 * +value) / 100).toString()).toFixed(4))
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
      setMyLiquility(MyLiquilityarr[val]);
      setShareOfPool(ShareOfPoolarr[val]);
      setApr(Aprarr[val]);
      setlpprice('$'+ parseFloat(LpPricearr[val].toString()).toFixed(4));

      setIsModalOpen3("block");
      setIsModalOpen3Val(val);
      setIsModalOpen3Val2(val2);
      setPercentage(25);
      // setIsModalOpen3Val3(parseFloat((val2 * 0.25).toString()).toFixed(2));
      setIsModalOpen3Val3((val2 * 0.25).toString());
      setuserhave('$'+parseFloat((val2 * 0.25 *LpPricearr[val]).toString()).toFixed(4));
      console.log(isModalOpen3Val,LpPricearr[val],isModalOpen3Val2);
      console.log(val2 * 0.25 *LpPricearr[val]);
      console.log('$'+parseFloat((val2 * 0.25 *LpPricearr[val]).toString()).toFixed(4));
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
    setPercentage((100 * value / +isModalOpen3Val2));
    setIsModalOpen3Val3(value.toString());
    setuserhave('$'+parseFloat((LpPricearr[isModalOpen3Val]* +value).toString()).toFixed(4))
  };
  // Other Pools -> Percentage
  const onChange = (value: number) => {
    setPercentage(value);
    if(value==100){
      setIsModalOpen3Val3(isModalOpen3Val2);
    }
    else{
      setIsModalOpen3Val3(((+isModalOpen3Val2 * +value) / 100));
    }
    console.log(isModalOpen3Val,LpPricearr[isModalOpen3Val],isModalOpen3Val2,value);
    // console.log(LpPricearr[isModalOpen3Val]* (isModalOpen3Val2 * value) / 100);
    setuserhave('$'+parseFloat((LpPricearr[isModalOpen3Val]* (isModalOpen3Val2 * value) / 100).toString()).toFixed(4))
  };
  // Other Pools -> Stake -> Stake Liquidity
  const handleStakeNow = async () => {
    // 授权与否
    let allowance = "";
    if (+isModalOpen3Val === 0) {
      allowance = await nutCfxContract.allowance(myacc, addressPool);
    } else if (+isModalOpen3Val === 1) {
      allowance = await xcfxCfxContract.allowance(myacc, addressPool);
    }
    clearTimeout(timer);
    (document.getElementById("spinner") as any).style.display = "block";

    // 对应币种合约
    let LPInterface: any;
    console.log(Drip(allowance).toCFX());
    console.log(isModalOpen3Val3);
    let time = 0;
    if (+Drip(allowance).toCFX() < +isModalOpen3Val3) {
      if (+isModalOpen3Val === 0) {
        LPInterface = nutCfxInterface;
      } else if (+isModalOpen3Val === 1) {
        LPInterface = xcfxCfxInterface;
      }

      const data = LPInterface.encodeFunctionData("approve", [
        addressPool,
        Unit.fromStandardUnit(+isModalOpen3Val3*100000).toHexMinUnit(),
      ]);

      const txParams = {
        to: +isModalOpen3Val === 0 ? addressNUT_CFX : addressXCFX_CFX,
        data,
        //value: Unit.fromStandardUnit(0).toHexMinUnit(),
      };

      try {
        const TxnHash = await sendTransaction(txParams);
        console.log("AAA",TxnHash);
        setOperation("Details: Approve your Lps to be used in this pool.")
        setTimeout(setTranHash(TxnHash),3690);
      } catch (error) {
        setIsModalOpen3("none");
        (document.getElementById("spinner") as any).style.display = "none";
        return;
      }
      time = 2000;
    }
    var step;
    for (step = 0; step < 60; step++) {
      if (+isModalOpen1Val === 0) {
        allowance = await nutCfxContract.allowance(myacc, addressPool);
      } else if (+isModalOpen1Val === 1) {
        allowance = await xcfxCfxContract.allowance(myacc, addressPool);
      }
      if (+Drip(allowance).toCFX() < +isModalOpen3Val3) {
        for (
          var t = parseInt(new Date().getTime().toString());
          parseInt(new Date().getTime().toString()) - t <= time;
        );
      }
    }
    for (
      var t = parseInt(new Date().getTime().toString());
      parseInt(new Date().getTime().toString()) - 3600 <= time;
    );

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
        const txReceipt = await waitTransactionReceipt(TxnHash);//cfx_back, speedMode
        console.log("BBB",TxnHash);
        if(+isModalOpen3Val === 0){
          setOperation("Details:"+isModalOpen3Val3+" NUT/CFX lps is staked to this pool.")
        }else if(+isModalOpen3Val === 1){
          setOperation("Details:"+isModalOpen3Val3+" xCFX/CFX lps is staked to this pool.")
        }
        setTimeout(setTranHash(TxnHash),3690);
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
      const mynut = await nutContract.balanceOf(myacc);
      //const nutinfo = await nutContract.getReserves();
      const totalpoint = await poolsContract.totalAllocPoint();
      // console.log(Drip(totalpoint).toCFX());
      const nutPerBlock = await poolsContract.sushiPerBlock();
      // console.log(Drip(nutPerBlock).toCFX());
      setMynut(Drip(mynut.toString()).toCFX().toString());
      const confluxscanData = await axios.get(
        "https://www.confluxscan.net/stat/tokens/by-address?address=cfx%3Aacg158kvr8zanb1bs048ryb6rtrhr283ma70vz70tx&fields=iconUrl&fields=transferCount&fields=price&fields=totalPrice&fields=quoteUrl"
      );
      const data = confluxscanData.data.data;
      const cfxprice = data.price;

      // 每个lp的价值
      // nut的价值
      // 常数：sushiPerBlock
      // 此种lp的总量
      // totalAllocPoint获取一个值为Alloc总值
      // poolInfo获取三个值，取第三个值：allocPoint
      // 常数：一年的总秒数：31,536,000
      const secondperyear = 31536000;
      
      let tmp1: any = [];
      let tmp2: any = [];
      for (let index = 0; index < 2; index++) {
        const pools = await poolsContract.userInfo(index, myacc);
        const pendingrewards = await poolsContract.pendingSushi(index, myacc);
        const pointInfo = await poolsContract.poolInfo(index);
        //console.log(pointInfo);
        let myLiquidity = 0;
        let val = 0;
        let totalLPs = 0;
        let lpinfoNUT:any;
        let lpinfo:any;
        let arp:any;
        if (index === 0) {
          val = await nutCfxContract.totalSupply();
          myLiquidity = await nutCfxContract.balanceOf(myacc);
          lpinfo = await nutCfxContract.getReserves();
        } else if (index === 1) {
          val = await xcfxCfxContract.totalSupply();
          myLiquidity = await xcfxCfxContract.balanceOf(myacc);
          lpinfo = await xcfxCfxContract.getReserves();
        }
        //console.log(lpinfo);
        lpinfoNUT = await nutCfxContract.getReserves();
        const NUTPrice = lpinfoNUT[0]/lpinfoNUT[1];
        LpPricearr[index] =cfxprice*lpinfo[0]*2/val;
        //console.log(lpToken2Price);
        totalLPs = await poolsContract.PoolLPSum(index);
        if(totalLPs>0){
          // console.log(NUTPrice,secondperyear,Drip(nutPerBlock).toCFX(),Drip(pointInfo[2]).toCFX(),Drip(val).toCFX());
          arp = (100*NUTPrice*secondperyear*Drip(nutPerBlock).toCFX()*Drip(pointInfo[2]).toCFX()*Drip(val).toCFX()/((Drip(totalpoint).toCFX()*Drip(totalLPs).toCFX())*Drip(lpinfo[0]).toCFX()*2)).toString();
          
          arp = (arp.split('.')[0]+'.'+arp.split('.')[1].slice(0, 8));
        }else{
          arp = "--"
        }
        
        // console.log(arp);
        totalLPs = Drip(totalLPs).toCFX();
        console.log(pools[0].toString());
        if (pools[0].toString() === "0") {
          tmp2.push({
            i: index,
            val: Drip(pools[0]).toCFX(),
            arp: arp,
            totalLiquidity: Drip(val).toCFX(),
            myLiquidity: Drip(myLiquidity).toCFX(),
            totalLPs: totalLPs,
          });
        } else {
          tmp1.push({
            i: index,
            val: Drip(pools[0]).toCFX(),
            arp: arp,
            totalLiquidity: Drip(val).toCFX(),
            myLiquidity: Drip(myLiquidity).toCFX(),
            totalLPs: totalLPs,
            pendingrewards: Drip(pendingrewards).toCFX(),
          });
        }
      MyLiquilityarr[index]=parseFloat(Drip(pools[0]).toCFX().toString()).toFixed(2);
      ShareOfPoolarr[index]=parseFloat((100*Drip(pools[0]).toCFX()/totalLPs).toString()).toFixed(2)+'%';
      Aprarr[index]=parseFloat((arp).toString()).toFixed(1);

      }

      setUserOutQueue1(tmp1);
      setUserOutQueue2(tmp2);
    }
  }

  return (
    <div>
      <MyModal />
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
          <Row style={{ padding: "10px 20px 5px"}}>
            <Col span={2}>{t("pools.PoolName")}</Col>
            <Col span={3}>{t("pools.APR")}</Col>
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
                    fontSize: "16px",
                  }}
                >
                  <Col span={2}>
                    {item.i.toString() === "0" ? "NUT/CFX" : "xCFX/CFX"}
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.arp.toString()).toFixed(1)}%
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.totalLiquidity.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.totalLPs.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.val.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.myLiquidity.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Col>
                  <Col span={2}>
                    {parseFloat(item.pendingrewards.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
                        width: "100px",
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
                        marginRight: "10px",
                        width: "130px",
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
            <Col span={2}>{t("pools.PoolName")}</Col>
            <Col span={3}>{t("pools.APR")}</Col>
            <Col span={3}>{t("pools.TotalLiquidity")}</Col>
            <Col span={3}>LPs in Pool</Col>
            <Col span={3}>{t("pools.Myliquidity")}</Col>
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
                    fontSize: "16px",
                  }}
                >
                  <Col span={2}>
                    {item.i.toString() === "0" ? "NUT/CFX" : "xCFX/CFX"}
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.arp.toString()).toFixed(1)}%
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.totalLiquidity.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.totalLPs.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Col>
                  <Col span={3}>
                    {parseFloat(item.myLiquidity.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Col>
                  <Col span={10} style={{ textAlign: "right" }}>
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
                        width: "100px",
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
                        marginRight: "10px",
                        width: "130px",
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
        <h4>About Nucleon Pools</h4>
          <div className={style.box5}>
            <p>
              Nucleon is a liquid staking solution for Conflux PoS backed by
              industry-leading staking providers. Nucleon lets users stake their
              CFX by exchanging CFX to xCFX - without locking assets or
              maintaining infrastructure.
            </p>
            <p>
              The value in xCFX will be automatically compounded and the xCFX
              value expands automatically.
            </p>
            <p>
              Our goal is to solve the problems associated with Conflux PoS
              staking - illiquidity, immovability and accessibility - making
              staked CFX liquid and allowing for participation with any amount
              of CFX to improve security of the Conflux network.
            </p>
          </div>
        <div style={{ display: isModalOpen }}>
          <div className="ant-modal-mask" style={{ height: "2300px" }}></div>
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
                          Pending Rewards
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
            style={{ top: "0px", backgroundColor: " rgba(23, 21, 32, 1)", height: "2300px" }}
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
                                {lpprice}
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
                              <div style={{ fontSize: "14px" }}>{userhave}</div>
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
                          tooltip={{ open: false }}
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
                              {myLiquility}
                            </div>
                            My Liquility
                          </Col>
                          <Col span={8}>
                            <div style={{ color: "#ffffff" }}>
                              {shareOfPool}
                            </div>
                            Share Of Pool
                          </Col>
                          <Col span={8}>
                            <div style={{ color: "#ffffff" }}>{apr}%</div>APR
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
                                {lpprice}
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
                              <div style={{ fontSize: "14px" }}>{userWithdraw}</div>
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
                          tooltip={{ open: false }}
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
                              {myLiquility}
                            </div>
                            My Liquility
                          </Col>
                          <Col span={8}>
                            <div style={{ color: "#ffffff" }}>
                              {shareOfPool}
                            </div>
                            Share Of Pool
                          </Col>
                          <Col span={8}>
                            <div style={{ color: "#ffffff" }}>{apr}%</div>APR
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
            style={{ top: "0px", backgroundColor: " rgba(23, 21, 32, 1)",height: "2300px" }}
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
                        display: "block",
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
                                {lpprice}
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
                              <div style={{ fontSize: "14px" }}>{userhave}</div>
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
                          tooltip={{ open: false }}
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
                              {myLiquility}
                            </div>
                            My Liquility
                          </Col>
                          <Col span={8}>
                            <div style={{ color: "#ffffff" }}>
                              {shareOfPool}
                            </div>
                            Share Of Pool
                          </Col>
                          <Col span={8}>
                            <div style={{ color: "#ffffff" }}>{apr}%</div>APR
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
    </div>
  );
}
