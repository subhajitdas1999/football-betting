const id = parseInt(args[0]);
const gameStatus = args[1];
const APISPORTSKEY = args[2];
const APISPORTSHOST = args[3];
// make HTTP request
const url = `https://v3.football.api-sports.io/fixtures`;
console.log(`HTTP GET Request to ${url}?id=${id}`);

const fixtureStatusRequest = Functions.makeHttpRequest({
  url: url,
  headers: {
    "Content-Type": "application/json",
    "x-rapidapi-key": APISPORTSKEY,
    "x-rapidapi-host": APISPORTSHOST,
  },
  params: {
    timezone: "Asia/Kolkata",
    id,
    status: gameStatus,
  },
});

// Execute the API request (Promise)
const fixtureStatusResponse = await fixtureStatusRequest;
if (fixtureStatusResponse.error) {
  console.error(fixtureStatusResponse.error);
  throw Error("Request failed");
}

const data = fixtureStatusResponse["data"];
if (data.Response === "Error") {
  console.error(data.Message);
  throw Error(`Functional error. Read message: ${data.Message}`);
}
// console.log("fixtureStatusResponse", fixtureStatusResponse);
const home = parseInt(data.response[0].goals.home);
const away = parseInt(data.response[0].goals.away);
const result = home > away ? 0 : 1;

return Functions.encodeUint256(result);
