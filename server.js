//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//

var path        = require("path");
var express     = require('express');
var app         = express()
var compression = require('compression');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//


//router.use(express.static(path.resolve(__dirname, 'Client')));
app.use(compression());
app.use('/bower_components', express.static(path.resolve(__dirname, 'bower_components')))
app.use(express.static(path.resolve(__dirname, 'Client')));

app.get('/', function (req, res) {
  res.sendFile('./Client/index.html');
})

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
 console.log('helllo ');
});
