import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  useStatus,
  useAccount,
  useChainId,
  useBalance,
  connect,
  Unit,
  sendTransaction,
} from "@cfxjs/use-wallet-react/ethereum";
import { Link } from "umi";
const BigNumber = require("bignumber.js");
import { useRequest } from "ahooks";
const axios = require("axios").default;
var moment = require("moment");

import styles from "../layouts/index.less";
import { Button, Col, Row, Carousel, Modal } from "antd";
import { Helmet } from "react-helmet";
import * as echarts from "echarts";

const {
  addressNut,
  abiNut,
} = require("./../ABI/Nut.json");
const { addressPool } = require("./../ABI/Pools.json");
const provider = new ethers.providers.JsonRpcProvider(
  "https://evmtestnet.confluxrpc.com"
);
import { ethers, utils } from "ethers";
const nutContract = new ethers.Contract(addressNut, abiNut, provider);

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
import logo8 from "../assets/logo8.png";
import learn from "../assets/learn.png";
import yuan from "../assets/yuan.png";
import menu from "../assets/menu.png";

import up from "../assets/up.png";
import down from "../assets/down.png";
import { Drip } from "js-conflux-sdk";

const domain = "https://api.nucleon.network"; //http://127.0.0.1:7001  http://nucleon.artii.top:86 https://www.artii.top

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

function getStatisticsMore(cond: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        axios.get(
          domain + "/api/v1/statistics?condition=" + cond + "&offset=0&limit=24"
        )
      );
    }, 1000);
  });
}

function getYesterday(cond: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        axios.get(domain + "/api/v1/statistics?yesterday=1&offset=0&limit=1")
      );
    }, 1000);
  });
}

function onToP1() {
  window.scrollTo(0, 2700)
}
function onToP2() {
  window.scrollTo(0, 2100)
}
function onToP11() {
  window.scrollTo(0, 3000)
}
function onToP22() {
  window.scrollTo(0, 2400)
}

export default function HomePage() {
  var myChart: echarts.ECharts;
  var myChart2: echarts.ECharts | null = null;
  var myChart3: echarts.ECharts | null = null;
  var myChart4: echarts.ECharts | null = null;
  var myChart5: echarts.ECharts | null = null;

  let xLabel = [""];
  let goToSchool: { date: any; value: any }[] = [];
  let xLabelP2 = [""];
  let goToSchoolP2: { date: any; value: any }[] = [];
  let xLabelP3 = [""];
  let goToSchoolP3: { date: any; value: any }[] = [];
  let xLabelP4 = [""];
  let goToSchoolP4: { date: any; value: any }[] = [];

  let xLabel2 = [""];
  let goToSchool2: { date: any; value: any }[] = [];
  let xDate2 = [""];

  const status = useStatus();

  const [showMenu, setShowMenu] = useState("none");

  async function hideMeun() {
    window.scrollTo(0, 0);
    setShowMenu("none");
  }
  const [total1, setTotal1] = useState("");
  const [total2, setTotal2] = useState("");
  const [total3, setTotal3] = useState("");
  const [total4, setTotal4] = useState("");

  const [closingPrice1, setClosingPrice1] = useState("");
  const [closingPrice2, setClosingPrice2] = useState("");
  const [closingPrice3, setClosingPrice3] = useState("");
  const [closingPrice4, setClosingPrice4] = useState("");
  const [nutPrice, setNutPrice] = useState("");
  const [circulatingNUT, setCirculatingNUT] = useState("--");
  const [nutSupply, setNutSupply] = useState("--");

  const [xcfxvalues, setXcfxvalues] = useState("");

  const [chart1Tab, setChart1Tab] = useState(0);
  const [chart2Tab, setChart2Tab] = useState(0);
  const [chart3Tab, setChart3Tab] = useState(0);
  const [chart4Tab, setChart4Tab] = useState(0);
  const [chart9Tab, setChart9Tab] = useState(0);

  async function showMeun() {
    setShowMenu("block");
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
      <div onClick={handleClickSendTransaction}>
        {account?.slice(0, 7) +
          "..." +
          account?.slice(account.length - 5, account.length)}
      </div>
    );
  });

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

    goToSchool = [];
    xLabel = [];
    goToSchoolP2 = [];
    xLabelP2 = [];
    goToSchoolP3 = [];
    xLabelP3 = [];
    goToSchoolP4 = [];
    xLabelP4 = [];
    goToSchool2 = [];
    xLabel2 = [];
    xDate2 = [];
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
      if (index === 0 && i % 2 === 0) {
        //12采样点  && i % 2 === 0
        T.push(element);
      }
      if (index === 1 && i % bl === 0) {
        T.push(element);
      }
      if (index === 2 && i % bl === 0) {
        T.push(element);
      }
      if (index === 3 && i % bl === 0) {
        T.push(element);
      }
      if (index === 4 && i % bl === 0) {
        T.push(element);
      }
      //if (chart === 1) setClosingPrice2((element.apy * 100).toFixed(2));
    });

    T.forEach(
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
        if (i === T.length - 1) {
          //
          // 收盘价
          const totalxcfxs = element.totalxcfxs;
          const xcfxvalues = element.xcfxvalues;
          const x = new BigNumber(totalxcfxs);
          const y = new BigNumber(xcfxvalues);
          const totalvalues = x.multipliedBy(y);
          const val = BigNumber(totalvalues * element.price).toFixed(2);
          if (chart === 1) setClosingPrice1(val);
          if (chart === 2) setClosingPrice2((element.apy * 100).toFixed(2));
          if (chart === 4) setClosingPrice3(x);
          if (chart === 3) setClosingPrice4(y);
        }
      }
    );

    if (chart === 1) {
      setChart1Tab(index);
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
          const totalxcfxs = element.totalxcfxs;
          const xcfxvalues = element.xcfxvalues;
          const x = new BigNumber(totalxcfxs);
          const y = new BigNumber(xcfxvalues);
          const totalvalues = x.multipliedBy(y);
          const val = BigNumber(totalvalues * element.price).toFixed(2);
          const val1 = val;
          const day1 = element.created_at.toString();
          let obj1 = { date: day1, value: val1 };
          obj1.value = val1;
          obj1.date = day1;
          setTotal1(val);
          xLabel.push(i);
          goToSchool.push(obj1);
        }
      );

      const myChartT = echarts.getInstanceByDom(
        document.getElementById("main") as HTMLElement
      );
      var optionT = (myChartT as any).getOption();
      optionT.series[0].data = goToSchool;
      optionT.xAxis.data = xLabel;
      (myChartT as any).setOption(optionT);
      return;
    }
    if (chart === 2) {
      //alert(closingPrice2);
      setChart2Tab(index);
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
          if (_cond === "") {
            const val = (element.apy * 100).toFixed(3);
            const val2 = val;
            const day2 = element.created_at.toString();
            let obj2 = { date: day2, value: val2 };
            obj2.value = val2;
            obj2.date = day2;
            setTotal2(val);
            xLabelP2.push(i);
            goToSchoolP2.push(obj2);
            return;
          }
          //((1+APY/365）n-1)/n)*365
          // APY * (1+APY/365）的（n-1）次方
          if (_cond === "weeks") {
            const n = 7 - 1;
            const apyT = 1 + element.apy / 365;
            const t = Math.pow(apyT, n);
            const val = (element.apy * t * 100).toFixed(3);
            const valT = val;
            const dayT = element.created_at.toString();
            let objT = { date: dayT, value: valT };
            objT.value = valT;
            objT.date = dayT;
            setTotal2(val);
            xLabelP2.push(i);
            goToSchoolP2.push(objT);
            return;
          }
          if (_cond === "months") {
            const n = 30 - 1;
            const apyT = 1 + element.apy / 365;
            const t = Math.pow(apyT, n);
            const val = (element.apy * t * 100).toFixed(3);
            const valT = val;
            const dayT = element.created_at.toString();
            let objT = { date: dayT, value: valT };
            objT.value = valT;
            objT.date = dayT;
            setTotal2(val);
            xLabelP2.push(i);
            goToSchoolP2.push(objT);
            return;
          }
          if (_cond === "years") {
            const n = 365 - 1;
            const apyT = 1 + element.apy / 365;
            const t = Math.pow(apyT, n);
            const val = (element.apy * t * 100).toFixed(3);
            const valT = val;
            const dayT = element.created_at.toString();
            let objT = { date: dayT, value: valT };
            objT.value = valT;
            objT.date = dayT;
            setTotal2(val);
            xLabelP2.push(i);
            goToSchoolP2.push(objT);
            return;
          }
          if (_cond === "5years") {
            const n = 365 * 5 - 1;
            const apyT = 1 + element.apy / 365;
            const t = Math.pow(apyT, n);
            const val = (element.apy * t * 100).toFixed(3);
            const valT = val;
            const dayT = element.created_at.toString();
            let objT = { date: dayT, value: valT };
            objT.value = valT;
            objT.date = dayT;
            setTotal2(val);
            xLabelP2.push(i);
            goToSchoolP2.push(objT);
            return;
          }
        }
      );

      const myChartT = echarts.getInstanceByDom(
        document.getElementById("main2") as HTMLElement
      );
      var optionT = (myChartT as any).getOption();
      optionT.series[0].data = goToSchoolP2;
      optionT.xAxis.data = xLabelP2;
      (myChartT as any).setOption(optionT);
      return;
    }
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
          //const totalxcfxs = element.totalxcfxs;
          const xcfxvalues = element.xcfxvalues;
          const valT = xcfxvalues;
          const dayT = element.created_at.toString();
          let objT = { date: dayT, value: valT };
          objT.value = valT;
          objT.date = dayT;
          xLabelP3.push(i);
          goToSchoolP3.push(objT);
        }
      );

      const myChartT = echarts.getInstanceByDom(
        document.getElementById("main4") as HTMLElement
      );
      var optionT = (myChartT as any).getOption();
      optionT.series[0].data = goToSchoolP3;
      optionT.xAxis.data = xLabelP3;
      (myChartT as any).setOption(optionT);
      return;
    }
    if (chart === 4) {
      setChart4Tab(index);
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
          const totalxcfxs = element.totalxcfxs;
          const valT = totalxcfxs;
          const dayT = element.created_at.toString();
          let objT = { date: dayT, value: valT };
          objT.value = valT;
          objT.date = dayT;
          xLabelP4.push(i);
          goToSchoolP4.push(objT);
        }
      );

      const myChartT = echarts.getInstanceByDom(
        document.getElementById("main3") as HTMLElement
      );
      var optionT = (myChartT as any).getOption();
      optionT.series[0].data = goToSchoolP4;
      optionT.xAxis.data = xLabelP4;
      (myChartT as any).setOption(optionT);
      return;
    }
    if (chart === 9) {
      setChart9Tab(index);
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
          const totalxcfxs = element.totalxcfxs;
          const xcfxvalues = element.xcfxvalues;
          const x = new BigNumber(totalxcfxs);
          const y = new BigNumber(xcfxvalues);
          const totalvalues = x.multipliedBy(y);
          const valT = BigNumber(totalvalues * element.price).toFixed(2);
          const dayT = element.created_at.toString();
          if (i % 2 === 0) {
          }
          let objT = { date: dayT, value: valT };
          objT.value = valT;
          objT.date = dayT;
          goToSchool2.push(objT);
          xLabel2.push(i);
          xDate2.push(dayT);
          //console.log(dayT);
        }
      );

      const myChartT = echarts.getInstanceByDom(
        document.getElementById("main5") as HTMLElement
      );
      var optionT = (myChartT as any).getOption();
      optionT.series[0].data = goToSchool2;
      optionT.xAxis.data = xLabel2;
      (myChartT as any).setOption(optionT);
      return;
    }
  }

  const resizeRef = useRef<HTMLDivElement>(null);
  const resizeChange = () => {
    myChart?.resize();
    myChart2?.resize();
    myChart3?.resize();
    myChart4?.resize();
    myChart5?.resize();
  };

  const warning = () => {
    Modal.warning({
      wrapClassName: styles.zzzz,
      bodyStyle: { backgroundColor: "#393942", color: "#ffffff" },
      content: 'Fluent Or MetaMask Not Install',
    });
  };

  useEffect(() => {
    // 监听
    window.addEventListener("resize", resizeChange);
    (async () => {
      /*const yesterday = await getYesterday("");
      // console.log(yesterday); // 昨日收盘价
      const element = yesterday.data.rows[0];
      const totalxcfxs = element.totalxcfxs;
      const xcfxvalues = element.xcfxvalues;
      const x = new BigNumber(totalxcfxs);
      const y = new BigNumber(xcfxvalues);
      const totalvalues = x.multipliedBy(y);
      const val = BigNumber(totalvalues * element.price).toFixed(2);

      const apy2 = 1 + element.apy / 365;
      const t = Math.pow(apy2, 1); // n的值

      setXcfxvalues(xcfxvalues);
      console.log(val);*/

      const res = await getStatistics("");
      goToSchool = [];
      xLabel = [];
      goToSchoolP2 = [];
      xLabelP2 = [];
      goToSchoolP3 = [];
      xLabelP3 = [];
      goToSchoolP4 = [];
      xLabelP4 = [];
      res.data.rows.reverse().forEach(
        (
          element: {
            nut2: any;
            nut1: any;
            created_at: any;
            apy: any;
            price: any;
            xcfxvalues: any;
            totalxcfxs: string;
          },
          i: any
        ) => {
          const totalxcfxs = element.totalxcfxs;
          const xcfxvalues = element.xcfxvalues;
          const price = element.price;
          const x = new BigNumber(totalxcfxs);
          const y = new BigNumber(xcfxvalues);
          const p = new BigNumber(price);
          const totalvalues = x.multipliedBy(y);
          const val = BigNumber(totalvalues.multipliedBy(p)).toFixed(10);
          console.log(price);
          setTotal1(BigNumber(totalvalues.multipliedBy(p)).toFixed(2));
          // const val = BigNumber(totalvalues * p).toFixed(10);
          // setTotal1(BigNumber(totalvalues * p).toFixed(2));
          setXcfxvalues(xcfxvalues);

          if (i === 0) {
            // 收盘价
            setClosingPrice1(val);
            setClosingPrice2((element.apy * 100).toFixed(2));
            setClosingPrice3(x);
            setClosingPrice4(y);
          }

          if (i === res.data.rows.length - 1) {
            const val6 = BigNumber((element.nut1 / element.nut2) * p).toFixed(
              4
            );
            setNutPrice(val6);
          }

          if (i % 2 === 1) {
            const val1 = val;
            const day1 = element.created_at.toString();
            let obj1 = { date: day1, value: val1 };
            obj1.value = val1;
            obj1.date = day1;
            goToSchool.push(obj1);
            xLabel.push("");

            const apy2 = 1 + element.apy / 365;
            const t = Math.pow(apy2, 1); // n的值
            setTotal2(parseFloat((element.apy * 100).toString()).toFixed(3));
            const val2 = parseFloat((element.apy * 100).toString()).toFixed(3);
            const day2 = element.created_at.toString();
            let obj2 = { date: day2, value: val2 };
            obj2.value = val2;
            obj2.date = day2;
            goToSchoolP2.push(obj2);
            xLabelP2.push("");

            setTotal3(x);
            const val3 = x.toString();
            const day3 = element.created_at.toString();
            let obj3 = { date: day3, value: val3 };
            obj3.value = val3;
            obj3.date = day3;
            goToSchoolP3.push(obj3);
            xLabelP3.push("");

            setTotal4(y.toFixed(3));
            const val4 = y.toString();
            const day4 = element.created_at.toString();
            let obj4 = { date: day4, value: val4 };
            obj4.value = val4;
            obj4.date = day4;
            goToSchoolP4.push(obj4);
            xLabelP4.push("");
          }
        }
      );

      //console.log(goToSchoolP4);

      let option0 = {
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
                    color: "rgba(126,199,255,0)", // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "rgba(126,199,255,0)", // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(126,199,255,0)", // 100% 处的颜色
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
                '<div style="display:inline-block;padding:0 5px;border-radius:10px;height:30px;width:100%;background-color:#000;color:#fff"><div style="font-size:12px;color:#999">Total Value Locked</div>' +
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
          top: "15%",
          left: "5%",
          right: "5%",
          bottom: "20%",
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
                color: "rgba(255,255,255,0.2)",
              },
            },
            axisTick: {
              show: false,
            },
            data: xLabel,
          },
        ],
        yAxis: [
          {
            nameTextStyle: {
              color: "#7ec7ff",
              fontSize: 16,
              padding: 10,
            },
            min: function (value: { min: any }) {
              return value.min;
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "rgba(25,163,223,0)",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#233653",
              },
            },
            axisLabel: {
              show: false,

              color: "#7ec7ff",
              padding: 16,

              formatter: function (value: number) {
                if (value === 0) {
                  return value;
                }
                return "";
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: "line",
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: [3, 3],
            smooth: false,
            lineStyle: {
              width: 3,
              color: "#EAB966", // 线条颜色
              borderColor: "rgba(0,0,0,.0)",
            },
            itemStyle: {
              color: "rgba(234, 185, 102, .6)",
              borderColor: "#646ace",
              borderWidth: 0,
            },

            areaStyle: {
              //区域填充样式

              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(234, 185, 102, .3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(234, 185, 102, 0)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(234, 185, 102, 0.5)", //阴影颜色
              shadowBlur: 0, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            },
            data: goToSchool,
          },
        ],
      };
      let option2 = {
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
                    color: "rgba(126,199,255,0)", // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "rgba(126,199,255,0)", // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(126,199,255,0)", // 100% 处的颜色
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
                '<div style="display:inline-block;padding:0 5px;border-radius:10px;height:30px;width:100%;background-color:#000;color:#fff"><div style="font-size:12px;color:#999">APY</div>' +
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
          top: "15%",
          left: "5%",
          right: "5%",
          bottom: "20%",
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
                color: "rgba(255,255,255,0.2)",
              },
            },
            axisTick: {
              show: false,
            },
            data: xLabel,
          },
        ],
        yAxis: [
          {
            nameTextStyle: {
              color: "#7ec7ff",
              fontSize: 16,
              padding: 10,
            },
            min: function (value: { min: any }) {
              return value.min - 0.03; //  - 0.0008
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "rgba(25,163,223,0)",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#233653",
              },
            },
            axisLabel: {
              show: false,

              color: "#7ec7ff",
              padding: 16,

              formatter: function (value: number) {
                if (value === 0) {
                  return value;
                }
                return "";
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: "line",
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: [3, 3],
            smooth: false,
            lineStyle: {
              width: 3,
              color: "#EAB966", // 线条颜色
              borderColor: "rgba(0,0,0,.0)",
            },
            itemStyle: {
              color: "rgba(234, 185, 102, .6)",
              borderColor: "#646ace",
              borderWidth: 0,
            },

            areaStyle: {
              //区域填充样式

              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(234, 185, 102, .3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(234, 185, 102, 0)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(234, 185, 102, 0.5)", //阴影颜色
              shadowBlur: 0, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            },
            data: goToSchoolP2,
          },
        ],
      };
      let option3 = {
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
                    color: "rgba(126,199,255,0)", // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "rgba(126,199,255,0)", // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(126,199,255,0)", // 100% 处的颜色
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
                '<div style="display:inline-block;padding:0 5px;border-radius:10px;height:30px;width:100%;background-color:#000;color:#fff"><div style="font-size:12px;color:#999">xCFX minted</div>' +
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
          top: "15%",
          left: "5%",
          right: "5%",
          bottom: "20%",
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
                color: "rgba(255,255,255,0.2)",
              },
            },
            axisTick: {
              show: false,
            },
            data: xLabel,
          },
        ],
        yAxis: [
          {
            nameTextStyle: {
              color: "#7ec7ff",
              fontSize: 16,
              padding: 10,
            },
            min: function (value: { min: any }) {
              return value.min - 1500;
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "rgba(25,163,223,0)",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#233653",
              },
            },
            axisLabel: {
              show: false,

              color: "#7ec7ff",
              padding: 16,

              formatter: function (value: number) {
                if (value === 0) {
                  return value;
                }
                return "";
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: "line",
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: [3, 3],
            smooth: false,
            lineStyle: {
              width: 3,
              color: "#EAB966", // 线条颜色
              borderColor: "rgba(0,0,0,.0)",
            },
            itemStyle: {
              color: "rgba(234, 185, 102, .6)",
              borderColor: "#646ace",
              borderWidth: 0,
            },

            areaStyle: {
              //区域填充样式

              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(234, 185, 102, .3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(234, 185, 102, 0)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(234, 185, 102, 0.5)", //阴影颜色
              shadowBlur: 0, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            },
            data: goToSchoolP3,
          },
        ],
      };
      let option4 = {
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
                    color: "rgba(126,199,255,0)", // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "rgba(126,199,255,0)", // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(126,199,255,0)", // 100% 处的颜色
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
                '<div style="display:inline-block;padding:0 5px;border-radius:10px;height:30px;width:100%;background-color:#000;color:#fff"><div style="font-size:12px;color:#999">xCFX value</div>' +
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
          top: "15%",
          left: "5%",
          right: "5%",
          bottom: "20%",
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
                color: "rgba(255,255,255,0.2)",
              },
            },
            axisTick: {
              show: false,
            },
            data: xLabel,
          },
        ],
        yAxis: [
          {
            nameTextStyle: {
              color: "#7ec7ff",
              fontSize: 16,
              padding: 10,
            },
            min: function (value: { min: any }) {
              return value.min - 0.01;
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "rgba(25,163,223,0)",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#233653",
              },
            },
            axisLabel: {
              show: false,

              color: "#7ec7ff",
              padding: 16,

              formatter: function (value: number) {
                if (value === 0) {
                  return value;
                }
                return "";
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: "line",
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: [3, 3],
            smooth: false,
            lineStyle: {
              width: 3,
              color: "#EAB966", // 线条颜色
              borderColor: "rgba(0,0,0,.0)",
            },
            itemStyle: {
              color: "rgba(234, 185, 102, .6)",
              borderColor: "#646ace",
              borderWidth: 0,
            },

            areaStyle: {
              //区域填充样式

              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(234, 185, 102, .3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(234, 185, 102, 0)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(234, 185, 102, 0.5)", //阴影颜色
              shadowBlur: 0, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            },
            data: goToSchoolP4,
          },
        ],
      };

      //const res2 = await getStatisticsMore("");
      goToSchool2 = [];
      xLabel2 = [];
      xDate2 = [];
      res.data.rows.forEach(
        (
          element: {
            apy: number;
            price: any;
            xcfxvalues: any;
            totalxcfxs: string;
            created_at: any;
          },
          i: any
        ) => {
          const totalxcfxs = element.totalxcfxs;
          const xcfxvalues = element.xcfxvalues;
          const x = new BigNumber(totalxcfxs);
          const y = new BigNumber(xcfxvalues);
          const totalvalues = x.multipliedBy(y);
          const val = BigNumber(totalvalues * element.price).toFixed(2);
          const day = element.created_at.toString();
          if (i % 2 === 0) {
            let obj = { date: day, value: val };
            obj.value = val;
            obj.date = day;
            goToSchool2.push(obj);
            xLabel2.push("");
            xDate2.push(day);
          }
        }
      );

      let optionL = {
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
                '<div style="display:inline-block;padding:0 5px;border-radius:10px;height:30px;width:100%;background-color:#000;color:#fff"><div style="font-size:12px;color:#999">Total Value Locked</div>' +
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
          top: "0%",
          left: "5%",
          right: "5%",
          bottom: "25%",
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
              show: true,
              lineStyle: {
                color: "rgba(255,255,255,0.4)",
              },
            },
            axisTick: {
              show: false,
            },
            data: xLabel2,
          },
        ],
        yAxis: [
          {
            nameTextStyle: {
              color: "#7ec7ff",
              fontSize: 16,
              padding: 10,
            },
            min: function (value: { min: any }) {
              return value.min;
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "rgba(25,163,223,0)",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#233653",
              },
            },
            axisLabel: {
              show: false,

              color: "#7ec7ff",
              padding: 16,

              formatter: function (value: number) {
                if (value === 0) {
                  return value;
                }
                return "";
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: "line",
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            lineStyle: {
              width: 3,
              color: "#fff", // 线条颜色

              borderColor: "rgba(0,0,0,.0)",
            },
            itemStyle: {
              color: "rgba(234, 185, 102, .6)",
              borderColor: "#646ace",
              borderWidth: 0,
            },

            areaStyle: {
              //区域填充样式

              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(255, 255, 255, .9)",
                  },
                  {
                    offset: 1,
                    color: "rgba(255, 255, 255, 0)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(255, 255, 255, 0.5)", //阴影颜色
              shadowBlur: 0, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            },
            data: goToSchool2,
          },
        ],
      };

      setTimeout(async () => {
        try {
          myChart = echarts.init(
            document.getElementById("main") as HTMLElement
          );
          // 绘制图表1
          myChart.setOption(option0);
          myChart2 = echarts.init(
            document.getElementById("main2") as HTMLElement
          );
          // 绘制图表2
          myChart2.setOption(option2);
          myChart3 = echarts.init(
            document.getElementById("main3") as HTMLElement
          );
          // 绘制图表3
          myChart3.setOption(option3);

          myChart4 = echarts.init(
            document.getElementById("main4") as HTMLElement
          );
          // 绘制图表4
          myChart4.setOption(option4);

          myChart5 = echarts.init(
            document.getElementById("main5") as HTMLElement
          );
          myChart5.setOption(optionL);

          (document.getElementById("homebox") as any).style.display = "none";
        } catch (error) { }
      }, 500);

      const nutbalance = await nutContract.balanceOf(addressPool);
      const nutbalanceCFX: any = new Drip(nutbalance).toCFX();
      setNutSupply((300000 - nutbalanceCFX).toString());
      setCirculatingNUT(((300000 - nutbalanceCFX) / 3000).toString());      
    })();

    setTimeout(() => {
      (document.getElementById("homebox") as any).style.display = "block";
      (document.getElementById("welhome") as any).style.display = "none";
    }, 4000);
  }, []);
  // /public/js/index.js <script src="/js/index.js?r=3"></script>
  return (
    <div ref={resizeRef}>
      <Helmet>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <title>Nucleon</title>
      </Helmet>
      <div id="welhome" className={styles.welhome} style={{
        position: "fixed",
        left: "0",
        top: "0",
        right: "0",
        bottom: "0",
        width: "100%",
        height: "160%",
        backgroundColor: "#181623",
        zIndex: "90000"
      }}>
        <video
          src={logomp4}
          style={{
            width: "100%",
          }}
          muted={true}
          autoPlay
          loop={true}
        ></video>
      </div>
      <div className={styles.menus} style={{ display: showMenu }}>
        <img
          className={styles.logoimg}
          src={logo}
          style={{
            position: "absolute",
            height: "30px",
            top: "20px",
            left: "45px",
          }}
        />
        <span
          style={{
            textAlign: "right",
            display: "block",
            fontSize: "20px",
            margin: "25px 20px 50px",
          }}
          onClick={() => {
            hideMeun();
          }}
        >
          X
        </span>
        <div>
          <a style={{ color: "##C4C4C4" }} target={"_blank"} href="https://docs.nucleon.network/">
            Documentation
          </a>
        </div>
        <div onClick={onToP11}>Community</div>
        <div onClick={onToP22}>Analytics</div>

        <div
          style={{
            padding: "10px 40px 0",
            position: "absolute",
            bottom: "30px",
          }}
        >
          <a target={"_blank"} href="https://github.com/article-i/nucleon">
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
          <a target={"_blank"} href="https://nucleon-official.medium.com">
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
      </div>
      <div className={styles.nav}>
        <Row className={styles.inner}>
          <Col xs={6} sm={6} md={8} lg={8} xl={8}>
            <img className={styles.logoimg} src={logo} height="30px" />
            <img className={styles.logotxt} src={logotxt} height="16px" />
          </Col>
          <Col xs={18} sm={18} md={16} lg={16} xl={16}>
            <img
              className={styles.s2 + " " + styles.menu}
              src={menu}
              height="20px"
              onClick={() => {
                showMeun();
              }}
            />
            <ul className={styles.hide}>
              <li>
                <a target={"_blank"} href="https://docs.nucleon.network/">
                  Documentation
                </a>
              </li>

              <li>
                <a href="/#/" onClick={onToP1}>Community</a>
              </li>
              <li>
                <a href="/#/" onClick={onToP2}>Analytics</a>
              </li>
              <li>
                <Link to="/" style={{ color: "#EAB966" }}>
                  <div>
                    {status !== "in-detecting" && status !== "active" && (
                      <div>
                        <div onClick={connect}>
                          {status === "in-activating" && "connecting..."}
                        </div>
                        <div onClick={connect}>
                          {status === "not-active" && "Connect Wallet"}
                        </div>
                        <div onClick={warning}>
                          {status === "not-installed" && "Connect Wallet"}
                        </div>
                      </div>
                    )}
                    {status === "active" && <WalletInfo />}
                  </div>
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
      <div className={styles.homebg}></div>
      <div id="homebox" className={styles.homebox} style={{ padding: "0 20px" }}>
        <h2>
          Unlocking Liquidity
          <br />
          for Staked Assets
        </h2>
        <div className={styles.btnbox}>
          <div className={styles.btn}>
            <Link to="/data/stake">
              <Button shape="round" className={styles.custom}>
                Launch App
              </Button>
            </Link>
          </div>
        </div>
        <div
          className={styles.inner}
          style={{ padding: "420px 0 0", marginTop: "290px" }}
        >
          <div className={styles.chart}>
            <Row gutter={32} className={styles.mobile1}>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <div
                  className={styles.chartbg}
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "95%",
                      height: "290px",
                      margin: "0 0 80px",
                    }}
                  >
                    <div style={{ padding: "20px 10px 0", color: "#fff" }}>
                      <Row>
                        <Col span={12} style={{ fontSize: "20px" }}>
                          TVL
                        </Col>
                        <Col span={12} className={styles.tit1}>
                          ${total1.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Col>
                      </Row>
                    </div>
                    <div className={styles.price}>
                      {parseFloat(total1) - parseFloat(closingPrice1) > 0 ? (
                        <img className={styles.updown} src={up} />
                      ) : (
                        <img className={styles.updown} src={down} />
                      )}
                      $
                      {Math.abs(
                        parseFloat(closingPrice1) - parseFloat(total1)
                      ).toFixed(2)}
                    </div>
                    <div
                      className={styles.main}
                      style={{ height: "160px", width: "105%" }}
                      id="main"
                    ></div>
                    <div
                      style={{
                        width: "100%",
                        paddingLeft: "7%",
                        paddingTop: "8px",
                      }}
                    >
                      <Row>
                        <Col span={4}>
                          <div
                            style={
                              chart1Tab === 0
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(1, "", 0);
                            }}
                          >
                            1D
                          </div>
                        </Col>
                        <Col span={4} offset={1}>
                          <div
                            style={
                              chart1Tab === 1
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(1, "weeks", 1);
                            }}
                          >
                            1W
                          </div>
                        </Col>
                        <Col span={4} offset={1}>
                          <div
                            style={
                              chart1Tab === 2
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(1, "months", 2);
                            }}
                          >
                            1M
                          </div>
                        </Col>
                        <Col span={4} offset={1}>
                          <div
                            style={
                              chart1Tab === 3
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(1, "years", 3);
                            }}
                          >
                            1Y
                          </div>
                        </Col>
                        <Col span={4} offset={1}>
                          <div
                            style={
                              chart1Tab === 4
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(1, "years", 4);
                            }}
                          >
                            5Y
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <div
                  className={styles.chartbg}
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "95%",
                      height: "290px",
                      margin: "0 0 80px",
                    }}
                  >
                    <div style={{ padding: "20px 10px 0", color: "#fff" }}>
                      <Row>
                        <Col span={12} style={{ fontSize: "20px" }}>
                          APY
                        </Col>
                        <Col span={12} className={styles.tit1}>
                          {total2.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%
                        </Col>
                      </Row>
                    </div>
                    <div className={styles.price}>
                      {parseFloat(total2) - parseFloat(closingPrice2) > 0 ||
                        parseFloat(total2) - parseFloat(closingPrice2) === 0 ? (
                        <img className={styles.updown} src={up} />
                      ) : (
                        <img className={styles.updown} src={down} />
                      )}
                      {Math.abs(
                        parseFloat(total2) - parseFloat(closingPrice2)
                      ).toFixed(2)}
                      %
                    </div>
                    <div
                      className={styles.main}
                      style={{ height: "160px", width: "105%" }}
                      id="main2"
                    ></div>
                    <div
                      style={{
                        width: "100%",
                        paddingLeft: "6%",
                        paddingTop: "8px",
                      }}
                    >
                      <Row>
                        <Col span={4}>
                          <div
                            style={
                              chart2Tab === 0
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(2, "", 0);
                            }}
                          >
                            1D
                          </div>
                        </Col>
                        <Col span={4} offset={1}>
                          <div
                            style={
                              chart2Tab === 1
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(2, "weeks", 1);
                            }}
                          >
                            1W
                          </div>
                        </Col>
                        <Col span={4} offset={1}>
                          <div
                            style={
                              chart2Tab === 2
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(2, "months", 2);
                            }}
                          >
                            1M
                          </div>
                        </Col>
                        <Col span={4} offset={1}>
                          <div
                            style={
                              chart2Tab === 3
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(2, "years", 3);
                            }}
                          >
                            1Y
                          </div>
                        </Col>
                        <Col span={4} offset={1}>
                          <div
                            style={
                              chart2Tab === 4
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(2, "5years", 4);
                            }}
                          >
                            5Y
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <div
                  className={styles.chartbg}
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "95%",
                      height: "290px",
                      margin: "0 0 80px",
                    }}
                  >
                    <div style={{ padding: "20px 10px 0", color: "#fff" }}>
                      <Row>
                        <Col span={12} style={{ fontSize: "20px" }}>
                          xCFX
                          <span
                            style={{
                              fontSize: "12px",
                              fontFamily: "Univa Nova Regular",
                              color: "#ffffff8a",
                            }}
                          >
                            <span className={styles.auxiliary}>value</span>
                          </span>
                        </Col>
                        <Col span={12} className={styles.tit1}>
                          {total4} CFX
                        </Col>
                      </Row>
                    </div>
                    <div className={styles.price}>
                      {parseFloat(total4) - parseFloat(closingPrice4) >= 0 ? (
                        <img className={styles.updown} src={up} />
                      ) : (
                        <img className={styles.updown} src={down} />
                      )}
                      {Math.abs(
                        parseFloat(total4) - parseFloat(closingPrice4)
                      ).toFixed(2)}
                    </div>
                    <div
                      className={styles.main}
                      style={{ height: "160px", width: "105%" }}
                      id="main4"
                    ></div>
                    <div
                      style={{
                        position: "absolute",
                        width: "110%",
                        left: "27px",
                        bottom: "28px",
                      }}
                    >
                      <Row>
                        <Col span={4}>
                          <div
                            style={
                              chart3Tab === 0
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(3, "", 0);
                            }}
                          >
                            1D
                          </div>
                        </Col>
                        <Col span={4}>
                          <div
                            style={
                              chart3Tab === 1
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(3, "weeks", 1);
                            }}
                          >
                            1W
                          </div>
                        </Col>
                        <Col span={4}>
                          <div
                            style={
                              chart3Tab === 2
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(3, "months", 2);
                            }}
                          >
                            1M
                          </div>
                        </Col>
                        <Col span={4}>
                          <div
                            style={
                              chart3Tab === 3
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(3, "years", 3);
                            }}
                          >
                            1Y
                          </div>
                        </Col>
                        <Col span={4}>
                          <div
                            style={
                              chart3Tab === 4
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(3, "5years", 4);
                            }}
                          >
                            5Y
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <div
                  className={styles.chartbg}
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "95%",
                      height: "290px",
                      margin: "0 0 80px",
                    }}
                  >
                    <div style={{ padding: "20px 10px 0", color: "#fff" }}>
                      <Row>
                        <Col span={12} style={{ fontSize: "20px" }}>
                          xCFX
                          <span
                            style={{
                              fontSize: "12px",
                              fontFamily: "Univa Nova Regular",
                              color: "#ffffff8a",
                            }}
                          >
                            <span className={styles.auxiliary}>minted</span>
                          </span>
                        </Col>
                        <Col span={12} className={styles.tit1}>
                          {parseFloat(total3)
                            .toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Col>
                      </Row>
                    </div>
                    <div className={styles.price}>
                      {parseFloat(total3) - parseFloat(closingPrice3) >= 0 ? (
                        <img className={styles.updown} src={up} />
                      ) : (
                        <img className={styles.updown} src={down} />
                      )}
                      {Math.abs(
                        parseFloat(closingPrice3) - parseFloat(total3)
                      ).toFixed(2)}
                    </div>
                    <div
                      className={styles.main}
                      style={{ height: "160px", width: "105%" }}
                      id="main3"
                    ></div>
                    <div
                      style={{
                        position: "absolute",
                        width: "110%",
                        left: "27px",
                        bottom: "28px",
                      }}
                    >
                      <Row>
                        <Col span={4}>
                          <div
                            style={
                              chart4Tab === 0
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(4, "", 0);
                            }}
                          >
                            1D
                          </div>
                        </Col>
                        <Col span={4}>
                          <div
                            style={
                              chart4Tab === 1
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(4, "weeks", 1);
                            }}
                          >
                            1W
                          </div>
                        </Col>
                        <Col span={4}>
                          <div
                            style={
                              chart4Tab === 2
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(4, "months", 2);
                            }}
                          >
                            1M
                          </div>
                        </Col>
                        <Col span={4}>
                          <div
                            style={
                              chart4Tab === 3
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(4, "years", 3);
                            }}
                          >
                            1Y
                          </div>
                        </Col>
                        <Col span={4}>
                          <div
                            style={
                              chart4Tab === 4
                                ? {
                                  background: " #EAB966",
                                  borderRadius: "7px",
                                }
                                : {}
                            }
                            className={styles.group}
                            onClick={() => {
                              getCharts(4, "years", 4);
                            }}
                          >
                            5Y
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <Row>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className={styles.box4m1}>
                <div className={styles.box2}>
                  <Row style={{ padding: "0 30px 0 0" }}>
                    <Col span={12}>
                      <div className={styles.tit}>
                        Stake CFX <br />
                        <span className={styles.auxiliary}>to Unlock xCFX</span>
                      </div>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <img className={styles.coin1} src={logo8} height="80px" />
                    </Col>
                  </Row>
                  <Row className={styles.box4}>
                    <Col span={12}>Exchange Rate </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      1 xCFX = ~{parseFloat(xcfxvalues).toFixed(3)}CFX
                    </Col>
                    <Col span={12}>Estimated Transaction Fee</Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      ~0.001 CFX
                    </Col>
                    <Col span={12}>Nucleon Service Fee</Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      10%
                    </Col>
                  </Row>
                  <Row style={{ padding: "0 50px 0 37px" }} gutter={22}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Link to="/data/stake">
                        <Button className={styles.btn}>Stake</Button>
                      </Link>
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
                        href="https://doc.nucleon.network"
                        className={styles.btn + " " + styles.linkbtn}
                      >
                        Learn More
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className={styles.box4m2}>
                <div className={styles.box2}>
                  <Row style={{ padding: "0 30px 0 0" }}>
                    <Col span={12}>
                      <div className={styles.tit}>
                        Stake LPs <br />
                        <span className={styles.auxiliary}>to Unlock NUT</span>
                      </div>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <img className={styles.coin2} src={yuan} />
                    </Col>
                  </Row>
                  <Row className={styles.box4}>
                    <Col span={8}>Available To Stake:</Col>
                    <Col span={16} style={{ textAlign: "right" }}>
                      LPs of NUT & xCFX
                    </Col>
                    <Col span={12}>Total Amount Of NUT Staked:</Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      300,000
                    </Col>
                    <Col span={12}>NUT Circulating Supply:</Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      {parseFloat(nutSupply).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </Col>
                  </Row>
                  <Row style={{ padding: "0 50px 0 37px" }} gutter={22}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Link to="/data/pools">
                        <Button className={styles.btn}>Stake</Button>
                      </Link>
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
                        href="https://doc.nucleon.network/about-nucleon/tokenomics"
                        className={styles.btn + " " + styles.linkbtn}
                      >
                        Learn More
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col
              className={styles.hide}
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              style={{ position: "relative" }}
            >
              <img src={phone} style={{ width: "100%" }} />

              <video
                src={logomp4}
                style={{
                  position: "absolute",
                  left: "36%",
                  top: "200px",
                  width: "40%",
                }}
                muted={true}
                autoPlay
                loop={true}
              ></video>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              style={{ textAlign: "left" }}
            >
              <h3>Welcome To Nucleon</h3>
              <div className={styles.p}>
                Nucleon is a liquid staking solution for Conflux PoS. Nucleon enables users to stake CFX without the overhead of illiquid assets. Users can enjoy liquidity while remaining secure, earning interest, and accessing the broader DeFi ecosystem.
              </div>
              <div className={styles.p}>
                Nucleon's goal is to solve the problems associated with Conflux PoS staking - liquidity, immovability, and accessibility - by making staked CFX liquid. Nucleon aims to open PoS participation with flexible amounts of CFX to improve the security of the Conflux Network.
              </div>
              <div className={styles.learn}>
                <a
                  href="https://docs.nucleon.network/about-nucleon/overview"
                  target={"_blank"}
                >
                  Learn More <img src={learn} />
                </a>
              </div>
            </Col>
          </Row>
          <Row className={styles.brief + " " + styles.hide}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div className={styles.tit3}>Reliable Network</div>
              <div className={styles.txt}>
                Powered by Conflux Network <br />
                hybrid POW and POS consensus
              </div>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div className={styles.tit3}>High Liquidity</div>
              <div className={styles.txt}>
                xCFX can be swapped and Collateralized
              </div>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div className={styles.tit3}>Assets Compound</div>
              <div className={styles.txt}>
                CFX in Nucleon’s POS pool will compound automatically
              </div>
            </Col>
          </Row>
          <div className={styles.showm}>
            <Carousel autoplay className={styles.carousebox}>
              <div>
                <div className={styles.carouse}>
                  <div className={styles.tit3}>Reliable Network</div>
                  <div className={styles.txt}>
                    Powered by Conflux Network’s POW/POS hybrid consensus
                    mechanism
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.carouse}>
                  <div className={styles.tit3}>High Liquidity</div>
                  <div className={styles.txt}>
                    xCFX can be swapped and Collateralized
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.carouse}>
                  <div className={styles.tit3}>Assets Compound</div>
                  <div className={styles.txt}>
                    CFX in Nucleon’s POS pool will compound automatically
                  </div>
                </div>
              </div>
            </Carousel>
          </div>
          <a id="analytics"></a>
          <h4>Nucleon Analytics</h4>
          <div className={styles.analytics}>
            <Row gutter={16}>
              <Col xs={12} sm={12} md={14} lg={14} xl={14}>
                <div className={styles.item} style={{ padding: "35px 0 0" }}>
                  <div className={styles.t}>
                    ${total1.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </div>
                  <div className={styles.v}>Total Value Locked</div>
                  <div className={styles.line}></div>
                  <Row>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className={styles.t}>{parseFloat(circulatingNUT).toFixed(1)}%</div>
                      <div className={styles.v}>Circulating NUT</div>
                      <div className={styles.line + " " + styles.showm}></div>
                    </Col>
                    <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                      <div className={styles.t}>
                        {parseFloat(nutPrice).toFixed(3)} USDT
                      </div>
                      <div className={styles.v}>NUT Value</div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                <div className={styles.item} style={{ padding: "30px" }}>
                  <div
                    className={styles.v}
                    style={{ textAlign: "left", margin: "0" }}
                  >
                    Current Value
                  </div>
                  <div
                    style={{ fontSize: "24px", textAlign: "left" }}
                    className={styles.t}
                  >
                    xCFX
                  </div>
                  <div className={styles.circle}>
                    <b className={styles.num}>{total4}</b>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.item2} style={{ textAlign: "left" }}>
                  <div style={{ padding: "20px" }}>
                    <div
                      className={
                        chart9Tab === 0
                          ? styles.sel + " " + styles.act
                          : styles.sel
                      }
                      onClick={() => {
                        getCharts(9, "", 0);
                      }}
                    >
                      Day
                    </div>
                    <div
                      className={
                        chart9Tab === 1
                          ? styles.sel + " " + styles.act
                          : styles.sel
                      }
                      onClick={() => {
                        getCharts(9, "weeks", 1);
                      }}
                    >
                      Week
                    </div>
                    <div
                      className={
                        chart9Tab === 2
                          ? styles.sel + " " + styles.act
                          : styles.sel
                      }
                      onClick={() => {
                        getCharts(9, "months", 2);
                      }}
                    >
                      Month
                    </div>
                    <div
                      className={
                        chart9Tab === 3
                          ? styles.sel + " " + styles.act
                          : styles.sel
                      }
                      onClick={() => {
                        getCharts(9, "years", 3);
                      }}
                    >
                      Year
                    </div>
                    <span style={{ float: "right", marginRight: "27px", color: "#fff" }}>Nucleon Platform – TVL</span>
                  </div>
                  <div
                    className={styles.main5}
                    style={{ height: "200px", width: "100%" }}
                    id="main5"
                  ></div>
                </div>
              </Col>
            </Row>
            <a id="Joinourcommunity"></a>
          </div>

          <h4>Join Our Community</h4>
          <p className={styles.h4des}>
            Stay connected with us and never miss any interaction with our
            people.
          </p>
          <Row style={{ textAlign: "center", color: "#fff", width: "70%", margin: "0 auto" }}>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className={styles.box3}>
                <a target="_blank" href="https://github.com/article-i/nucleon">
                  <Row>
                    <Col
                      xs={6}
                      sm={6}
                      md={10}
                      lg={10}
                      xl={10}
                      style={{ textAlign: "center" }}
                    >
                      <img src={logo4} className={styles.community} />
                    </Col>
                    <Col xs={18} sm={18} md={14} lg={14} xl={14}>
                      <h5>Github</h5>
                      <p><span style={{ color: "#fff" }}>@nucleon.space</span></p>
                    </Col>
                  </Row>
                </a>
              </div>
            </Col>
            <Col xs={12} sm={8} md={8} lg={8} xl={8} style={{ display: "none" }}>
              <div className={styles.box3}>
                <Row>
                  <Col
                    xs={6}
                    sm={6}
                    md={10}
                    lg={10}
                    xl={10}
                    style={{ textAlign: "center" }}
                  >
                    <img src={logo5} className={styles.community2} />
                  </Col>
                  <Col xs={18} sm={18} md={14} lg={14} xl={14}>
                    <h5>Discord</h5>
                    <p>@nucleon.space</p>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className={styles.box3}>
                <a target="_blank" href="https://twitter.com/OfficialNucleon">
                  <Row>
                    <Col
                      xs={6}
                      sm={6}
                      md={10}
                      lg={10}
                      xl={10}
                      style={{ textAlign: "center" }}
                    >
                      <img src={logo3} className={styles.community} />
                    </Col>
                    <Col xs={18} sm={18} md={14} lg={14} xl={14}>
                      <h5>Twitter</h5>
                      <p style={{ color: "#fff" }}>@nucleon.space</p>
                    </Col>
                  </Row>
                </a>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: "none" }}>
              <div className={styles.box3}>
                <Row>
                  <Col
                    xs={6}
                    sm={6}
                    md={10}
                    lg={10}
                    xl={10}
                    style={{ textAlign: "center" }}
                  >
                    <img src={logo1} className={styles.community} />
                  </Col>
                  <Col xs={18} sm={18} md={14} lg={14} xl={14}>
                    <h5>Reddit</h5>
                    <p>@nucleon.space</p>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className={styles.box3}>
                <a target="_blank" href="https://t.me/nucleonspace">
                  <Row>
                    <Col
                      xs={6}
                      sm={6}
                      md={10}
                      lg={10}
                      xl={10}
                      style={{ textAlign: "center" }}
                    >
                      <img src={logo2} className={styles.community} />
                    </Col>
                    <Col xs={18} sm={18} md={14} lg={14} xl={14}>
                      <h5>Telegram</h5>
                      <p style={{ color: "#fff" }}>@nucleon.space</p>
                    </Col>
                  </Row>
                </a>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className={styles.box3}>
                <a target="_blank" href="https://nucleon-official.medium.com/">
                  <Row>
                    <Col
                      xs={6}
                      sm={6}
                      md={10}
                      lg={10}
                      xl={10}
                      style={{ textAlign: "center" }}
                    >
                      <img src={logo6} className={styles.community2} />
                    </Col>
                    <Col xs={18} sm={18} md={14} lg={14} xl={14}>
                      <h5>Medium</h5>
                      <p style={{ color: "#fff" }}>@nucleon.space</p>
                    </Col>
                  </Row>
                </a>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
