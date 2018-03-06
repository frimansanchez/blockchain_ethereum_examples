pragma solidity ^0.4.4;

/**
 * Project work: New Bidding contract
 * Implements the shell for the contract exercise described in the last section
 * Part of an online course.
 * http://acloudfan.com/learn-blockchain
 *
 * PLEASE NOTE : THIS IS A SHELL AND WILL REQUIRE YOU TO CODE THE FUNCTIONS
 *               OTHERWISE YOU WILL GET COMPILATION ERRORS
 **/

/**
 * Additional description:
 * This is an implementation of the BiddingContract exercise proposed in the Udemy Course.
 * Implemented by Friman Sanchez. friman.sanchez.at.gmail.com
 * 
 * Some changes has been included:
 * 1. duration variable is in seconds
 * 2. Some additional methods are included: 
 *    - getNumberOfBidders()
 *    - removeBidder()
 *    - hasBidExpired()
 *    - 
 **/
 
 
 //import "./NewBiddingContractAbstract.sol";


//contract NewBiddingContract is NewBiddingContractAbstract {
contract NewBiddingContract {

  string    name;
  string    description;
  uint      duration;
  uint      startBid;
  uint      createdAt;
  address   owner;
  
  
  struct Bidder {
    address   bidder;
    string    name;
    uint      bidAmount;
    bool      claimedEthers;
  }

  // Declare the events
  event HighBidChanged(address addr, string nm, uint  newHighBid);
  event BidFailed(address addr, string nm, uint bidAmt);

  // Maintain all bidders in an array
  Bidder[]  bidders;

  // This maintains the highest bidder
  Bidder    highBidder;

  // Modifier to ensure the owner is the only one with with execution permission.
  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }
  
  // Ensures that bid can be received i.e, auction not ended
  modifier timed {
    if(now < createdAt + duration){
      _;
    } else {
      revert();
    }
  }

  // Ensures that bid cannot be received i.e, auction ended
  modifier expired {
    if(now >= createdAt + duration){
      _;
    } else {
      revert();
    }
  }
  
  /**
   * Duration in seconds
   * start price in ethers
   * constructor
   **/
  function NewBiddingContract(string nm, 
                              string desc, 
                              uint dur,
                              uint sBid
                              ) public payable {

    name=nm;
    description=desc;
    duration= dur;
    startBid= sBid;
    // Initalize createdAt to current time
    createdAt = now;
    owner = msg.sender;
    highBidder.bidAmount = startBid; 
  }

  /**
   * Bid function is what gets called by any bidder
   * Losers will be added to the bidders array. The claim flag in struct
   * maintains the status of whether the caller has already been given the ethers or not
   **/
  function  placeBid(string newName, uint newBid) public payable timed {

    // Some check.
    if(msg.value != newBid) revert();
    if(msg.value < startBid) revert();
    
    uint currentHighestBid = getHighBid();

    // Create a Bidder structure and add to bidders array
    Bidder memory theBidder;
    theBidder.bidder        = msg.sender;
    theBidder.name          = newName;
    theBidder.bidAmount     = newBid;

    theBidder.claimedEthers = true;

    // Consider the case when there is no bid
    if( highBidder.bidder == address(0x0) ) {
      // Replace the highBidder with the new high bidder
      highBidder = theBidder;
      // Emit High bid event
      HighBidChanged(msg.sender, newName, newBid);
    } else {
      if( newBid <= currentHighestBid ) {
        // Put theBidder into to bidders array.
        bidders.push(theBidder);
        // Emit a BidFailed Event
        BidFailed(msg.sender, newName, newBid);
      } else { // newBid > currentHighestBid
        // Add the current high bidder to bidders array
        bidders.push(highBidder);

        // Replace the highBidder with the new high bidder
        highBidder = theBidder;
        // emit High bid event
        HighBidChanged(msg.sender, newName, newBid);
      }
    }
  }


  function getHighBid() public constant returns (uint) {
    // Return the bidAmount held in high bidder
    return highBidder.bidAmount;
  }

  /**
   * This is invoked by anyone to check if there are ethers
   * in the contract that they can claim
   **/
  function  getClaimAmount() public view returns(uint){
    for(uint i=0; i<bidders.length ; i++) {
      // check if msg.sender is in the bidders
      if( msg.sender == bidders[i].bidder) {
        // check if claims flag is TRUE
        if(bidders[i].claimedEthers) {
          // return the bidAmount
          return bidders[i].bidAmount;
        }
        return 0; // if claimedEthers is false, then return 0.
      }
    }
    return 0;  // If there is not any bidder yet, then return 0.
  }

  
  /**
   * claimEthers: This is basically the withdraw function.
   * Losers will call this to get their bid ethers back  
   **/
  function  claimEthers() public {
    // Check if there is a balance for the caller
    for(uint i=0; i < bidders.length; i++){
      // check if msg.sender is in the bidders
      if(msg.sender == bidders[i].bidder){
        // check if claims flag is TRUE

        require(bidders[i].claimedEthers);

        uint amount = bidders[i].bidAmount;

        // Old version: 
        // We do not remove the bidder from the bidders, but 
        // we change the bidAmount and claimedEthers elements for this bidder
        // bidders[i].bidAmount = 0;
        // bidders[i].claimedEthers= false;
        
        // New version: we remove the bidder from the array of bidders.
        removeBidder(i);

        // revert() if sender returns a false
        assert(msg.sender.send(amount));

        return;
      }
    }
    // That means the address was not found in the list of payers
    revert();
  }
  
  /** getNumberOfBidders(): This methods can be called by anyone
   * to know how many bidders are so far.
   **/
  function getNumberOfBidders() public constant returns (uint) {
    // Return the bidAmount held in high bidder
    return bidders.length;
  }

  /** 
   * removeBidder(): Method to remove a lossing bidder from theBidder
   * bidders array.
   **/
  function removeBidder(uint index) private {    
    if (index < bidders.length) {    
      //Copy the last bidder of the array into the position [index].
      bidders[index] = bidders[bidders.length-1];
      delete bidders[bidders.length-1];
      bidders.length--;
    }
    return;
  }
  
  /** hasBidExpired(): Method to see if the bid has expired
   * because of time
   **/
  function  hasBidExpired() public view returns (bool) {
    // If there are not bidders to claim their ethers
    if(now >= createdAt + duration) {
      return true;
    }
    return false;
  }

  /** 
   * CanBidEnd() is used to know if there are unclaimed ethers 
   * In a later version the claims data will be moved to a separate contract
   * Claims will be made losers against the separate contract
   **/
  function  canBidEnd() public view returns (bool) {
    // If there are not bidders to claim their ethers
    if(bidders.length == 0) {
        return true;
    }
    return false;
  }

  /**
   * To know the balance of the contract. Only owner can execute this method.
   **/
  function getBalance() onlyOwner public view returns (uint){
    return this.balance;
  }
  
  /** 
   * This ends the bidding:
   * - Only owner can call this function - apply modifier
   * - Only when the bidding has expired - apply modifier
   * All ethers are returned to the owner as part of self destruct
   **/
  function endBidding() onlyOwner expired public {
    selfdestruct(owner);
  }

  
  // If payable fallback is not defined then you wont be able to send 
  // ethers to the contract
//  function() public payable {
//    // Do nothing at this time....
//  }

}
