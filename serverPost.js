const http = require("node:http");
const fs = require("node:fs/promises");
const querystring = require("node:querystring");
const { pool, getPassUser, getUserCards, createSession } = require("./sqlConnection.js");



const server = http.createServer((req, res) => {

  // Getting the session cookie
  let cookie = req.headers.cookie.substring(3);


  // Parte de obtención de datos
  if (req.method === "GET") {
    fs.readFile("./form.html", "utf-8").then((txt) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(txt);
    });
  } else if (req.method === "POST") {
    let info = "";
    req.on("data", (chunck) => {
      info += chunck;
    });

    req.on("end", async () => {
      const query = querystring.parse(info);
      const userPass = await getPassUser(query.nombre);

      if (userPass == query.contrasegna) {
        createSession(query.nombre);
        res.end("Sesión creada");
      } else {
        console.log(false);
        res.end("Error de inicio de sesión");
      }
    });


  }
});

server.listen(3000, "localhost", () => {
  console.log(`Servidor escuchando en puerto: ${server.address().port}`);
});
