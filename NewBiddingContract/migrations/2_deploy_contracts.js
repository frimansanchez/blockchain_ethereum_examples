var NewBiddingContract = artifacts.require("./NewBiddingContract.sol");

module.exports = function(deployer) {
  // Deploy the instance of the contract
    
  var bidAmount = web3.toWei(2,'ether');
  deployer.deploy(NewBiddingContract, "Owner", "This is a bidding Smart contract", 5, bidAmount);

};
