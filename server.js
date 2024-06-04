const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jeg",
    "jpg": "image/jpg", 
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
}

const hostname = '127.0.0.1';
const port = 3000;


http.createServer((req, res) => {
    const uri = url.parse(req.url).pathname;
    const fileName = path.join(process.cwd(), decodeURI(uri));

    console.log('Loading ' + uri);

    let stats; 

    try {
        stats = fs.lstatSync(fileName);
    } catch(err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 No Found\n');
        res.end();
        return;
    }

    if(stats.isFile()) {
        let mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200, {'Content-Type': mimeType});

        const fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if(stats.isDirectory()) {
        res.writeHead(302, {'Location': 'index.html'});
        res.end();
    } else {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('500 Internal Error\n');
        res.end();
        return;
    }
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});