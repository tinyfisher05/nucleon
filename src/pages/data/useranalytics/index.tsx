import { useEffect, useRef, useState } from "react";
import { Link } from "umi";

import * as echarts from "echarts";
var moment = require("moment");

import styles from "./../../../layouts/index.less";
import style from "./index.less";

import logo from "../../../assets/logo.svg";
import logotxt from "../../../assets/logotxt.svg";
import logo7 from "../../../assets/logo7.png";
import "./../../../locales/config"; // 引用配置文件
import { useTranslation, Trans } from "react-i18next";

import { Button, Col, Row, Carousel, Checkbox } from "antd";

export default function Page() {
  const { t, i18n } = useTranslation();

  var myChart: echarts.ECharts;

  let xLabel = [""];
  let goToSchool: { date: any; value: any }[] = [];

  useEffect(() => {
    window.scrollTo(0, 0);
    // 监听
    //window.addEventListener("resize", resizeChange);
    (async () => {
      goToSchool = [
        { value: 1.5067, date: "Mon" },
        { value: 1.5467, date: "Tue" },
        { value: 1.6067, date: "Wed" },
        { value: 1.7867, date: "Thu" },
        { value: 1.0475, date: "Fri" },
        { value: 1.8067, date: "Sat" },
        { value: 1.9067, date: "Sun" },
      ];
      xLabel = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
          right: "10%",
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
            data: xLabel,
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
            symbolSize: 0,
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
            data: goToSchool,
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
        } catch (error) {}
      }, 500);
    })();
  }, []);

  return (
    <div className={style.useranalytics}>
      <div
        className={styles.inner}
        style={{ backgroundColor: "#171520", minHeight: "960px" }}
      >
        <div className={style.sub_nav2}>
          <Link to="/data/analytics" style={{ color: "#fff" }}>
            {t("stake.nucleon_analytics")}
          </Link>
          <Link to="/data/useranalytics" style={{ color: "#EAB764" }}>
            {t("stake.user_analytics")}
          </Link>
        </div>
        <div className={style.box0}>
          <Row gutter={16}>
          <Col className="gutter-row" span={2}>
            
            </Col>
            <Col className="gutter-row" span={4}>
              <div className={style.tit}> Total xCFX </div>
              <b>$884,17M</b>
            </Col>
            <Col className="gutter-row" span={4}>
              <div className={style.tit}>
              Staked LP
              </div>
              <b>$884,17M</b>
            </Col>
            <Col className="gutter-row" span={4}>
              <div className={style.tit}>Staked NUT</div>
              <b>$884,17M</b>
            </Col>
            <Col className="gutter-row" span={4}>
              <div className={style.tit}>Unclaimed rewards</div>
              <b>$884,17M</b>
            </Col>
            <Col className="gutter-row" span={4}>
              <div className={style.tit}>
              POS interest
              </div>
              <b>$884,17M</b>
            </Col>
            <Col className="gutter-row" span={2}>
            
            </Col>
          </Row>
        </div>
        <div>
          <Row gutter={32}>
            <Col span={12}>
              <div className={style.box2}>
                <div className={style.board2}></div>
                TVL CFX
                <div
                  className={styles.main5}
                  style={{ height: "340px", width: "100%", marginTop: "70px" }}
                  id="main1"
                ></div>
                <div className={style.tabbtn}>24h</div>
                <div className={style.tabbtn}>7d</div>
                <div className={style.tabbtn}>14d</div>
                <div className={style.tabbtn}>30d</div>
                <div className={style.tabbtn}>90d</div>
                <div className={style.tabbtn}>180d</div>
                <div className={style.tabbtn}>1y</div>
              </div>
            </Col>
            <Col span={12}>
              <div className={style.box2}>
                <div className={style.board2}></div>
                TVL CFX
                <div
                  className={styles.main5}
                  style={{ height: "340px", width: "100%", marginTop: "70px" }}
                  id="main1"
                ></div>
                <div className={style.tabbtn}>24h</div>
                <div className={style.tabbtn}>7d</div>
                <div className={style.tabbtn}>14d</div>
                <div className={style.tabbtn}>30d</div>
                <div className={style.tabbtn}>90d</div>
                <div className={style.tabbtn}>180d</div>
                <div className={style.tabbtn}>1y</div>
              </div>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span={12}>
              {" "}
              <div className={style.box2}>
                <div className={style.board2}></div>
                TVL CFX
                <div
                  className={styles.main5}
                  style={{ height: "340px", width: "100%", marginTop: "70px" }}
                  id="main1"
                ></div>
                <div className={style.tabbtn}>24h</div>
                <div className={style.tabbtn}>7d</div>
                <div className={style.tabbtn}>14d</div>
                <div className={style.tabbtn}>30d</div>
                <div className={style.tabbtn}>90d</div>
                <div className={style.tabbtn}>180d</div>
                <div className={style.tabbtn}>1y</div>
              </div>
            </Col>
            <Col span={12}>
              {" "}
              <div className={style.box2}>
                <div className={style.board2}></div>
                TVL CFX
                <div
                  className={styles.main5}
                  style={{ height: "340px", width: "100%", marginTop: "70px" }}
                  id="main1"
                ></div>
                <div className={style.tabbtn}>24h</div>
                <div className={style.tabbtn}>7d</div>
                <div className={style.tabbtn}>14d</div>
                <div className={style.tabbtn}>30d</div>
                <div className={style.tabbtn}>90d</div>
                <div className={style.tabbtn}>180d</div>
                <div className={style.tabbtn}>1y</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
