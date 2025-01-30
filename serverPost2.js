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
            cookie = cookie.substring(11); // Removes the part of the name of the variable from the string.
            console.log("La cookie", cookie);
        }

        // Getting the session after the cookie has been read.
        (async () => {

            // await getUserCards("1");
            const isSession = await getSession(cookie);
            if (isSession) {
                const cards = await getUserCards(cookie);
                // console.log(cards);

                let file = await fs.readFile('./res/index.html', 'utf-8');

                console.log(JSON.stringify(cards));

                file = file.replace('<script src="script3.js?v=1.3"></script>', `<script>let arrayNotes = ${JSON.stringify(cards)};</script>`);
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                })
                res.end(file);



            } else {
                res.writeHead(302, {
                    'Location': '/signIn'
                })
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
    } else if (req.url.startsWith('/signIn')) {
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
            const action = query.action_type;
            const userPass = await getPassUser(query.username);

            // If userPass is 'undefined', that means the user hasn't been created
            if (action == 'Sign In') {
                if (userPass != undefined) {
                    if (userPass == query.password) {
                        const id_session = await createSession(query.username);
                        res.writeHead(302, {
                            'Set-Cookie': `id_session=${id_session}; HttpOnly; Max-Age=3600`,
                            'Location': '/',
                        });
                        res.end();
                    } else {
                        console.log(false);
                        res.writeHead(302, {
                            'Location': '/signIn?screen=userDsntExist',
                        });
                        res.end();
                    }

                }

            }

            console.log("La contraseña es", userPass);


        });
    } else if (req.url == '/scriptSignIn.js') {

        fs.readFile('./res/scriptSignIn.js', 'utf-8')
            .then(txt => {
                res.writeHead(200, {
                    'Content-type': 'application/javascript',
                });
                res.end(txt);

            })

    }


});

server.listen(3000, "localhost", () => {
    console.log(`Servidor escuchando en puerto: http://localhost:${server.address().port}`);
});
