const http = require("http");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
let sql;

const db = new sqlite3.Database(
  "./database/accounts.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log("Database Connected");
  }
);

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

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.log(`File not found: ${filePath}`);
      res.writeHead(404);
      res.end("Not found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
}

const server = http.createServer((req, res) => {
  console.log(`Received request for: ${req.url}`);
  
  if (req.url === "/auth" && req.method === "GET") {
    serveFile(res, path.join(__dirname, "Auth Page", "auth.html"), "text/html");
  } else if (req.url === "/" && req.method === "GET") {
    serveFile(
      res,
      path.join(__dirname, "Landing Page", "index.html"),
      "text/html"
    );
  } else if (req.url.endsWith(".css")) {
    serveFile(res, path.join(__dirname, req.url), "text/css");
  } else if (req.url.endsWith(".js")) {
    serveFile(res, path.join(__dirname, req.url), "application/javascript");
  } else if (
    req.url.endsWith(".png") ||
    req.url.endsWith(".jpg") ||
    req.url.endsWith(".jpeg") ||
    req.url.endsWith(".gif") ||
    req.url.endsWith(".svg") ||
    req.url.endsWith(".ico")
  ) {
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
    console.log(`404 - Route not found: ${req.url}`);
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
