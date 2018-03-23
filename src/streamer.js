const HLSServer = require('hls-server')
const http = require('http')
var httpAttach = require('http-attach')

var server = http.createServer();

var hls = new HLSServer(server, {
    path: '/streams',
    dir: 'public/local'
});

//Adding CORS U_U
httpAttach(server, function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

server.listen(8000, function () {
    console.log('server is listening');
});