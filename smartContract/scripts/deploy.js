const { ethers, upgrades } = require("hardhat");
require("dotenv").config({ path: "../.env" });

async function main() {
  const [admin, ...addrs] = await ethers.getSigners();
  console.log("Admin Wallet Address", admin.address);
  const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_URL);
  const adminBalanceBefore = ethers.formatEther(
    await provider.getBalance(admin.address)
  );
  console.log("Admin balance before", adminBalanceBefore, "Matic");
  const BettingContract = await ethers.getContractFactory("BettingContract");

  //
  const routerAddress = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C";
  const secretHash =
    "0x6e4273316b49377475653257785543716637434735726d495a325a4437733400";
  const bettingContract = await upgrades.deployProxy(
    BettingContract,
    [routerAddress, secretHash],
    {
      initializer: "initialize",
    },
    { kind: "uups" }
  );
  await bettingContract.waitForDeployment();
  console.log(
    "Betting contract deployed at",
    "https://mumbai.polygonscan.com/address/" + bettingContract.target
  );

  const adminBalanceAfter = ethers.formatEther(
    await provider.getBalance(admin.address)
  );
  console.log("Admin balance after", adminBalanceAfter, "Matic");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0xC1A566F0a33549bAa344e23282705A7008dCb4E8
