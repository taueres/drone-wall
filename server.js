"use strict";

var express = require( "express" );
var http    = require( "http" );
var https   = require( "https" );
var app     = express();

app.use( express.static( __dirname ) );
app.set( "view engine", "ejs" );
app.set( "views", __dirname );

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var oldApiMapping = function (builds) {
    return builds.map(function (build, index) {
        var newBuild = build;

        newBuild.updated_at = build.created_at;
        newBuild.duration = build.finished_at ? build.started_at - build.finished_at : 0;
        newBuild.status = build.status.toLowerCase();
	if (newBuild.status == 'running') {
            newBuild.status = 'started';
        }
        newBuild.status = capitalizeFirstLetter(newBuild.status);
	newBuild.sha = build.commit;

        return newBuild;
    });
};

var serveIndex = function ( req, res, next )
{
    res.render( "index", {
        STATIC_PATH: process.env.STATIC_PATH || "/"
    } );
};

var serveFeed = function ( req, res, next )
{
    var apiScheme = "https";
    var apiDomain = "drone.facile.it";
    var apiPort   = process.env.API_PORT || (apiScheme == "https" ? 443 : 80);
    var apiToken  = process.env.API_TOKEN  || "";

    //var path   = "/api/user/activity?access_token=" + apiToken;
    var path   = "/api/repos/collaboratori/collaboratori2/builds?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXh0Ijoic3NhbnRvcm8iLCJ0eXBlIjoidXNlciJ9.B5pjNUlYnfJJoiNUdkSykscMsNRSiIyla6KMG1sEUXw";
    var client = apiScheme == "https" ? https : http;

    var req = client.get(
    {
        "host": apiDomain,
        "port": apiPort,
        "path": path

    }, function( result )
    {
        var body = "";

        result.on( "data", function( chunk )
        {
            body += chunk;

        } ).on( "end", function( )
        {

            var feed = JSON.parse(body);
            var newFeed = oldApiMapping(feed);

            res.send(newFeed);
        } );
    } );



    req.on( "error", function( e )
    {
        console.log( "ERROR: " + e.message );
    } );
};

app.route( "/api/feed" ).get( serveFeed );
app.route( "*" ).get( serveIndex );

http.createServer( app ).listen( process.env.PORT || 3000 );
