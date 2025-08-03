const { task } = require("hardhat/config");

task("deploy-fundme","deploy and verify contract").setAction(async (taskArgs, hre) => {
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
})

async function verityFunMe(fundMeAddress, args) {
    //vailidate contract
    await hre.run("verify:verify", {
        address: fundMeAddress,
        constructorArguments: args,
    });
}

module.exports = {};