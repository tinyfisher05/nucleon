import { useEffect, useRef, useState } from "react";
import { Link } from "umi";

import * as echarts from "echarts";
var moment = require("moment");

import styles from "./../../../layouts/index.less";
import style from "./index.less";

import "../../../locales/config"; // 引用配置文件
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

import { Button, Col, Row, Carousel, Checkbox } from "antd";
const { Drip } = require("js-conflux-sdk");
const { addressPool } = require("./../../../ABI/Pools.json");
const { addressExc, abiExc } = require("./../../../ABI/ExchangeRoom.json");
const { addressNut, abiNut } = require("./../../../ABI/Nut.json");
const { formatNumber} = require("../../../utils/tools.js");


// AJAX获取数据
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
  
  const [total1, setTotal1] = useState("");
  const [total2, setTotal2] = useState("");
  const [total3, setTotal3] = useState("");
  const [total4, setTotal4] = useState("");
  const [totalEmissionNUT, setTotalEmissionNUT] = useState("----");

  const [chart1Tab, setChart1Tab] = useState(0);
  const [chart2Tab, setChart2Tab] = useState(0);
  const [chart3Tab, setChart3Tab] = useState(0);
  const [chart4Tab, setChart4Tab] = useState(0);
  const [chart5Tab, setChart5Tab] = useState(0);
  const [chart6Tab, setChart6Tab] = useState(0);

  const provider = new ethers.providers.JsonRpcProvider(
    "https://evmtestnet.confluxrpc.com"
  );
  const excContract = new ethers.Contract(addressExc, abiExc, provider);
  const nutContract = new ethers.Contract(addressNut, abiNut, provider);

  const { t, i18n } = useTranslation();

  var myChart: echarts.ECharts,
    myChart2: echarts.ECharts,
    myChart3: echarts.ECharts,
    myChart4: echarts.ECharts,
    myChart5: echarts.ECharts,
    myChart6: echarts.ECharts;

  let xLabel1 = [""];
  let goToSchool1: { date: any; value: any }[] = [];

  let xLabel2 = [""];
  let goToSchool2: { date: any; value: any }[] = [];

  let xLabel3 = [""];
  let goToSchool3: { date: any; value: any }[] = [];

  let xLabel4 = [""];
  let goToSchool4: { date: any; value: any }[] = [];

  let xLabel5 = [""];
  let goToSchool5: { date: any; value: any }[] = [];

  let xLabel6 = [""];
  let goToSchool6: { date: any; value: any }[] = [];

  useEffect(() => {
    window.scrollTo(0, 0);
    // 监听
    //window.addEventListener("resize", resizeChange);
    (async () => {
    

      // 图1变量
      goToSchool1 = [];
      xLabel1 = [];
      goToSchool2 = [];
      xLabel2 = [];
      goToSchool3 = [];
      xLabel3 = [];
      goToSchool4 = [];
      xLabel4 = [];
      goToSchool5 = [];
      xLabel5 = [];
      goToSchool6 = [];
      xLabel6 = [];

      const res = await getStatistics("");
      res.data.rows.reverse().forEach(
        (
          element: {
            nut2: any;
            xcfx1: number;
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

          const val1 = val;
          const day1 = element.created_at.toString();
          let obj1 = { date: day1, value: val1 };
          goToSchool1.push(obj1);
          xLabel1.push("");

          const val2 = Drip(element.nut1 * 2 * p).toCFX();
          const day2 = element.created_at.toString();
          let obj2 = { date: day2, value: val2 };
          goToSchool2.push(obj2);
          xLabel2.push("");

          const val3 = Drip(element.xcfx1 * 2 * p).toCFX();
          const day3 = element.created_at.toString();
          let obj3 = { date: day3, value: val3 };
          goToSchool3.push(obj3);
          xLabel3.push("");

          const val4 = val;
          const day4 = element.created_at.toString();
          let obj4 = { date: day4, value: val4 };
          goToSchool4.push(obj4);
          xLabel4.push("");

          const val6 = BigNumber((element.nut1 / element.nut2) * p).toFixed(4);
          const day6 = element.created_at.toString();
          let obj6 = { date: day6, value: val6 };
          goToSchool6.push(obj6);
          xLabel6.push("");

          const val5 = y.multipliedBy(p).toString();
          const day5 = element.created_at.toString();
          let obj5 = { date: day5, value: val5 };
          xLabel5.push("");
          goToSchool5.push(obj5);
        }
      );

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
          top: "3%",
          left: "5%",
          right: "80px",
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
            data: xLabel1,
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
                return "$" + formatNumber(value.toFixed(0));
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
              color: "rgba(234, 185, 102, .6)",
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
            data: goToSchool1,
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
                '<div style="display:inline-block;padding:0 5px;border-radius:10px;height:30px;width:100%;background-color:#000;color:#fff"><div style="font-size:12px;color:#999">TVL-LP CFX/NUT</div>' +
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
          right: "80px",
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
            data: xLabel2,
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
              color: "rgba(234, 185, 102, .6)",
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
            data: goToSchool2,
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
                '<div style="display:inline-block;padding:0 5px;border-radius:10px;height:30px;width:100%;background-color:#000;color:#fff"><div style="font-size:12px;color:#999">TVL-LP CFX/xCFX</div>' +
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
          right: "80px",
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
            data: xLabel3,
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
              color: "rgba(234, 185, 102, .6)",
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
            data: goToSchool3,
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
          top: "3%",
          left: "5%",
          right: "80px",
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
            data: xLabel4,
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
              color: "rgba(234, 185, 102, .6)",
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
            data: goToSchool4,
          },
        ],
      };
      let option5 = {
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
          top: "3%",
          left: "5%",
          right: "80px",
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
            data: xLabel5,
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
              color: "rgba(234, 185, 102, .6)",
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
            data: goToSchool5,
          },
        ],
      };
      let option6 = {
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
                '<div style="display:inline-block;padding:0 5px;border-radius:10px;height:30px;width:100%;background-color:#000;color:#fff"><div style="font-size:12px;color:#999">NUT values</div>' +
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
          right: "80px",
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
            data: xLabel6,
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
              color: "rgba(234, 185, 102, .6)",
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
            data: goToSchool6,
          },
        ],
      };

      setTimeout(async () => {
        try {
          myChart = echarts.init(
            document.getElementById("main1") as HTMLElement
          );
          // 绘制图表1
          myChart.setOption(option);

          myChart2 = echarts.init(
            document.getElementById("main2") as HTMLElement
          );
          // 绘制图表1
          myChart2.setOption(option2);

          myChart3 = echarts.init(
            document.getElementById("main3") as HTMLElement
          );
          // 绘制图表1
          myChart3.setOption(option3);

          // myChart4 = echarts.init(
          //   document.getElementById("main4") as HTMLElement
          // );
          // // 绘制图表1
          // myChart4.setOption(option4);

          myChart5 = echarts.init(
            document.getElementById("main5") as HTMLElement
          );
          // 绘制图表1
          myChart5.setOption(option5);

          myChart6 = echarts.init(
            document.getElementById("main6") as HTMLElement
          );
          // 绘制图表1
          myChart6.setOption(option6);
        } catch (error) {}
      }, 100);

      const nutbalance = await nutContract.balanceOf(addressPool);
      const nutbalanceCFX:any = new Drip(nutbalance).toCFX();
      setTotalEmissionNUT((300000-nutbalanceCFX).toString());

      const confluxscanData = await axios.get(
        "https://www.confluxscan.io/stat/tokens/by-address?address=cfx%3Aacg158kvr8zanb1bs048ryb6rtrhr283ma70vz70tx&fields=iconUrl&fields=transferCount&fields=price&fields=totalPrice&fields=quoteUrl"
      );
      const data = confluxscanData.data.data;
      const summary = await excContract.Summary();
      const xcfxvalues = Drip(summary.xcfxvalues).toCFX();
      const totalxcfxs = Drip(summary.totalxcfxs).toCFX();
      const price = data.price;
      const x = totalxcfxs;
      const y = xcfxvalues;
      const p = price;
      const totalvalues = x * y;
      const val = BigNumber(totalvalues * p).toFixed(2);
      setTotal1(val);
      setTotal2(x);
      const poolval = y * x;
      setTotal3(poolval.toString());

      const accountsData = await axios.get(
        "https://testnet.confluxscan.io/stat/pos-account-detail?identifier=0x090bcace1f3bd02da6505328f375382c588954cea7fcc4080ca49f98af6b9fa5"
      );
      const totalReward = Drip(accountsData.data.data.totalReward).toCFX();
      setTotal4(totalReward);

      const mynut = await nutoContract.balanceOf(myacc);
      setMynut(Drip(mynut.toString()).toCFX().toString());
      
    })();
  }, []);

  // 点击获取图表数据
  async function getCharts(chart = 1, _cond = "", index = 0, limit = 24) {
    if (index === 0) limit = 24;
    if (index === 1) limit = 168;
    if (index === 2) limit = 720;
    if (index === 3) limit = 8640;
    if (index === 4) limit = 8640 * 5;

    const res: { data: { count: any; rows: [] } } = await getStatistics(
      "",
      limit
    );

    // 采样点
    let T: any = [];
    let bl = 1;
    if (res.data.rows.length === limit) {
      bl = parseInt((res.data.rows.length / 24).toString());
    } else {
      bl = parseInt((limit / 24).toString());
    }

    res.data.rows.forEach((element: any, i: any) => {
      if (index === 0) {
        T.push(element);
      }
      if (index === 1 && i % bl === 0) {
        T.push(element);
      }
      if (index === 2 && i % bl === 0) {
        T.push(element);
      }
      if (index === 3 && i % 8640 === 0) {
        T.push(element);
      }
      if (index === 4 && i % bl === 0) {
        T.push(element);
      }
    });

    switch (chart) {
      case 1:
        // 图表1
        setChart1Tab(index);

        goToSchool1 = [];
        xLabel1 = [];
        T.reverse().forEach(
          (
            element: {
              nut2: any;
              xcfx1: number;
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

            const val1 = val;
            const day1 = element.created_at.toString();
            let obj1 = { date: day1, value: val1 };
            goToSchool1.push(obj1);
            xLabel1.push("");
          }
        );
        const myChartT = echarts.getInstanceByDom(
          document.getElementById("main1") as HTMLElement
        );
        var optionT = (myChartT as any).getOption();
        optionT.series[0].data = goToSchool1;
        optionT.xAxis.data = xLabel1;
        (myChartT as any).setOption(optionT);
        break;
      case 2:
        // 图表2
        setChart2Tab(index);

        goToSchool2 = [];
        xLabel2 = [];
        T.reverse().forEach(
          (
            element: {
              nut2: any;
              xcfx1: number;
              nut1: any;
              created_at: any;
              apy: any;
              price: any;
              xcfxvalues: any;
              totalxcfxs: string;
            },
            i: any
          ) => {
            const price = element.price;
            const p = new BigNumber(price);
            const val2 = Drip(element.nut1 * 2 * p).toCFX();
            const day2 = element.created_at.toString();
            let obj2 = { date: day2, value: val2 };
            goToSchool2.push(obj2);
            xLabel2.push("");
          }
        );
        const myChartT2 = echarts.getInstanceByDom(
          document.getElementById("main2") as HTMLElement
        );
        var optionT2 = (myChartT2 as any).getOption();
        optionT2.series[0].data = goToSchool2;
        optionT2.xAxis.data = xLabel2;
        (myChartT2 as any).setOption(optionT2);
        break;
      case 3:
        // 图表2
        setChart3Tab(index);

        goToSchool3 = [];
        xLabel3 = [];
        T.reverse().forEach(
          (
            element: {
              nut2: any;
              xcfx1: number;
              nut1: any;
              created_at: any;
              apy: any;
              price: any;
              xcfxvalues: any;
              totalxcfxs: string;
            },
            i: any
          ) => {
            const price = element.price;
            const p = new BigNumber(price);
            const val2 = Drip(element.xcfx1 * 2 * p).toCFX();
            const day2 = element.created_at.toString();
            let obj3 = { date: day2, value: val2 };
            goToSchool3.push(obj3);
            xLabel3.push("");
          }
        );
        const myChartT3 = echarts.getInstanceByDom(
          document.getElementById("main3") as HTMLElement
        );
        var optionT3 = (myChartT3 as any).getOption();
        optionT3.series[0].data = goToSchool3;
        optionT3.xAxis.data = xLabel3;
        (myChartT3 as any).setOption(optionT3);
        break;
      case 5:
        // 图表2
        setChart5Tab(index);

        goToSchool5 = [];
        xLabel5 = [];
        T.reverse().forEach(
          (
            element: {
              nut2: any;
              xcfx1: number;
              nut1: any;
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
            const price = element.price;
            const p = new BigNumber(price);
            const val5 = y.multipliedBy(p).toString();
            const day5 = element.created_at.toString();
            let obj5 = { date: day5, value: val5 };
            goToSchool5.push(obj5);
            xLabel5.push("");
          }
        );
        const myChartT5 = echarts.getInstanceByDom(
          document.getElementById("main5") as HTMLElement
        );
        var optionT5 = (myChartT5 as any).getOption();
        optionT5.series[0].data = goToSchool5;
        optionT5.xAxis.data = xLabel5;
        (myChartT5 as any).setOption(optionT5);
        break;
      case 6:
        // 图表2
        setChart6Tab(index);

        goToSchool6 = [];
        xLabel6 = [];
        T.reverse().forEach(
          (
            element: {
              nut2: any;
              xcfx1: number;
              nut1: any;
              created_at: any;
              apy: any;
              price: any;
              xcfxvalues: any;
              totalxcfxs: string;
            },
            i: any
          ) => {
            const price = element.price;
            const p = new BigNumber(price);
            const val6 = BigNumber((element.nut1 / element.nut2) * p).toFixed(4);
            const day6 = element.created_at.toString();
            let obj6 = { date: day6, value: val6 };
            goToSchool6.push(obj6);
            xLabel6.push("");
          }
        );
        const myChartT6 = echarts.getInstanceByDom(
          document.getElementById("main6") as HTMLElement
        );
        var optionT6 = (myChartT6 as any).getOption();
        optionT6.series[0].data = goToSchool6;
        optionT6.xAxis.data = xLabel6;
        (myChartT6 as any).setOption(optionT6);
        break;
      default:
        console.log("default");
        break;
    }
  }

  return (
    <div className={style.analytics}>
      <div
        className={styles.inner}
        style={{ backgroundColor: "#171520", minHeight: "960px" }}
      >
        <div className={style.sub_nav2}>
          <Link to="/data/analytics" style={{ color: "#EAB764" }}>
            {t("stake.nucleon_analytics")}
          </Link>
          <Link to="/data/useranalytics" style={{ color: "#FFF",display:"none" }}>
            {t("stake.user_analytics")}
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
        <div className={style.box0}>
          <Row gutter={16}>
            <Col className="gutter-row" span={2}></Col>
            <Col className="gutter-row" sm={4} xs={24}>
              <div className={style.tit}> {t("analytics.TVL")} </div>
              <b>${formatNumber(total1)}</b>
            </Col>
            <Col className="gutter-row" sm={4} xs={24}>
              <div className={style.tit}>
                {t("analytics.Total_Emission_xCFX")}
              </div>
              <b>{formatNumber(parseFloat(total2).toFixed(2))}</b>
            </Col>
            <Col className="gutter-row" sm={4} xs={24}>
              <div className={style.tit}>
                {t("analytics.Total_CFX_In_Pool")}
              </div>
              <b>{formatNumber(parseFloat(total3).toFixed(2))}</b>
            </Col>
            <Col className="gutter-row" sm={4} xs={24}>
              <div className={style.tit}>{t("analytics.Interest_Earned")}</div>
              <b>{formatNumber(parseFloat(total4).toFixed(2))}</b>
            </Col>
            <Col className="gutter-row" sm={4} xs={24}>
              <div className={style.tit}>
                {t("analytics.Total_Emission_of_NUT")}
              </div>
              <b>{ formatNumber(parseFloat(totalEmissionNUT).toFixed(2)) }</b>
            </Col>
            <Col className="gutter-row" span={2}></Col>
          </Row>
        </div>
        <div>
          <Row gutter={32}>
            <Col sm={12} xs={24}>
              <div className={style.box2}>
                <div className={style.board2}></div>
                TVL xCFX
                <div
                  className={styles.main5}
                  style={{ height: "340px", width: "100%", marginTop: "70px" }}
                  id="main1"
                ></div>
                <div
                  className={chart1Tab === 0 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(1, "", 0);
                  }}
                >
                  24h
                </div>
                <div
                  className={chart1Tab === 1 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(1, "weeks", 1);
                  }}
                >
                  7d
                </div>
                <div
                  className={chart1Tab === 2 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(1, "months", 2);
                  }}
                >
                  1m
                </div>
                <div
                  className={chart1Tab === 3 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(1, "years", 3);
                  }}
                >
                  1y
                </div>
                <div
                  className={chart1Tab === 4 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(1, "years", 4);
                  }}
                >
                  5y
                </div>
              </div>
            </Col>
            <Col sm={12} xs={24}>
              <div className={style.box2}>
                <div className={style.board2}></div>
                TVL-LP xCFX/NUT
                <div
                  className={styles.main5}
                  style={{ height: "340px", width: "100%", marginTop: "70px" }}
                  id="main2"
                ></div>
                <div
                  className={chart2Tab === 0 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(2, "", 0);
                  }}
                >
                  24h
                </div>
                <div
                  className={chart2Tab === 1 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(2, "weeks", 1);
                  }}
                >
                  7d
                </div>
                <div
                  className={chart2Tab === 2 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(2, "months", 2);
                  }}
                >
                  1m
                </div>
                <div
                  className={chart2Tab === 3 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(2, "years", 3);
                  }}
                >
                  1y
                </div>
                <div
                  className={chart2Tab === 4 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(2, "years", 4);
                  }}
                >
                  5y
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col sm={12} xs={24}>
              <div className={style.box2}>
                <div className={style.board2}></div>
                TVL-LP CFX/xCFX
                <div
                  className={styles.main5}
                  style={{ height: "340px", width: "100%", marginTop: "70px" }}
                  id="main3"
                ></div>
                <div
                  className={chart3Tab === 0 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(3, "", 0);
                  }}
                >
                  24h
                </div>
                <div
                  className={chart3Tab === 1 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(3, "weeks", 1);
                  }}
                >
                  7d
                </div>
                <div
                  className={chart3Tab === 2 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(3, "months", 2);
                  }}
                >
                  1m
                </div>
                <div
                  className={chart3Tab === 3 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(3, "years", 3);
                  }}
                >
                  1y
                </div>
                <div
                  className={chart3Tab === 4 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(3, "years", 4);
                  }}
                >
                  5y
                </div>
              </div>
            </Col>
            <Col sm={12} xs={24}>
              <div className={style.box2}>
                <div className={style.board2}></div>
                Staked NUT
                <div
                  className={styles.main5}
                  style={{ height: "340px", width: "100%", marginTop: "70px" }}
                  id="main4"
                ><div style={{textAlign:"center",padding: "90px 0 0",fontSize: "40px"}}>Comimg Soon</div></div>
                <div className={style.tabbtn}>24h</div>
                <div className={style.tabbtn}>7d</div>
                <div className={style.tabbtn}>1m</div>
                <div className={style.tabbtn}>1y</div>
                <div className={style.tabbtn}>5y</div>
              </div>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col sm={12} xs={24}>
              <div className={style.box2}>
                <div className={style.board2}></div>
                xCFX Values
                <div
                  className={styles.main5}
                  style={{ height: "340px", width: "100%", marginTop: "70px" }}
                  id="main5"
                ></div>
                <div
                  className={chart5Tab === 0 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(5, "", 0);
                  }}
                >
                  24h
                </div>
                <div
                  className={chart5Tab === 1 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(5, "weeks", 1);
                  }}
                >
                  7d
                </div>
                <div
                  className={chart5Tab === 2 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(5, "months", 2);
                  }}
                >
                  1m
                </div>
                <div
                  className={chart5Tab === 3 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(5, "years", 3);
                  }}
                >
                  1y
                </div>
                <div
                  className={chart5Tab === 4 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(5, "years", 4);
                  }}
                >
                  5y
                </div>
              </div>
            </Col>
            <Col sm={12} xs={24}>
              <div className={style.box2}>
                <div className={style.board2}></div>
                NUT Values
                <div
                  className={styles.main5}
                  style={{ height: "340px", width: "100%", marginTop: "70px" }}
                  id="main6"
                ></div>
                <div
                  className={chart6Tab === 0 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(6, "", 0);
                  }}
                >
                  24h
                </div>
                <div
                  className={chart6Tab === 1 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(6, "weeks", 1);
                  }}
                >
                  7d
                </div>
                <div
                  className={chart6Tab === 2 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(6, "months", 2);
                  }}
                >
                  1m
                </div>
                <div
                  className={chart6Tab === 3 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(6, "years", 3);
                  }}
                >
                  1y
                </div>
                <div
                  className={chart6Tab === 4 ? style.tabbtncurr : style.tabbtn}
                  onClick={() => {
                    getCharts(6, "years", 4);
                  }}
                >
                  5y
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
