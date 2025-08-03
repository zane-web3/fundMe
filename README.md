# FundMe 智能合约项目 / FundMe Smart Contract Project

这是一个基于 Solidity 编写的去中心化众筹合约，结合 Chainlink 实现 ETH/USD 汇率换算，并使用 Hardhat 和 ethers.js 进行部署、验证和测试。

This is a decentralized crowdfunding smart contract written in Solidity, using Chainlink price feeds for ETH/USD conversion. It is deployed and tested using Hardhat and ethers.js.

---

## 🧩 项目功能 / Features

### ✅ 合约主要功能 / Core Contract Features

- ⛓️ 支持以太坊主网与测试网（默认使用 Sepolia）
- 💵 支持最低投资金额（100 USD）判断
- 🕒 支持设定锁仓期（lockTime）
- 🎯 达到目标金额（200 USD）后，项目拥有者可提现
- 🔄 未达到目标金额，用户可退款
- 🔐 映射记录每位投资人的金额
- 📈 使用 Chainlink 预言机动态获取 ETH/USD 汇率

### 🔧 脚本功能 / Script Capabilities

- 合约部署并自动验证（Etherscan）
- 两个账户模拟投资流程
- 控制台输出合约余额与投资人信息

---

## 🚀 快速开始 / Quick Start

### 1️⃣ 安装依赖 / Install Dependencies

```bash
npm install
