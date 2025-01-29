const http = require('node:http');

const server = http.createServer((req, res) => {
    console.log("request");
    if (req.url == '/') {
        res.writeHead(200, {
            'Set-Cookie': 'user=; HttpOnly; Max-Age=100',
            'Set-Cookie': 'name=; HttpOnly; Max-Age=100',
            'Content-Type': 'text/plain',

        })
        res.end("Text")
    } else if (req.url == '/read') {
        let cook = req.headers.cookie;
        cook = cook.substring(5)
        console.log(cook);
        if (cook) {
            console.log(true);
        } else {
            console.log(false);
        }

    }
});

server.listen(3000, 'localhost', () => {
    console.log("Escuchando puerto");
});