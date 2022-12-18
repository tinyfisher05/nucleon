import React from 'react';
import { Link } from "umi";
import styles from "./../../../layouts/index.less";
import style from "./index.less";

import { Button, Col, Row, Carousel, Divider } from "antd";
import Icon, { CloseOutlined } from "@ant-design/icons";

import logo from "../../../assets/logo.svg";
import logotxt from "../../../assets/logotxt.svg";
import "./../../../locales/config"; // 引用配置文件 locales/config
import { useTranslation, Trans } from "react-i18next";

export default function Page() {
  const { t, i18n } = useTranslation();
  return (
    <div className={style.rewards}>
      <div className={styles.inner} style={{ backgroundColor: "#171520", minHeight:"960px" }}>
        <div className={style.sub_nav2}>
          <Link to="/data/stake" style={{ color: "#EAB764" }}>
          Rewards history
          </Link>
        </div>
        <div className={style.box2}>
          <Row style={{ padding: "10px 20px 5px" }}>
            <Col span={6}>{t("pools.PoolName")}</Col>
            <Col span={3}>{t("pools.APR")}</Col>
            <Col span={3}>{t("pools.TotalLiquidity")}</Col>
            <Col span={3}>{t("pools.24HVolume")}</Col>
            <Col span={3}>{t("pools.Myliquidity")}</Col>
            <Col span={3}></Col>
            <Col span={3}></Col>
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
            <Col span={6}>
              CFX- xCFX <span>(0.05% fee)</span>
            </Col>
            <Col span={3}>$44.45%</Col>
            <Col span={3}>$2.14m</Col>
            <Col span={3}>$50,599.95</Col>
            <Col span={3}>$486.41</Col>
            <Col span={3}>
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
            </Col>
            <Col span={3}>
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
                {t("pools.Claimrewards")}
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
            <Col span={6}>
              CFX- xCFX <span>(0.05% fee)</span>
            </Col>
            <Col span={3}>$44.45%</Col>
            <Col span={3}>$2.14m</Col>
            <Col span={3}>$50,599.95</Col>
            <Col span={3}>$486.41</Col>
            <Col span={3}>
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
            </Col>
            <Col span={3}>
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
                {t("pools.Claimrewards")}
              </Button>
            </Col>
          </Row>
          <div style={{ height: "7px" }}></div>
        </div>
      </div>
    </div>
  );
}
