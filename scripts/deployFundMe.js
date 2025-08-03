//import ethers.js
//create main function
//execute main function

const { ethers } = require("hardhat");


async function main() {
    // create contract factory
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("contract deploying...");
    // deploy contract form factory
    const fundMe = await fundMeFactory.deploy(300);
    // waiting deploy complete
    await fundMe.waitForDeployment();
    console.log("contract has been deployed successfully,contract address:" + fundMe.target);

    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("waiting for 5 confirmations...");
        //waiting for 5 blocks
        await fundMe.deploymentTransaction().wait(5);
        //vailidate contract
        await verityFunMe(fundMe.target, [300]);
    }


    //init 2 accounts
    const [firstAccount, secondAccount] = await ethers.getSigners();

    //fund contract with first account
    const fundTx = await fundMe.fund({value: ethers.parseEther("0.03")});
    await fundTx.wait()

    //check balance of contract 
    const amountOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log("Balance of contract: ", amountOfContract.toString(), " ETH")

    //fund contract with second account
    const secondFundTx = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.03")})
    await secondFundTx.wait()

    //check balance of contract
    const amountOfContractSecondAmount = await ethers.provider.getBalance(fundMe.target)
    console.log("Balance of contract: ", amountOfContractSecondAmount.toString(), " ETH")

    //check mapping fundersToAmount
    const firstAccountBalanceInFunMe = await fundMe.fundersToAmount(firstAccount.address)
    const secondAccountBalanceInFunMe = await fundMe.fundersToAmount(secondAccount.address)
    console.log("Balance of first account: ", firstAccountBalanceInFunMe.toString(), " ETH")
    console.log("Balance of second account: ", secondAccountBalanceInFunMe.toString(), " ETH")  

}


async function verityFunMe(fundMeAddress, args) {
    //vailidate contract
    await hre.run("verify:verify", {
        address: fundMeAddress,
        constructorArguments: args,
    });
}

//execute main function
main().then().catch((error) => {
    console.log(error);
    process.exit(1);
})