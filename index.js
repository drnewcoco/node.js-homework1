/*
 * Author: Dr NewCoco
 * date: 12 dec 2018
 * Hello World Server
 * NODE_ENV=dev node index.js
 */

//dependencies
var http = require('http');   //to instantiate the http server
var https= require('https');  //to instantiate the https server
var url  = require('url');    //parse the url
var fs   = require('fs');     //file system
var StringDecoder = require('string_decoder').StringDecoder;  //for the payload
var config = require('./config');  //config

//retrieved from the config
console.log('http port '+config.httpPort+' / environment '+config.envName);

//instiating the http server
var httpServer = http.createServer(function(request,response){
  myServer(request,response);
});

httpServer.listen(config.httpPort,function(){
  console.log('The server is listening on port '+config.httpPort);
});

//unified server logic for http and https
var myServer = function(request,response){
  //get the url and parse it.
  var parseUrl = url.parse(request.url,true);
  //get the path of the url
  var path = parseUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');
  //get the query string as an object - recover the parameters after ?, like ...?fid-buz
  var queryStringObject = parseUrl.query;
  //get the headers as an object
  var headers = request.headers;
  //get the http method
  var method = request.method.toLowerCase();
  //parse the data send by POST and get the payload send by the customer if there is any
  var decoder = new StringDecoder('utf-8');
  //chars come as a stream, a little bit at a time, so we accumulate them into a buffer
  var buffer = '';
  //like Jquery, the event 'data' tells us that some data are coming, so we append them until we receive a EOS
  request.on('data',function(data){
    buffer += decoder.write(data);
  });
  request.on('end',function(){
    buffer += decoder.end();
    //choose the handler where this request should go to.
    var chosenHandler = typeof(router[trimmedPath])!=='undefined' ? router[trimmedPath] : handlers.notFound;
    //construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject':queryStringObject,
      'method':method,
      'headers':headers,
      'payload':buffer
    }
    //route the request to the handler specified in the router
    chosenHandler(data,function(statusCode,payload){
      //use the status code called back by the handler or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      //use the payload called back by the handler or default to an empty object
      payload = typeof(payload) == 'object' ? payload : {};
      //convert the payload sent by the system to a string
      var payloadString = JSON.stringify(payload); 
      //We inform the browser that the response is JSON.
      response.setHeader('Content-Type','application/json');
      response.writeHead(statusCode);
      response.end(payloadString);
      console.log('Response ',statusCode,payloadString);
    });
  });
}

//define the handlers
var handlers = {};

handlers.hello = function(data,callback){
  //the app is alive and returning the json formatted string
  callback(200,{'message':'Hello World'});
}

handlers.notFound = function(data,callback){
    callback(404);  //page not found
}

var router = {
  'hello':handlers.hello
};

/*
* instantiating the https server
* you need to supply a key.pem and cert.pem. As I do not provide them.
* You can use the openssl command to generate them by keying this on your terminal
* openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -x509 -days 3650 -out cert.pem
* once generated, place these 2 secret keys into the subfolder ./https/ and uncomment the code below.
*/

/*
var httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'), //we read in synch to be sure the file is read entirely - here, you must provide your own key
  'cert': fs.readFileSync('./https/cert.pem') //we read in synch to be sure the file is read entirely
};
var httpsServer = https.createServer(httpsServerOptions,function(request,response){
  unifiedServer(request,response);
});

httpsServer.listen(config.httpsPort,function(){
  console.log('The server is listening on port '+config.httpsPort);
});
*/