const HDWalletProvider = require('@truffle/hdwallet-provider');
const web3 = require("web3");
const fs = require('fs');
const path = require("path");
require('dotenv').config()

//*vars
const MNEMONIC = process.env.MNEMONIC
const API_KEY = process.env.NODE_KEY


//* Remember to write the nft address in manually after deploying the contract
const NFT_CONTRACT_ADDRESS = "0x3C9Dd7589d47b688A96a4D9aD578458a6BAb5768";
const OWNER_ADDRESS = "0x54CBc2F616Fa45617f484e4D7bDC898F52069bc5";
const MUMBAI = `https://rpc-mumbai.maticvigil.com/v1/${API_KEY}`
const MATIC = `https://rpc-mainnet.maticvigil.com/v1/${API_KEY}`
const Ropsten = `https://ropsten.infura.io/v3/${API_KEY}`
const Rinkeby = `https://ropsten.infura.io/v3/${API_KEY}`

const NUM_ITEMS = 5;


//*Parse the contract artifact for ABI reference.
let rawdata = fs.readFileSync(path.resolve(__dirname, "../build/contracts/FunPlayNFT.json"));
let contractAbi = JSON.parse(rawdata);
const NFT_ABI = contractAbi.abi

async function main() {

  try {
    //*define web3, contract and wallet instances
    const provider = new HDWalletProvider(
      MNEMONIC,
      Rinkeby
    );

    const web3Instance = new web3(provider);

    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
    );
    // // reveal
    await nftContract.methods.revealNow().send({ from: OWNER_ADDRESS })
    .on('transactionHash', function(hash){
      console.log('tx hash:', hash);
    })  
    .then(console.log('reveal now'))
    .catch(error => console.log(error));

    // // check reveal value
    await nftContract.methods.reveal().call({ from: OWNER_ADDRESS })
    .then(function(result){
      console.log("reveal value:",result);
    })
    .catch(error => console.log(error));


    // // active contract
    await nftContract.methods.setIsActive(true).send({ from: OWNER_ADDRESS })
    .on('transactionHash', function(hash){
      console.log('tx hash:', hash);
    })
    .then(console.log('set contract active'))
    .catch(error => console.log(error));
    
    await nftContract.methods.isActive().call({ from: OWNER_ADDRESS })
    .then(function(result){
      console.log("isActive value:",result);
    })
    .catch(error => console.log(error));

    await nftContract.methods.setPresaleActive(true).send({ from: OWNER_ADDRESS })
    .on('transactionHash', function(hash){
      console.log('tx hash:', hash);
    })
    .then(console.log('set presale active'))
    .catch(error => console.log(error));

    await nftContract.methods.isPresaleActive().call({ from: OWNER_ADDRESS })
    .then(function(result){
      console.log("isPresaleActive value:",result);
    })
    .catch(error => console.log(error));

    // mintNFT
    await nftContract.methods.mintNFTDuringPresale(1).send({ from: OWNER_ADDRESS, value: 50000000000000000})
    .on('transactionHash', function(hash){
      console.log('tx hash:', hash);
    })
    .then(console.log('mint nft'))
    .catch(error => console.log(error));

    // console.log("result:",result);
    // result object contains import information about the transaction
    // console.log("Value was set to", result);

    // await nftContract.methods
    //   .revealNow()
    //   .then(console.log('minted')).catch(error => console.log(error));

      //* just mint 
    // await nftContract.methods
    //   .mintItem(OWNER_ADDRESS,"https://ipfs.io/ipfs/QmZrRSaCERJQYVdwAM678QRTT5Zc1VSb75o1Uj8FTJJsaW")
    //   .send({ from: OWNER_ADDRESS }).then(console.log('minted')).catch(error => console.log(error));


    //* mint for a certain amount
    /*
    for (var i = 1; i < NUM_ITEMS; i++) {
      await nftContract.methods
        .mintItem(OWNER_ADDRESS, `https://ipfs.io/ipfs/QmZ13J2TyXTKjjyA46rYENRQYxEKjGtG6qyxUSXwhJZmZt/${i}.json`)
        .send({ from: OWNER_ADDRESS }).then(console.log('minted')).catch(error => console.log(error));
    }
    */
  }
  catch (e) {
    console.log(e)
  }
}

//invoke
main().then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
