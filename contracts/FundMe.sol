// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

//1. 创建一个收款函数
//2. 记录投资人并且查看
//3. 在锁定期内，达到目标生产商可以提现
//4. 在锁定期内，没有达到目标值，投资人可以退款


contract FundMe {

    AggregatorV3Interface internal dataFeed;

    //投资人信息
    mapping(address => uint256) public fundersToAmount;

    //最小收款
    uint256 MINIMUN_VALUE = 100 * 10 ** 18;//wei

    //拥有者
    address owner;

    //目标
    uint256 constant TARGET = 200 * 10 ** 18;

    uint256 deploymentTimestamp;
    uint256 lockTime;

    address erc20Addr;

    bool public getFundSuccess = false;

    constructor(uint256 _lockTime){
        //sepolia testnet
        dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        //把当前部署人记录为拥有者
        owner = msg.sender;

        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }

    //收款函数
    function fund() external payable {
        //设置最小收款ETH
        require(convetEthToUsd(msg.value) >= MINIMUN_VALUE,"Send more ETH");
        require(block.timestamp < deploymentTimestamp + lockTime,"window is close");
        fundersToAmount[msg.sender] = msg.value;
    }


    function convetEthToUsd(uint256 ethAmount) internal view returns (uint256){
        uint256 ethPrice = uint(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / (10 ** 8);
    }

    function transferOwnership(address newOwner) external {
        require(msg.sender == owner,"this function can only be called by owner");
        owner = newOwner;
    }

    function setFunderToAmount(address funder, uint256 amountToUpdate) external {
        require(msg.sender == erc20Addr,"You do not have permission to call function");
        fundersToAmount[funder] = amountToUpdate;
    }


    function setErc20Addr(address _erc20Addr) public onlyOwner {
        erc20Addr = _erc20Addr;
    }


    /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }


    function getFund() external payable  windowClose{
        require(convetEthToUsd(address(this).balance) >= TARGET,"Target is not reached");
        require(msg.sender == owner,"this function can only be called by owner");
        //transfer: transfer ETH and revert if tx failed
        //payable(msg.sender).transfer(address(this).balance);
        //send: transfer ETH and return false if failed
        //bool success = payable(msg.sender).send(address(this).balance);
        //call: transfer ETH and data return value of function and bool
        bool success;
        (success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success,"transfer tx failed");
        fundersToAmount[msg.sender] = 0;
        getFundSuccess = true;
    }



    function refund() external windowClose {
        require(convetEthToUsd(address(this).balance) < TARGET,"Target is reached");
        require(fundersToAmount[msg.sender] != 0,"there is no fund for you");
        
        bool success;
        (success, ) = payable(msg.sender).call{value: fundersToAmount[msg.sender]}("");
        require(success,"transfer tx failed");
        fundersToAmount[msg.sender] = 0;
    }


    modifier windowClose(){
        require(block.timestamp >= deploymentTimestamp + lockTime,"window is not closed");
        //下划线如果在下面，则表示先执行上面的代码在执行方法中的代码，如果在上面则表示先执行方法中的代码在执行modifier中的代码
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == owner,"this function can only be called by owner");
        _;
    }

}






