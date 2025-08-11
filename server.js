const http = require("http");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
let sql;

// connect to DB
const db = new sqlite3.Database(
  "./database/accounts.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log("Connected");
  }
);

// this creates a table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      password TEXT NOT NULL
    )
  `);
});

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

/*
   req – Contains details about the incoming request (URL, method, etc.).
   res – Used to send a response back to the browser.
*/
const server = http.createServer((req, res) => {
  console.log(`Received request`);
  if (req.url === "/auth" && req.method === "GET") {
    // here /auth is the GET Request
    serveFile(res, path.join(__dirname, "Auth Page", "auth.html"), "text/html");
  } else if (req.url === "/" && req.method === "GET") {
    //here when we are in / root it tells browser to call index.html
    serveFile(
      res,
      path.join(__dirname, "Landing Page", "index.html"),
      "text/html"
    );
  } else if (req.url.endsWith(".css")) {
    //if the html asks css it sends css
    serveFile(res, path.join(__dirname, req.url), "text/css");
  } else if (req.url.endsWith(".js")) {
    //if the html asks js it sends css
    serveFile(res, path.join(__dirname, req.url), "application/javascript");
  } else if (
    req.url.endsWith(".png") ||
    req.url.endsWith(".jpg") ||
    req.url.endsWith(".jpeg") ||
    req.url.endsWith(".gif") ||
    req.url.endsWith(".svg") ||
    req.url.endsWith(".ico")
  ) {
    // Serve image files
    const ext = path.extname(req.url).toLowerCase();
    const mimeTypes = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
    };
    serveFile(
      res,
      path.join(__dirname, req.url),
      mimeTypes[ext] || "application/octet-stream"
    );
  } else {
    // if nothing is match sends 404
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
