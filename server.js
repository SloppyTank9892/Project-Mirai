const http = require("http");
const fs = require("fs");
const path = require("path");

// fake user database
// gonna change after setting up
let users = [];

// read the file in disk which is then sent to server to browser for it to load
function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404); // sends 404 ERROR code if file is not found
      res.end("Not found");
    } else {
      res.writeHead(200, { "Content-Type": contentType }); //tells the browser what it is
      res.end(content);
    }
  });
}

// Here req is the request varable we sent and res is response we get
const server = http.createServer((req, res) => {
  console.log(`Received request`);
  if (req.url === "/auth" && req.method === "GET") {
    serveFile(res, path.join(__dirname, "Auth Page", "Auth.html"), "text/html");
  } else if (req.url === "/" && req.method === "GET") {
    serveFile(
      res,
      path.join(__dirname, "Landing Page", "index.html"),
      "text/html"
    );
  } else if (req.url.endsWith(".css")) {
    //browser asks this we send this
    serveFile(res, path.join(__dirname, req.url), "text/css"); //browser asks this we send this
  } else if (req.url.endsWith(".js")) {
    serveFile(res, path.join(__dirname, req.url), "application/javascript"); //browser asks this we send this
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
