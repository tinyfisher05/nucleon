import { useEffect, useState, memo, useCallback, SetStateAction } from "react";
import { Link } from "umi";
// import React from "react";
import { Helmet } from "react-helmet";
import * as echarts from "echarts";
import waitTransactionReceipt from './../../../utils/waitTranscationReceipt'; 
var moment = require("moment");

import axios from "axios";

import styles from "./../../../layouts/index.less";
import style from "./index.less";

import logo from "../../../assets/logo.svg";
import logotxt from "../../../assets/logotxt.svg";
import logo7 from "../../../assets/logo7.png";
import logo8 from "../../../assets/logo8.png";
import yuan from "../../../assets/yuan.png";
import { Button, Col, Row, Input, Checkbox, Modal } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

import "../../../locales/config"; // 引用配置文件
import { useTranslation, Trans } from "react-i18next"; // https://blog.csdn.net/r657225738/article/details/124035454

// 区块链部分
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
import { callTxAdvance } from "js-conflux-sdk/dist/types/rpc/types/formatter";
const { Drip } = require("js-conflux-sdk");
const { addressExc, abiExc } = require("./../../../ABI/ExchangeRoom.json");
const { addressXcfx, abiXcfx } = require("./../../../ABI/Xcfx.json");
const { addressNut, abiNut } = require("./../../../ABI/Nut.json");
const { formatNumber } = require("../../../utils/tools.js");

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

let myacc: any;
export default function Page() {
  myacc = useAccount();
  const [mynut, setMynut] = useState("--");
  const [staketotal, setStaketotal] = useState("00.0000");
  const [exchangeRate, setExchangeRate] = useState("00.0000");
  const [burnVal, setBurnVal] = useState("");
  const [xcfxVal, setXcfxVal] = useState("");
  const [balancevalue, setBalancevalue] = useState("");
  const [xcfxAmount, setXcfxAmount] = useState("--");
  const [xcfxAmountTotal, setXcfxAmountTotal] = useState("--");
  const [shareofthePool, setShareofthePool] = useState("--");
  const [cfxapy, setCfxapy] = useState("--");
  const [totalStaked, setTotalStaked] = useState("--");
  const [holder, setHolder] = useState("--");
  const [holderCount, setHolderCount] = useState("--");
  const [price, setPrice] = useState(0);
  const [closingPrice, setClosingPrice] = useState("0.0000");
  const [chart3Tab, setChart3Tab] = useState(0);
  const [blockNumber, setBlockNumber] = useState(0);
  const [rate, setRate] = useState("0.00");
  const [tranHash, setTranHash] = useState("");
  const [operation, setOperation] = useState("Operation");
  const [tokenUsed, setTokenUsed] = useState("xCFX");

  let xLabel0 = [""];
  let xgoToSchool0: { date: any; value: any }[] = [];
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

  // web3 钱包登录状态
  const status = useStatus();
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

  const StakeButton: React.FC = memo(() => {
    const account = useAccount();
    const chainId = useChainId()!;
    const balance = useBalance()!;

    const handleClickSendTransaction = useCallback(async () => {
      if (!account) return;
      if (!burnVal) return;
      if(chainId !='71'){
        onSwitchNetwork();
        alert('  You have used the wrong network.\r\n  Now we will switch to the Conflux Espace test network!');//switch
        return;
      }
      
      const data = excinterface.encodeFunctionData("CFX_exchange_XCFX", []);

      (document.getElementById("spinner") as any).style.display = "block";
      try {
        const TxnHash = await sendTransaction({
          to: addressExc,
          data,
          value: Unit.fromStandardUnit(burnVal).toHexMinUnit(),
        });
        // const txReceipt = await waitTransactionReceipt(txnHash);
        console.log("AAA",TxnHash);
        const txReceipt = await waitTransactionReceipt(TxnHash);
        console.log(txReceipt.logs[0].data,Drip(Unit.fromStandardUnit(txReceipt.logs[0].data).toDecimalStandardUnit()).toCFX());
        console.log(Drip(Unit.fromStandardUnit(txReceipt.logs[1].data).toDecimalStandardUnit()).toCFX());
        console.log(txReceipt);
        setOperation("Details: "
                      +(Drip(Unit.fromStandardUnit(txReceipt.logs[1].data).toDecimalStandardUnit()).toCFX())
                      +" CFX staked; "
                      +(Drip(Unit.fromStandardUnit(txReceipt.logs[0].data).toDecimalStandardUnit()).toCFX())
                      +" xCFX received.")
        setTimeout(setTranHash(TxnHash),3690);
      } catch (error) {
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
        style={{ background: "#161621", border: "0", color: "#E29346" }}
        shape={"round"}
        size={"large"}
        block
        ghost
        className={style.stake_btn}
      >
        Stake Now
      </Button>
    );
  });

  async function exchange() {
    if (status === "not-active") {
      connect();
      return;
    }

    // let wallet = new ethers.Wallet(privateKey, provider);
    // let amount = ethers.utils.parseEther(amount);
    // //let nonce = await rpcProvider.getTransactionCount(address, "pending") //自己搭建节点时适用。
    // let nonce = await wallet.getTransactionCount();
    // let gasPrice = await provider.getGasPrice();
    // let tx = {
    //   nonce: nonce,
    //   gasLimit: 21000,
    //   gasPrice: ethers.utils.bigNumberify(gasPrice),
    //   to: toAddress,
    //   chainId: chainId,
    //   value: amount,
    //   data: "",
    // };
    // // let signTx = await wallet.sign(tx)
    // // let resp = await rpcProvider.sendTransaction(signTx)

    // let resp = await wallet.sendTransaction(tx);
  }

  const account = useAccount();

  const { t, i18n } = useTranslation();
  var myChart: echarts.ECharts;

  const [isModalOpen, setIsModalOpen] = useState("none");

  // 确认Statement
  const handleOk = () => {
    setIsModalOpen("none");
    localStorage.setItem("DISCLAIMER", "confirm");
  };

  const onChange = (e: CheckboxChangeEvent) => {
    //console.log(`checked = ${e.target.checked}`);
  };
  async function changeBurn(e: any) {
    if (status === "not-active") {
      connect();
      return;
    }

    const val = e.target.value;
    setBurnVal(val);
    var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
    if (!re.test(val)) {
      return;
    }
    
    const rest = await excContract.CFX_exchange_estim(
      Unit.fromStandardUnit(val).toHexMinUnit()
    );
    setXcfxVal(parseFloat(Drip(rest).toCFX()).toFixed(2));
  }
  async function max1() {
    if (!account) {
      connect();
      return;
    }
    if (+staketotal < 1) {
      setBurnVal(0);
      setXcfxVal(0);
    } else {
      const val = Unit.fromStandardUnit((+staketotal - 1).toString()).toHexMinUnit();
      setBurnVal(parseFloat((+staketotal - 1).toString()).toFixed(3));
      const rest = await excContract.CFX_exchange_estim(val);
      console.log(rest,Drip(rest).toCFX());
      setXcfxVal(parseFloat(Drip(rest).toCFX()).toFixed(2));
    }
  }

  // 点击获取数据
  async function getCharts(chart = 1, _cond = "", index = 0, limit = 24) {
    //_cond = "";
    if (index === 1) limit = 168;
    if (index === 2) limit = 720;
    if (index === 3) limit = 8640;
    if (index === 4) limit = 8640 * 5;
    const res: { data: { count: any; rows: [] } } = await getStatistics(
      "",
      limit
    );

    xgoToSchool0 = [];
    xLabel0 = [];
    let T: {
      created_at: any;
      apy: any;
      price: any;
      xcfxvalues: any;
      totalxcfxs: string;
    }[] = [];
    let bl = 2;
    if (res.data.rows.length === limit)
      bl = parseInt((res.data.rows.length / 12).toString());
    else {
      bl = parseInt((limit / 12).toString());
    }
    res.data.rows.forEach((element: any, i: any) => {
      console.log(bl);
      if (index === 0) {
        //12采样点  && i % 2 === 0
        T.push(element);
      }
      if (index === 1 && i % 7 === 0) {
        T.push(element);
      }
      if (index === 2 && i % 30 === 0) {
        T.push(element);
      }
      if (index === 3 && i % bl === 0) {
        T.push(element);
      }
      if (index === 4 && i % bl === 0) {
        T.push(element);
      }
    });

    // 收盘价
    setClosingPrice(
      parseFloat((T[0].xcfxvalues * +balancevalue).toString()).toFixed(4)
    );

    if (chart === 3) {
      setChart3Tab(index);
      T.reverse().forEach(
        (
          element: {
            created_at: any;
            apy: any;
            price: any;
            xcfxvalues: any;
            totalxcfxs: string;
          },
          i: any
        ) => {
          // const balancevalueT2 = parseFloat(
          //   (+element.xcfxvalues * +element.price).toString()
          // ).toFixed(4);

          // const xcfxvalues = element.xcfxvalues;
          // const valT = xcfxvalues * +balancevalueT2;
          // const dayT = element.created_at.toString();
          // let objT = { date: dayT, value: valT };
          // objT.value = valT;
          // objT.date = dayT;
          // xLabel0.push(i);
          // xgoToSchool0.push(objT);

          const xcfxvalues = element.xcfxvalues;
          const y = new BigNumber(xcfxvalues);
          const val4 = +y.toString() * +element.price;
          const day4 = element.created_at.toString();
          let obj4 = { date: day4, value: val4 };
          obj4.value = val4;
          obj4.date = day4;
          xgoToSchool0.push(obj4);
          xLabel0.push("");


        }
      );

      const myChartT = echarts.getInstanceByDom(
        document.getElementById("main0") as HTMLElement
      );
      var optionT = (myChartT as any).getOption();
      optionT.series[0].data = xgoToSchool0;
      optionT.xAxis.data = xLabel0;
      (myChartT as any).setOption(optionT);
      return;
    }
  }

  // setTimeout(() => {
  //   i18n.changeLanguage("zh");
  // }, 1000);

  // const balaT = useBalance();
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(localStorage.getItem("DISCLAIMER"));
    if (
      !localStorage.getItem("DISCLAIMER") ||
      localStorage.getItem("DISCLAIMER") !== "confirm"
    ) {
      setIsModalOpen("block");
    }

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
    // 监听
    //window.addEventListener("resize", resizeChange);
    (async () => {
      axios
        .get("https://evmtestnet.confluxscan.io/v1/homeDashboard")
        .then(async (response) => {
          setBlockNumber(response.data.result.blockNumber);
        });

      axios
        .get(
          " https://evmtestnet.confluxscan.io/stat/tokens/by-address?address=0x092690013ef7aF87eaf45030906baa86b8fAA411&fields=iconUrl&fields=transferCount&fields=price&fields=totalPrice&fields=quoteUrl"
        )
        .then(async (response) => {
          setHolderCount(response.data.result.holderCount);
        });

      const resY: { data: { count: any; rows: [] } } = await getStatistics("");
      resY.data.rows.reverse().forEach(
        (
          element: {
            created_at: any;
            apy: any;
            price: any;
            xcfxvalues: any;
            totalxcfxs: string;
          },
          i: any
        ) => {
          const n = 365 - 1;
          const apyT = 1 + element.apy / 365;
          const t = Math.pow(apyT, n);
          const val = (element.apy * t * 100).toFixed(3);
          setRate(val.toString());
          return;
        }
      );

      xgoToSchool0 = [];
      xLabel0 = [];

      let option = {
        backgroundColor: "rgba(255,255,255,0)",
        tooltip: {
          trigger: "axis",
          show: true,
          backgroundColor: "#000",
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(126,199,255,1)", // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "rgba(126,199,255,1)", // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(126,199,255,1)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          formatter(res: any[]) {
            var result = "";
            res.forEach(function (item) {
              result +=
                '<div style="display:inline-block;padding:0 5px;border-radius:10px;height:30px;width:100%;background-color:#000;color:#fff"><div style="font-size:12px;color:#999">xCFX</div>' +
                '<span style="font-size:12px;color:#ccc">' +
                moment(item.data.date).format("YYYY-MM-DD HH:00:00") +
                "</span><br>" +
                item.value +
                "</span>";
            });
            return result;
          },
        },
        legend: {
          align: "left",
          right: "10%",
          top: "10%",
          type: "plain",
          textStyle: {
            color: "#7ec7ff",
            fontSize: 14,
          },
          // icon:'rect',
          itemGap: 50,
          itemWidth: 100,
          itemHeight: 10,
        },
        grid: {
          top: "3%",
          left: "5%",
          right: "60px",
          bottom: "15%",
          // containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "rgba(25,163,223,0)",
              },
            },
            axisTick: {
              show: false,
            },
            data: xLabel0,
          },
        ],
        yAxis: [
          {
            type: "value",
            min: function (value: { min: any }) {
              return value.min;
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(255,255,255,0.4)",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#233653",
              },
            },
            position: "right",
            axisLabel: {
              show: true,
              color: "#ffffff",
              padding: 0,
              formatter: function (value: number) {
                return "$" + value.toFixed(4);
              },
            },
            axisTick: {
              show: true,
            },
          },
        ],
        series: [
          {
            type: "line",
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: [4, 4],
            smooth: false,
            lineStyle: {
              width: 3,
              color: "#EAB966", // 线条颜色

              borderColor: "rgba(0,0,0,.0)",
            },
            itemStyle: {
              color: "rgba(234, 185, 102, .9)",
              borderColor: "#646ace",
              borderWidth: 0,
            },

            areaStyle: {
              //区域填充样式 gradient(180deg, #DD7C32 0%, rgba(234, 181, 98, 0.1) 116.13%);

              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#DD7C32",
                  },
                  {
                    offset: 1,
                    color: "rgba(234, 181, 98, 0.1)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(255, 255, 255, 0.5)", //阴影颜色
              shadowBlur: 0, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            },
            data: xgoToSchool0,
          },
        ],
      };

      const res = await getStatistics("", 24);

      res.data.rows.reverse().forEach(
        (
          element: {
            created_at: any;
            apy: any;
            price: any;
            xcfxvalues: any;
            totalxcfxs: string;
          },
          i: any
        ) => {
          const xcfxvalues = element.xcfxvalues;
          const y = new BigNumber(xcfxvalues);

          if (i % 2 === 1) {
          }
          // if (i === 1) {
          //   // 收盘价
          //   setClosingPrice(parseFloat((y * + balancevalue).toString()).toFixed(4));
          // }

          //setTotal(y.toFixed(4));
          // const balancevalueT2 = parseFloat(
          //   (+element.xcfxvalues * +element.price).toString()
          // ).toFixed(4);

          const val4 = +y.toString() * +element.price;
          const day4 = element.created_at.toString();
          let obj4 = { date: day4, value: val4 };
          obj4.value = val4;
          obj4.date = day4;
          xgoToSchool0.push(obj4);
          xLabel0.push("");
        }
      );

      //setTimeout(async () => { }, 10);
      try {
        myChart = echarts.init(document.getElementById("main0") as HTMLElement);
        // 绘制图表1
        myChart.setOption(option);
      } catch (error) {}

      var len = xgoToSchool0.length - 1;
      setClosingPrice(
        parseFloat(xgoToSchool0[len].value.toString()).toFixed(4)
      );

      const mynut = await nutoContract.balanceOf(myacc);
      setMynut(Drip(mynut.toString()).toCFX().toString());

      const summary = await excContract.Summary();
      const xcfxvalues = Drip(summary.xcfxvalues).toCFX();
      setExchangeRate(xcfxvalues);

      const totalxcfxs = Drip(summary.totalxcfxs).toCFX();

      setTotalStaked(
        parseFloat((xcfxvalues * totalxcfxs).toString()).toFixed(4)
      );

      const confluxscanData = await axios.get(
        "https://www.confluxscan.io/stat/tokens/by-address?address=cfx%3Aacg158kvr8zanb1bs048ryb6rtrhr283ma70vz70tx&fields=iconUrl&fields=transferCount&fields=price&fields=totalPrice&fields=quoteUrl"
      );

      const data = confluxscanData.data.data;
      const totalxcfxs0 = new BigNumber(totalxcfxs);
      const xcfxvalues0 = new BigNumber(xcfxvalues);
      const totalvalues = totalxcfxs0.multipliedBy(xcfxvalues0);
      const val = BigNumber(totalvalues * data.price).toFixed(2);
      console.log(val);
      setShareofthePool(val);

      const holderCount = data.holderCount;
      setHolder(holderCount);

      setPrice(data.price);
      const balancevalueT = parseFloat(
        (+xcfxvalues * +data.price).toString()
      ).toFixed(4);
      setBalancevalue(balancevalueT);

      if (account) {
        // 获账户balance
        const balaT = await excContract.espacebalanceof(account);
        const bala = Drip(balaT).toCFX();
        setStaketotal(parseFloat(bala.toString()).toFixed(2));

        const rest = await xcfxContract.balanceOf(account);
        const num = parseFloat(Drip(rest).toCFX().toString()).toFixed(2);
        setXcfxAmount(num);

        //const att = (parseInt(balancevalueT) * parseInt(xcfxAmount)).toString();
        var x = new BigNumber(balancevalueT);
        const att = x.times(num);
        setXcfxAmountTotal(parseFloat(att).toFixed(4));
        console.log(xcfxAmountTotal);
      }

      // axios
      //   .get("https://confluxscan.net/stat/pos-info")
      //   .then(async (response) => {
      //     const apy = parseFloat(
      //       (response.data.data.apy / 100).toString()
      //     ).toFixed(4);
      //     setCfxapy(apy);
      //   });
      // const res3: {
      //   data: { count: any; rows: [{ apy: 0.0 }] };
      // } = await getStatistics("", 1);
      const apy = parseFloat(res.data.rows[0].apy.toString()).toFixed(4);
      setCfxapy(apy);
    })();
  }

  return (
    <div>
      <MyModal />
      <div className={style.stake}>
        <Helmet>
          <link rel="stylesheet" href="style.css"></link>
        </Helmet>
        <div style={{ display: isModalOpen }}>
          <div className="ant-modal-mask" style={{ height: "3000px" }}></div>
          <div
            role="dialog"
            aria-modal="true"
            className="ant-modal ant-modal-confirm ant-modal-confirm-info"
            style={{
              zIndex: "100000",
              width: "100%",
              top: "5%",
              left: "10%",
              position: "absolute",
              borderRadius: "20px",
            }}
          >
            <div
              className="ant-modal-content"
              style={{
                backgroundColor: "#393942",
                width: "60%",
                maxWidth: "1300px",
                minWidth: "400px",
                margin: "0 auto",
                borderRadius: "20px",
              }}
            >
              <div
                className="ant-modal-body"
                style={{ backgroundColor: "#393942", borderRadius: "20px" }}
              >
                <div className="ant-modal-confirm-body-wrapper">
                  <div className="ant-modal-confirm-body">
                    <div className="disclaimer">
                      <div style={{ padding: "0 40px" }}>
                        <h4 style={{ margin: "20px 0 30px", fontSize: "28px" }}>
                          {t("stake.confirm_tit1")}
                        </h4>
                        <h4 style={{ margin: "20px 0", fontSize: "24px" }}>
                          {t("stake.confirm_tit2")}
                        </h4>
                        <p
                          style={{
                            color: "#fff",
                            fontSize: "18px",
                            lineHeight: "26px",
                          }}
                        >
                          {t("stake.confirm_txt1")}
                        </p>
                        <p
                          style={{
                            color: "#fff",
                            fontSize: "18px",
                            lineHeight: "26px",
                          }}
                        >
                          {t("stake.confirm_txt2")}
                        </p>
                        <p
                          style={{
                            color: "#fff",
                            fontSize: "18px",
                            lineHeight: "26px",
                          }}
                        >
                          {t("stake.confirm_txt3")}
                        </p>
                        <Checkbox
                          onChange={onChange}
                          checked
                          style={{
                            backgroundColor: "EAB966",
                            lineHeight: "20px",
                            color: "#fff",
                            fontSize: "36px",
                            margin: "5px 0 5px",
                          }}
                        >
                          <span
                            style={{ lineHeight: "20px", fontSize: "16px" }}
                          >
                            {t("stake.confirm_txt4")}
                          </span>
                        </Checkbox>
                      </div>
                    </div>
                  </div>
                  <div className="ant-modal-confirm-btns">
                    <Button
                      onClick={handleOk}
                      block
                      type="primary"
                      style={{
                        backgroundColor: "#EAB966",
                        border: "0",
                        width: "60%",
                        marginRight: "21%",
                        fontSize: "25px",
                        height: "56px",
                        borderRadius: "28px",
                        color: "#161621",
                      }}
                    >
                      {t("stake.btn_confirm")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.inner} style={{ backgroundColor: "#171520" }}>
          <div className={style.sub_nav2}>
            <Link to="/data/stake" style={{ color: "#EAB764" }}>
              {t("stake.Stake_CFX")}
            </Link>
            <Link to="/data/unstake" style={{ color: "#FFF" }}>
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
              Your NUTs：{parseFloat(mynut).toFixed(2)}
            </span>
          </div>
          <div style={{clear:"both"}}></div>
          <Row gutter={32} className={style.brief}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className={style.box1}>
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    Available to stake <div className={style.board}></div>
                    <b>{formatNumber(parseFloat(staketotal).toFixed(2))} CFX</b>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ textAlign: "right" }}
                  >
                    <Button
                      target="_blank"
                      href="https://integration.swappi.io/#/swap"
                      shape="round"
                      style={{
                        background: "#161621",
                        border: "0",
                        lineHeight: "50px",
                        color: "#E29346",
                        height: "50px",
                        width: "150px",
                        fontSize: "24px",
                      }}
                    >
                      Get CFX
                    </Button>
                  </Col>
                </Row>
                <div className={style.line}></div>
                <Row>
                  <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                    xCFX Balance
                    <br />
                    <b>{formatNumber(xcfxAmount)} xCFX</b>
                    <span style={{ display: "none" }} className={style.plus}>
                      +
                    </span>
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
                    <img className={styles.coin1} src={logo7} height="80px" />
                  </Col>
                  <Col xs={14} sm={14} md={10} lg={10} xl={10}>
                    Amount <br />
                    <b>
                      <Input
                        placeholder="0"
                        onChange={changeBurn}
                        type="number"
                        value={burnVal}
                        style={{
                          display: "inline-block",
                          backgroundColor: "transparent",
                          width: "130px",
                          border: "none",
                          fontFamily: "Univa Nova Bold",
                          padding: 0,
                          fontSize: "32px",
                          outline: "none",
                          boxShadow: "0",
                        }}
                      />
                      CFX
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
                <div style={{padding: "25px 0 0"}}>
                   <StakeButton />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className={style.box2}>
                <img className={styles.coin1} src={logo8} height="40px" />
                <div className={style.board2}></div>
                xCFX ${closingPrice} <span className={style.tip}></span>
                <div
                  className={styles.main5}
                  style={{ height: "340px", width: "100%", marginTop: "70px" }}
                  id="main0"
                ></div>
                <div
                  className={style.tabbtn}
                  style={
                    chart3Tab === 0
                      ? {
                          background: " #EAB966",
                          borderRadius: "7px",
                        }
                      : {}
                  }
                  onClick={() => {
                    getCharts(3, "", 0);
                  }}
                >
                  24h
                </div>
                <div
                  className={style.tabbtn}
                  style={
                    chart3Tab === 1
                      ? {
                          background: " #EAB966",
                          borderRadius: "7px",
                        }
                      : {}
                  }
                  onClick={() => {
                    getCharts(3, "weeks", 1);
                  }}
                >
                  7d
                </div>
                <div
                  className={style.tabbtn}
                  style={
                    chart3Tab === 2
                      ? {
                          background: " #EAB966",
                          borderRadius: "7px",
                        }
                      : {}
                  }
                  onClick={() => {
                    getCharts(3, "months", 2);
                  }}
                >
                  30d
                </div>
                <div
                  className={style.tabbtn}
                  style={
                    chart3Tab === 3
                      ? {
                          background: " #EAB966",
                          borderRadius: "7px",
                        }
                      : {}
                  }
                  onClick={() => {
                    getCharts(3, "years", 3);
                  }}
                >
                  1y
                </div>
                <div
                  className={style.tabbtn}
                  style={
                    chart3Tab === 4
                      ? {
                          background: " #EAB966",
                          borderRadius: "7px",
                        }
                      : {}
                  }
                  onClick={() => {
                    getCharts(3, "5years", 4);
                  }}
                >
                  5y
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className={style.box3}>
                <Row gutter={32}>
                  <Col span={12}>You will Receive</Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    {xcfxVal} xCFX
                  </Col>
                  <Col span={12}>Exchange Rate</Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    1xCFX= {parseFloat(exchangeRate).toFixed(4)}CFX
                  </Col>
                  <Col span={12}>Nucleon Service Fee</Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    10%
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
                    {formatNumber(blockNumber.toString())}
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className={style.box3}>
                Account Balance
                <Row gutter={32} style={{ marginTop: "30px" }}>
                  <Col span={6}>
                    <span className={style.mintxt}>xCFX Value</span>
                    <div>${balancevalue}</div>
                  </Col>
                  <Col span={10}>
                    <div className={style.vbar}>
                      <b>${xcfxAmountTotal}</b>
                      <div
                        className={style.mintxt}
                        style={{ color: "#418A55" }}
                      >
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
            <h4>CFX Statistics</h4>
            <div className={style.box5}>
              <Row gutter={32}>
                <Col span={12}>Annual Percentage Rate</Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  {rate}%
                </Col>
                <Col span={12}>Total Staked with CFX</Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  {formatNumber(parseFloat(totalStaked).toFixed(3))}
                </Col>
                <Col span={12}>Stakers</Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  {formatNumber(holderCount)}
                </Col>
                <Col span={12}>xCFX Market Cap</Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  $
                  {formatNumber(
                    parseFloat((+totalStaked * +price).toString()).toFixed(3)
                  )}
                </Col>
              </Row>
            </div>
            <h4>About Nucleon Stake</h4>
            <div className={style.box5}>
              <p>
                Nucleon is a liquid staking solution for Conflux PoS backed by
                industry-leading staking providers. Nucleon lets users stake
                their CFX by exchanging CFX to xCFX - without locking assets or
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
          </div>
        </div>
      </div>
    </div>
  );
}
