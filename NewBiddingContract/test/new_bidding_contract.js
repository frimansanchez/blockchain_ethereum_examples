var NewBiddingContract = artifacts.require("./NewBiddingContract.sol");

/**
 * Test Case
 * 1. Lets say Owner is the dealer - so he is the one who owns the contract
 * 2. Bill participates in the bid with 4 ethers
 * 3. Frank participates in the bid with 5 ethers
 * 4. Maria participates in the bid with 6 ethers
 * 5. Mitchel participaes in the bid with 7 ethers
 * 
 * In order to simulate the expiration of the bidding (because of the duration time is over)
 * there is function called uglyDelay(millisecons) that generates a delay.
 */

contract('NewBiddingContract', function(accounts) {
  var owners_address = accounts[0];
  var bills_address = accounts[1];
  var franks_address= accounts[2];
  var marias_address= accounts[3];
  var mitchels_address=accounts[4];

  it("should assert true", function() {
    var new_bidding_contract;
    return NewBiddingContract.deployed().then(function(instance){
      new_bidding_contract = instance;

      var datetime = getDateTime();
      console.log('Deployement time: ', datetime);
            
      return web3.eth.getBalance(owners_address);
    }).then(function(result){
      // Print Bill's balance
      console.log('');
      console.log('   Owner\'s balance before bidding : ',web3.fromWei(result.toNumber(),'ether'));

      return web3.eth.getBalance(bills_address);
    }).then(function(result){
      // Print Bill's balance
      console.log('');
      console.log('   Bill\'s balance before bidding : ',web3.fromWei(result.toNumber(),'ether'));

      return web3.eth.getBalance(franks_address);
    }).then(function(result){
      // Print Frank's balance
      console.log('   Frank\'s balance before bidding: ',web3.fromWei(result.toNumber(),'ether'));

      return web3.eth.getBalance(marias_address);
    }).then(function(result){
      // Print Maria's balance
      console.log('   Maria\'s balance before bidding: ',web3.fromWei(result.toNumber(),'ether'));
      
      return web3.eth.getBalance(mitchels_address);
    }).then(function(result){
      // Print Mitchel's balance
      console.log('   Mitchel\'s balance before bidding: ',web3.fromWei(result.toNumber(),'ether'));
      console.log('');


//      var sendValue = web3.toWei(20,'ether');
//      console.log('We are going to send ethers from Owner to the contract:', web3.fromWei(sendValue,'ether'));
//      web3.eth.sendTransaction({from:owners_address,to:new_bidding_contract.address, value:sendValue});

      // Send a first bid from Bill
      var bidAmount = web3.toWei(4,'ether');
      new_bidding_contract.placeBid("Bill Tale", bidAmount, {from:bills_address, value:bidAmount});
      console.log('   Bill placed a Bid with 4 ethers... ');

      // Send a first guess from Frank
      bidAmount = web3.toWei(5,'ether');
      new_bidding_contract.placeBid("Frank Sinatra",bidAmount, {from:franks_address, value:bidAmount});
      console.log('   Frank placed a Bid with 5 ethers... ');

      bidAmount = web3.toWei(6,'ether');
      new_bidding_contract.placeBid("Maria Beltran",bidAmount, {from:marias_address, value:bidAmount});
      console.log('   Maria placed a Bid with 6 ethers... ');

      
      // Ugly delay to simulate that contract is timed or has expired.
      // The duration of the contract was configured with 5 seconds in ./migration/2_deploy_contracts.js.
      // With uglyDelay(2000) milliseconds, the bidding duration has not expired and Mitchel can place a bid.
      // We can change this value to test some other behaviours.

      uglyDelay(2000);

      bidAmount = web3.toWei(7,'ether');
      new_bidding_contract.placeBid("Mitchel Dean",bidAmount, {from:mitchels_address, value:bidAmount});
      console.log('   Mitchel placed a Bid with 7 ethers... ');
      console.log('');

      return new_bidding_contract.getBalance.call({from:owners_address});
    }).then(function(result){
      // Print contract balance
      console.log('Smart contract balance with new_bidding_contract.getBalance: ',web3.fromWei(result.toNumber(),'ether'));

      return web3.eth.getBalance(new_bidding_contract.address);
    }).then(function(result){
      // Print contract balance
      console.log('Smart contract balance with web3.eth.getBalance(): ',web3.fromWei(result.toNumber(),'ether'));

      return web3.eth.getBalance(bills_address);
    }).then(function(result){
      // Print Bill\'s balance
      console.log('');
      console.log('   Bill\'s balance after bidding : ',web3.fromWei(result.toNumber(),'ether'));

      return web3.eth.getBalance(franks_address);
    }).then(function(result){
      // Print Frank\'s balance
      console.log('   Frank\'s balance after bidding: ',web3.fromWei(result.toNumber(),'ether'));

      return web3.eth.getBalance(marias_address);
    }).then(function(result){
      // Print Maria\'s balance
      console.log('   Maria\'s balance after bidding: ',web3.fromWei(result.toNumber(),'ether'));

      return web3.eth.getBalance(mitchels_address);
    }).then(function(result){
      // Print Mitchel\'s balance
      console.log('   Mitchel\'s balance after bidding: ',web3.fromWei(result.toNumber(),'ether'));
      console.log('');

      printHighestBid(new_bidding_contract);
      printNumberOfBidders(new_bidding_contract);
      
      return new_bidding_contract.getBalance.call({from:owners_address});
    }).then(function(result){
      // Print contract balance
      console.log('');
      console.log('Final Smart contract balance with new_bidding_contract.getBalance: ',web3.fromWei(result.toNumber(),'ether'));

      return web3.eth.getBalance(new_bidding_contract.address);
    }).then(function(result){
      // Print contract balance
      console.log('Final Smart contract balance with web3.eth.getBalance: ',web3.fromWei(result.toNumber(),'ether'));

      // Ugly delay to simulate that contract is timed or has expired.
      // The duration of the contract was configured with 5 seconds in ./migration/2_deploy_contracts.js
      // with uglyDelay(6000) milliseconds, the bidding duration has expired.
      // We can change this value to test some other behaviours.
      uglyDelay(6000);

      console.log('');
      return new_bidding_contract.getClaimAmount.call({from:bills_address});
    }).then(function(result){
      console.log('   Bill can claim ',web3.fromWei(result.toNumber(),'ether'), ' Ethers');

      return new_bidding_contract.getClaimAmount.call({from:franks_address});
    }).then(function(result){
      console.log('   Frank can claim ',web3.fromWei(result.toNumber(),'ether'), ' Ethers.');

      return new_bidding_contract.getClaimAmount.call({from:marias_address});
    }).then(function(result){
      console.log('   Maria can claim ',web3.fromWei(result.toNumber(),'ether'), ' Ethers.');

      return new_bidding_contract.getClaimAmount.call({from:mitchels_address});
    }).then(function(result){
      console.log('   Mitchel can claim ',web3.fromWei(result.toNumber(),'ether'), ' Ethers.  It should be 0 because Mitchel was the winner');
      console.log('');

      new_bidding_contract.claimEthers({from:marias_address});
      console.log('   Maria claims her ethers...');

      return new_bidding_contract.getBalance.call({from:owners_address});
    }).then(function(result){
      // Print contract balance
      console.log('After Maria clains her ethers: Final Smart contract balance with new_bidding_contract.getBalance: ',web3.fromWei(result.toNumber(),'ether'));
      
      return web3.eth.getBalance(marias_address);
    }).then(function(result){
      // Print contract balance
      console.log('   Final Maria\'s balance : ',web3.fromWei(result.toNumber(),'ether'));
      console.log('');

      new_bidding_contract.claimEthers({from:bills_address});
      console.log('   Bill claims his ethers...');
      
      return new_bidding_contract.getBalance.call({from:owners_address});
    }).then(function(result){
      // Print contract balance
      console.log('After Bill claims his ethers: Final Smart contract balance with new_bidding_contract.getBalance: ',web3.fromWei(result.toNumber(),'ether'));
      
      return web3.eth.getBalance(bills_address);
    }).then(function(result){
      // Print contract balance
      console.log('   Final Bill\'s balancce : ',web3.fromWei(result.toNumber(),'ether'));
      console.log('');

      new_bidding_contract.claimEthers({from:franks_address});
      console.log('   Frank claims his ethers...');
      
      return new_bidding_contract.getBalance.call({from:owners_address});
    }).then(function(result){
      // Print contract balance
      console.log('After Mitchel claims his ethers: Final Smart contract balance with new_bidding_contract.getBalance: ',web3.fromWei(result.toNumber(),'ether'));
      
      return web3.eth.getBalance(mitchels_address);
    }).then(function(result){
      // Print contract balance
      console.log('   Final Mitchel\'s balancce : ',web3.fromWei(result.toNumber(),'ether'));


      return new_bidding_contract.hasBidExpired.call();
    }).then(function(result){

      console.log('--------------------------');
      console.log('Is Bidding expired?: ',result);
      if(result == true ) {
        console.log(' --> The bidding time is over. Bidders should claim their ethers!!!');
      } else {
        console.log(' --> The bidding is still open. Bidders still have time to participate in the bidding!!!');
      }
      console.log('');
      
      return new_bidding_contract.canBidEnd();
    }).then(function(result){

      console.log('--------------------------');
      console.log('Can bid end?: ',result);
      if(result == false ) {
        console.log(' --> There still are bidders without claiming their ethers!!!');
      } else {
        console.log(' --> All the bidders have claimed their ethers');
      }
      
      return new_bidding_contract.endBidding();
    }).then(function(result){
      console.log('');
      console.log('--------------------------');
      console.log('Bidding has been destroyed');
      
      return web3.eth.getBalance(owners_address);
    }).then(function(result){
      // Print Bill's balance
      console.log('');
      console.log('   FINAL Owner\'s balance after the end of bidding : ',web3.fromWei(result.toNumber(),'ether'));
    });
  });
});


function  printNumberOfBidders(new_bidding_contract){
  new_bidding_contract.getNumberOfBidders.call().then( function(result){
    console.log('Number of bids so far (not winner bids): ',result.toNumber());
  });
}

function  printHighestBid(new_bidding_contract){
  new_bidding_contract.getHighBid.call().then( function(result){
    console.log('Highest Bid so far : ',web3.fromWei(result.toNumber(),'ether'));
  });
}


function getDateTime() {
  var now     = new Date(); 
  var year    = now.getFullYear();
  var month   = now.getMonth() + 1; 
  var day     = now.getDate();
  var hour    = now.getHours();
  var minute  = now.getMinutes();
  var second  = now.getSeconds(); 

  if( month.toString().length == 1 ) {
    var month = '0' + month;
  }
  if( day.toString().length == 1 ) {
    var day = '0' + day;
  }   
  if( hour.toString().length == 1 ) {
    var hour = '0' + hour;
  }
  if( minute.toString().length == 1 ) {
    var minute = '0' + minute;
  }
  if( second.toString().length == 1 ) {
    var second = '0' + second;
  }

  var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;   
  return dateTime;
}



// Basic delay function based on milliseconds.
// NOTE: DO NOT USE ON PUBLIC WEBSITES.
// For browsers, setTimeout and setInterval function are the way to go.
// BUT: For testing server-side code, or simulations like the one we want to perform here
// we require a blocking function (where we can effectively have thread synchronization).
// So, the ugly solution is here:
function uglyDelay(ms) {
    var datetime = getDateTime();
    console.log('      --->Start delay: ', datetime);
    var unixtime_ms = new Date().getTime();
    while(new Date().getTime() < unixtime_ms + ms) {}
    var datetime = getDateTime();
    console.log('      --->End delay: ', datetime);
}
