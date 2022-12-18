import {
  format,
  Drip,
  Conflux,
} from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js'
// import posPool from './../ABI/IPoSPool.json'
// import posManagerAbi from './../ABI/PoolManager.json'
import EposAbi from "./../ABI/Epos.json";
import poolConfig from './pool.config.js'
import { isTestNetEnv } from './index'
import { NETWORK_ID_CORE_MAINNET, NETWORK_ID_CORE_TESTNET } from './../constants'

let cfxUrl = poolConfig[isTestNetEnv() ? 'testnet' : 'mainnet'].eSpace.RPC
if (process.env.REACT_APP_TestNet === 'true') {
  cfxUrl = window.location.origin + `/core-rpc`
}

const conflux = new Conflux({
  url: cfxUrl,
  networkId: isTestNetEnv() ? NETWORK_ID_CORE_TESTNET : NETWORK_ID_CORE_MAINNET,
})
//conflux.provider = window.conflux;

export const getEPos = conflux.Contract({
  abi: EposAbi.abi,
  address: '0xF2c569713F715B84A9A493CCd69A7573bA256db1'
})


// export const posPoolManagerContract = conflux.Contract({
//   abi: posManagerAbi.abi,
//   address:
//     poolConfig[isTestNetEnv() ? 'testnet' : 'mainnet'].poolManagerAddress,
// })

// export const getPosAccountByPowAddress = async address => {
//   const posPoolContract = conflux.Contract({
//     abi: posPool.abi,
//     address: address,
//   });

//   const posAddress = format.hex(await posPoolContract.posAddress())
//   const posAccout = await conflux.provider.call('pos_getAccount', posAddress)
//   return posAccout
// }

export { format, Drip, conflux }
