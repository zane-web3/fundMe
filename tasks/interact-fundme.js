const { task } = require("hardhat/config");
//const { ethers } = require("hardhat");

task("interact-fundme","interact with fundme contract").addParam("addr", "fundme contract address").setAction(async (taskArgs, hre) => {

    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = fundMeFactory.attach(taskArgs.addr);

    //init 2 accounts
    const [firstAccount, secondAccount] = await ethers.getSigners();

    //fund contract with first account
    const fundTx = await fundMe.fund({ value: ethers.parseEther("0.03") });
    await fundTx.wait()

    //check balance of contract 
    const amountOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log("Balance of contract: ", amountOfContract.toString(), " ETH")

    //fund contract with second account
    const secondFundTx = await fundMe.connect(secondAccount).fund({ value: ethers.parseEther("0.03") })
    await secondFundTx.wait()

    //check balance of contract
    const amountOfContractSecondAmount = await ethers.provider.getBalance(fundMe.target)
    console.log("Balance of contract: ", amountOfContractSecondAmount.toString(), " ETH")

    //check mapping fundersToAmount
    const firstAccountBalanceInFunMe = await fundMe.fundersToAmount(firstAccount.address)
    const secondAccountBalanceInFunMe = await fundMe.fundersToAmount(secondAccount.address)
    console.log("Balance of first account: ", firstAccountBalanceInFunMe.toString(), " ETH")
    console.log("Balance of second account: ", secondAccountBalanceInFunMe.toString(), " ETH")
})

module.exports = {}