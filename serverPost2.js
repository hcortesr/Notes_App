const http = require("node:http");
const fs = require("node:fs/promises");
const querystring = require("node:querystring");
const { pool, getPassUser, getUserCards, createSession, getSession } = require("./sqlConnection.js");



const server = http.createServer((req, res) => {

    console.log(req.url);
    // console.log(req.url)
    if (req.url == '/') {

        // Getting the session cookie.
        let cookie = req.headers.cookie;
        if (cookie != undefined) {
            cookie = cookie.substring(4); // Removes the part of the name of the variable from the string.

        }

        // Getting the session after the cookie has been read.
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


        // Obtención de JS y CSS ------------------------------------

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
    } else if (req.url == '/signIn') {
        fs.readFile('./res/signIn.html')
        .then(txt => {
            res.writeHead(200, {
                'Content-type': 'text/html',
            })
            
            res.end(txt);
        })
    } else if (req.url == '/styleSignIn.css') {
        console.log("Entro al if");
        fs.readFile('./res/styleSignIn.css')
        .then(txt => {
            res.writeHead(200, {
                'Content-type': 'text/css',
            });
            res.end(txt);
        });
    } else if (req.url == '/handleLogIn' && req.method == 'POST') {
        
        let info = "";
        req.on("data", (chunck) => {
        info += chunck;
        });

        req.on("end", async () => {
            const query = querystring.parse(info);
            const userPass = await getPassUser(query.username);
    
            if (userPass == query.password) {
            createSession(query.username);
            res.end("Sesión creada");
            } else {
            console.log(false);
            res.end("Error de inicio de sesión");
            }
        });
    }


});

server.listen(3000, "localhost", () => {
    console.log(`Servidor escuchando en puerto: http://localhost:${server.address().port}`);
});
