const nft = artifacts.require("FunPlayNFT");

module.exports = async function (deployer) {
 await deployer.deploy(nft);
};
