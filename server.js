"use strict";

var express  = require( "express" );
var http     = require( "http" );
var https    = require( "https" );
var feedController = require('./server/feedController');
//var feedController = require('./server/stub/feedController');

if ( ! ('API_REPOSITORY' in process.env)) {
    console.error('API_REPOSITORY ENV VARIABLE IS NOT SET. ABORTING.');
    process.exit(1);
}

var app = express();
app.use( express.static( __dirname ) );
app.set( "view engine", "ejs" );
app.set( "views", __dirname );

var serveIndex = function ( req, res, next )
{
    res.render( "index", {
        STATIC_PATH: process.env.STATIC_PATH || "/"
    } );
};

app.route( "/api/feed" ).get( feedController );
app.route( "*" ).get( serveIndex );

http.createServer( app ).listen( process.env.PORT || 3000 );
