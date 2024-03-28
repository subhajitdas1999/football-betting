const { ethers, upgrades } = require("hardhat");

const proxyAddress = "0xE6a9DE39B9Bc5C0a4F4Db1d579cb643a8878aa78";

async function main() {
  const CarbonCreditMarketPlaceV3 = await ethers.getContractFactory(
    "CarbonCreditMarketPlaceV3"
  );
  await upgrades.upgradeProxy(proxyAddress, CarbonCreditMarketPlaceV3);
  console.log("New Marketplace implementation added");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
