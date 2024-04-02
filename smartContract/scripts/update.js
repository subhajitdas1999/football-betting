const { ethers, upgrades } = require("hardhat");

const proxyAddress = "0xC1A566F0a33549bAa344e23282705A7008dCb4E8";

async function main() {
  const BettingContract = await ethers.getContractFactory("BettingContract");
  await upgrades.upgradeProxy(proxyAddress, BettingContract);
  console.log("New BettingContract implementation added");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
