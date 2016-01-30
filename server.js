"use strict";

var express  = require( "express" );
var http     = require( "http" );
var https    = require( "https" );
var Gravatar = require('./server/gravatar');
var apiMap   = require('./server/utils')(new Gravatar());
var app      = express();

if ( ! ('API_REPOSITORY' in process.env)) {
    console.error('API_REPOSITORY ENV VARIABLE IS NOT SET. ABORTING.');
    process.exit(1);
}

var apiScheme = process.env.API_SCHEME || "https";
var apiDomain = process.env.API_DOMAIN || "";
var apiPort   = process.env.API_PORT || (apiScheme == "https" ? 443 : 80);
var apiToken  = process.env.API_TOKEN  || "";
var apiRepository = process.env.API_REPOSITORY;
var feedPath = "/api/repos/" + apiRepository + "/builds?access_token=" + apiToken;

app.use( express.static( __dirname ) );
app.set( "view engine", "ejs" );
app.set( "views", __dirname );

var serveIndex = function ( req, res, next )
{
    res.render( "index", {
        STATIC_PATH: process.env.STATIC_PATH || "/"
    } );
};

var serveFeed = function ( req, res, next )
{
    var client = apiScheme == "https" ? https : http;

    var forwardReq = client.get(
    {
        "host": apiDomain,
        "port": apiPort,
        "path": feedPath

    }, function( result )
    {
        var body = "";

        result.on( "data", function( chunk )
        {
            body += chunk;

        } ).on( "end", function( )
        {

            var feed = JSON.parse(body);
            var newFeed = apiMap(feed);

            res.send(newFeed);
        } );
    } );

    forwardReq.on( "error", function( e )
    {
        console.log( "ERROR: " + e.message );
    } );
};

app.route( "/api/feed" ).get( serveFeed );
app.route( "*" ).get( serveIndex );

http.createServer( app ).listen( process.env.PORT || 3000 );
