NewBiddingContract example
This is an implementation of the BiddingContract proposed in the Udemy course
https://www.udemy.com/ethereum-dapp/learn/v4/overview in section 8.92.

Setup:
Truffle v4.0.6 (core: 4.0.6)
Solidity v0.4.19 (solc-js)

Compilation, migration and testing:

> truffle compile

> truffle migrate --network development --reset --all

> truffle test ./test/new_bidding_contract.js

====================

Results of testing:

```
Using network 'development'.

  Contract: NewBiddingContract
Deployement time:  2018/03/06 10:20:24

   Owner's balance before bidding :  99.6540134

   Bill's balance before bidding :  100
   Frank's balance before bidding:  100
   Maria's balance before bidding:  100
   Mitchel's balance before bidding:  100

   Bill placed a Bid with 4 ethers... 
   Frank placed a Bid with 5 ethers... 
   Maria placed a Bid with 6 ethers... 
      --->Start delay:  2018/03/06 10:20:24
      --->End delay:  2018/03/06 10:20:26
   Mitchel placed a Bid with 7 ethers... 

Smart contract balance with new_bidding_contract.getBalance:  22
Smart contract balance with web3.eth.getBalance():  22

   Bill's balance after bidding :  95.9906439
   Frank's balance after bidding:  94.9843147
   Maria's balance after bidding:  93.9858147
   Mitchel's balance after bidding:  92.9858211

Highest Bid so far :  7
Number of bids so far (not winner bids):  3

Final Smart contract balance with new_bidding_contract.getBalance:  22
Final Smart contract balance with web3.eth.getBalance:  22
      --->Start delay:  2018/03/06 10:20:27
      --->End delay:  2018/03/06 10:20:33

   Bill can claim  4  Ethers
   Frank can claim  5  Ethers.
   Maria can claim  6  Ethers.
   Mitchel can claim  0  Ethers.  It should be 0 because Mitchel was the winner

   Maria claims her ethers...
After Maria clains her ethers: Final Smart contract balance with new_bidding_contract.getBalance:  16
   Final Maria's balance :  99.9803735

   Bill claims his ethers...
After Bill claims his ethers: Final Smart contract balance with new_bidding_contract.getBalance:  12
   Final Bill's balancce :  99.9852867

   Frank claims his ethers...
After Mitchel claims his ethers: Final Smart contract balance with new_bidding_contract.getBalance:  7
   Final Mitchel's balancce :  92.9858211
--------------------------
Is Bidding expired?:  true
 --> The bidding time is over. Bidders should claim their ethers!!!

--------------------------
Can bid end?:  true
 --> All the bidders have claimed their ethers

--------------------------
Bidding has been destroyed

   FINAL Owner's balance after the end of bidding :  106.652645
    ✓ should assert true (9742ms)


  1 passing (10s)
```


