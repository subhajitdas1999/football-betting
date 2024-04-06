const { ethers } = require("hardhat");

async function main() {
  const secret = "nBs1kI7tue2WxUCqf7CG5rmIZ2ZD7s4";
  const fixtureId = 1035038; // Example fixture ID
  const gameStartTimeStamp = 1691839800; // Example timestamp
  const secretHash = ethers.encodeBytes32String(secret);

  // Convert data to a consistent format before hashing

  const offChainHash = ethers.solidityPackedKeccak256(
    ["bytes32", "uint256", "uint256"],
    [secretHash, fixtureId, gameStartTimeStamp]
  );

  // const offChainHash = ethers.solidityPackedKeccak256(
  //   ["uint256", "uint256"],
  //   [fixtureId, gameStartTimeStamp]
  // );
  // Hash the concatenated string
  // const hash = ethers.keccak256(offChainHash);

  console.log(offChainHash);
  console.log("Hash value to pass in constructor ", secretHash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
/**
contract Test {
    bytes32 public secretHash; 

    constructor(bytes32 _secretHash) {
        secretHash = _secretHash;
    }
    function registerGame(uint256 _fixtureId, uint256 _gameStartTimeStamp, bytes32 _hash) view public returns(bool){
        
        bytes32 checkHash = keccak256(abi.encodePacked(secretHash, _fixtureId, _gameStartTimeStamp));
        // bytes32 checkHash = keccak256(abi.encodePacked(_fixtureId, _gameStartTimeStamp));

        
        return checkHash == _hash ;

    }

  
}
 */
