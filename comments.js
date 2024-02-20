// Create web server

// Load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var comments = require('./comments');

var server = http.createServer(function(req, res){
    var urlObj = url.parse(req.url, true);
    var pathname = urlObj.pathname;
    if(pathname === '/'){
        pathname = '/index.html';
    }
    if(pathname === '/index.html'){
        var now = new Date();
        res.setHeader('Set-Cookie', 'lastVisit=' + now.getTime());
    }
    var extname = path.extname(pathname);
    if (pathname === '/addComment') {
        var comment = urlObj.query.comment;
        comments.addComment(comment, function(err){
            if (err) {
                res.end('server error');
            } else {
                comments.getComments(function(err, data){
                    if (err) {
                        res.end('server error');
                    } else {
                        res.end(data);
                    }
                });
            }
        });
    } else if (pathname === '/getComments') {
        comments.getComments(function(err, data){
            if (err) {
                res.end('server error');
            } else {
                res.end(data);
            }
        });
    } else {
        fs.readFile(__dirname + pathname, function(err, data){
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end('<h1>404 Not Found</h1>');
            }else{
                var contentType = 'text/html';
                switch (extname) {
                    case '.js':
                        contentType = 'text/javascript';
                        break;
                    case '.css':
                        contentType = 'text/css';
                        break;
                    case '.jpg':
                        contentType = 'image/jpeg';
                        break;
                    case '.png':
                        contentType = 'image/png';
                        break;
                    case '.gif':
                        contentType = 'image/gif';
                        break;
                }
                res.writeHead(200, {'Content-Type': contentType});
                res.end(data);
            }
        });
    }
}).listen(8080, function(){
    console.log('Server is running at http://localhost:8080');
});