import { Outlet } from "umi";
import Header from "./data/components/Header";
import { Helmet } from "react-helmet";
import {memo, useCallback } from "react";
import {
  useStatus,
  useAccount,
  useChainId,
  useBalance,
} from "@cfxjs/use-wallet-react/ethereum";

import styles from "./../layouts/index.less";


export default function N() {
  // web3 钱包登录状态
  const status = useStatus();
  return (
    <div className="yds">
      <Helmet>
        <link rel="stylesheet" href="style.css"></link>
      </Helmet>
      <div className={styles.inner}>
        <Header />
      </div>
      <Outlet />
    </div>
  );
}
