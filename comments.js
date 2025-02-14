// Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const comments = require('./comments');

// Create the server
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, content) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('500 Internal Server Error');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content);
                }
            });
        } else if (req.url === '/comments') {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(comments));
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 Not Found');
        }
    } else if (req.method === 'POST') {
        if (req.url === '/comments') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const comment = JSON.parse(body);
                comments.push(comment);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(comment));
            });
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 Not Found');
        }
    } else {
        res.writeHead(405, {'Content-Type': 'text/plain'});
        res.end('405 Method Not Allowed');
    }
});

// Start the server
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});