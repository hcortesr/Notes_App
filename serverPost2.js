const http = require("node:http");
const fs = require("node:fs/promises");
const querystring = require("node:querystring");
const { pool, getPassUser, getUserCards, createSession, getSession } = require("./sqlConnection.js");



const server = http.createServer((req, res) => {

    // console.log(req.url)
    if (req.url == '/') {
        // Getting the session cookie
        let cookie = req.headers.cookie;
        if (cookie != undefined) {
            cookie = cookie.substring(4);

        }
        (async () => {

            // await getUserCards("1");
            const isSession = await getSession("7");
            if (isSession) {
                const cards = await getUserCards("7");
                // console.log(cards);

                let file = await fs.readFile('./res/index.html', 'utf-8');

                console.log(JSON.stringify(cards));

                file = file.replace('<script src="script3.js?v=1.3"></script>', `<script>let arrayNotes = ${JSON.stringify(cards)};</script>`);
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                })
                res.end(file);



            } else {
                console.log("no hubo sesión");
            }
            res.end();
        })()

    } else if (req.url == '/style.css?v=1.3') {
        fs.readFile('./res/style.css', 'utf-8')
            .then((txt) => {
                res.writeHead(200, {
                    'Content-Type': 'text/css'
                });
                // console.log("Lyeyendo css")
                res.end(txt);
            })
    } else if (req.url == '/script3.js?v=1.3') {
        fs.readFile('./res/script3.js', 'utf-8')
            .then((txt) => {
                res.writeHead(200, {
                    'Content-Type': 'application/javascript'
                });
                // console.log("Lyeyendo js3")
                res.end(txt);
            })
    } else if (req.url == '/script2.js?v=1.3') {
        fs.readFile('./res/script2.js', 'utf-8')
            .then((txt) => {
                res.writeHead(200, {
                    'Content-Type': 'application/javascript'
                });
                // console.log("Lyeyendo js2")
                res.end(txt);
            })
    } else if (req.url == '/script1.js?v=1.3') {
        fs.readFile('./res/script1.js', 'utf-8')
            .then((txt) => {
                res.writeHead(200, {
                    'Content-Type': 'application/javascript'
                });
                // console.log("Lyeyendo js1")
                res.end(txt);
            })
    }


});

server.listen(3000, "localhost", () => {
    console.log(`Servidor escuchando en puerto: ${server.address().port}`);
});
