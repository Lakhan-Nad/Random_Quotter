require("dotenv").config();
const http = require("http");
const app = require("./index");

// app = (req, res) => {
//   console.log(quotes);
//   res.end();
// };

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Listening on port: ", port);
});
