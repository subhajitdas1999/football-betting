const { ethers, upgrades } = require("hardhat");
require("dotenv").config({ path: "../.env" });

async function main() {
  const [admin, ...addrs] = await ethers.getSigners();
  console.log("Admin Wallet Address", admin.address);
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
  const adminBalanceBefore = ethers.formatEther(
    await provider.getBalance(admin.address)
  );
  console.log("Admin balance before", adminBalanceBefore, "Matic");
  const BettingContract = await ethers.getContractFactory("BettingContract");

  //
  const routerAddress = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";
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
    "https://sepolia.etherscan.io/address/" + bettingContract.target
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
// sepolia 0x797fFE9a4A278144DF216d6828E1dbd2F10A1107
