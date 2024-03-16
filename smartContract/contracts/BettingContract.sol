// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {FunctionsClientUpgradeable} from "./FunctionsClientUpgradeable.sol";
import {FunctionsRequest} from "@chainlink/contracts@0.8.0/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract BettingContract is
    OwnableUpgradeable,
    UUPSUpgradeable,
    FunctionsClientUpgradeable
{
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    uint256 public constant PREDICTION_BUFFER_TIME = 2 hours;
    uint256 public constant PLATFORM_FEE = 3;

    struct Game {
        uint256 registrationTime;
        uint256 gameStartTimeStamp;
        uint256 weiCollectedForHome;
        uint256 weiCollectedForAway;
        Prediction[] predictions;
        bool status;
    }

    struct Prediction {
        uint amount;
        address better;
        Result result;
    }
    mapping(uint => Game) public games;
    // mapping (uint =>)

    enum Result {
        None, // The game has not been resolved or the result is a draw
        Home, // The home team won
        Away // The away team won
    }
    event GameRegistered(uint256 fixtureId, address registerer);
    event Predicted(uint256 fixtureId, uint amount);

    //Errors
    error GameIsNotActive();
    error GameIsAlreadyRegistered();
    error TimeStampInPast();
    error UnexpectedRequestID(bytes32 requestId);

    modifier activeGame(uint256 _fixtureId) {
        if (!games[_fixtureId].status) revert GameIsNotActive();
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow-cosntructor
    constructor() {
        _disableInitializers();
    }

    // Initialize function with UUPSUpgradeable
    function initialize(address router) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __FunctionClient_init(router);
    }
    /**
     * @notice Send a simple request
     * @param source JavaScript source code
     * @param encryptedSecretsUrls Encrypted URLs where to fetch user secrets
     * @param donHostedSecretsSlotID Don hosted secrets slotId
     * @param donHostedSecretsVersion Don hosted secrets version
     * @param args List of arguments accessible from within the source code
     * @param bytesArgs Array of bytes arguments, represented as hex strings
     * @param subscriptionId Billing ID
     */
    function sendRequest(
        string memory source,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        if (encryptedSecretsUrls.length > 0)
            req.addSecretsReference(encryptedSecretsUrls);
        else if (donHostedSecretsVersion > 0) {
            req.addDONHostedSecrets(
                donHostedSecretsSlotID,
                donHostedSecretsVersion
            );
        }
        if (args.length > 0) req.setArgs(args);
        if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    /**
     * @notice Store latest result/error
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function _fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        s_lastResponse = response;
        s_lastError = err;
    }

    function registerGame(
        uint256 _fixtureId,
        uint256 _gameStartTimeStamp
    ) public {
        if (!games[_fixtureId].status) revert GameIsAlreadyRegistered();
        if (_gameStartTimeStamp < block.timestamp) revert TimeStampInPast();

        games[_fixtureId].registrationTime = block.timestamp;
        games[_fixtureId].gameStartTimeStamp = _gameStartTimeStamp;
        games[_fixtureId].status = true;
        emit GameRegistered(_fixtureId, msg.sender);
    }

    function registerAndPredictGame(
        uint256 _fixtureId,
        uint256 _gameStartTimeStamp,
        Result _result
    ) external payable {
        registerGame(_fixtureId, _gameStartTimeStamp);
        predictGame(_fixtureId, _result);
    }

    function predictGame(
        uint256 _fixtureId,
        Result _result
    ) public payable activeGame(_fixtureId) {
        Game storage game = games[_fixtureId];
        require(block.timestamp + 2 hours <= game.gameStartTimeStamp);
        Prediction memory newPrediction = Prediction(
            msg.value,
            msg.sender,
            _result
        );
        if (_result == Result.Home) game.weiCollectedForHome += msg.value;
        if (_result == Result.Away) game.weiCollectedForAway += msg.value;

        game.predictions.push(newPrediction);
        emit Predicted(_fixtureId, msg.value);
    }

    // Function to distribute winnings
    function distributeWinnings(
        uint256 _fixtureId,
        Result winningResult
    ) internal {
        Game memory game = games[_fixtureId];
        // Calculate the total amount of tokens wagered on the game
        uint256 totalWager = (
            winningResult == Result.Home
                ? (game.weiCollectedForHome +
                    (game.weiCollectedForAway -
                        (game.weiCollectedForAway * PLATFORM_FEE) /
                        100))
                : ((game.weiCollectedForHome -
                    (game.weiCollectedForHome * PLATFORM_FEE) /
                    100) + game.weiCollectedForAway)
        );

        for (uint i = 0; i < game.predictions.length; i++) {
            Prediction memory prediction = game.predictions[i];

            if (prediction.result == winningResult) {
                uint256 winningAmount = calculateWinnings(
                    _fixtureId,
                    totalWager,
                    prediction.amount,
                    prediction.result
                );

                // Ensure there's enough balance in the contract to pay out the winnings or handle it accordingly
                require(
                    address(this).balance >= winningAmount,
                    "Contract does not have enough funds."
                );

                // Transfer winnings to the predictor
                payable(prediction.better).transfer(winningAmount);
            }
        }
        delete games[_fixtureId];
        // Optionally, reset the game data or mark it as distributed
    }

    function calculateWinnings(
        uint256 _fixtureId,
        uint256 totalWager,
        uint256 wager,
        Result result
    ) public view returns (uint256) {
        Game memory game = games[_fixtureId];

        // Calculate the winnings based on the result and the total amount of tokens wagered
        uint256 winnings = (wager * totalWager) /
            (
                result == Result.Home
                    ? game.weiCollectedForHome
                    : game.weiCollectedForAway
            );
        return winnings;
    }

    function getCurrentTimeStamp() public view returns (uint) {
        return block.timestamp;
    }

    // Ensure only the owner can upgrade the contract
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
