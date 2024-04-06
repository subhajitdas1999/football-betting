const { ethers, upgrades } = require("hardhat");

const proxyAddress = "0x1f27fdaB64E140277f9FFCb6c2911D06f6cf34b4";

async function main() {
  const BettingContract = await ethers.getContractFactory("BettingContract");
  await upgrades.upgradeProxy(proxyAddress, BettingContract);
  console.log("New BettingContract implementation added");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
