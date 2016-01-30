'use strict';

var http     = require( "http" );
var https    = require( "https" );
var Gravatar = require('./gravatar');
var apiMap   = require('./api')(new Gravatar());

var apiScheme = process.env.API_SCHEME || "https";
var apiDomain = process.env.API_DOMAIN || "";
var apiPort   = process.env.API_PORT || (apiScheme == "https" ? 443 : 80);
var apiToken  = process.env.API_TOKEN  || "";
var apiRepository = process.env.API_REPOSITORY;
var feedPath = "/api/repos/" + apiRepository + "/builds?access_token=" + apiToken;

var feedController = function ( req, res, next ) {
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
        console.error( "ERROR: " + e.message );
    } );
};

module.exports = feedController;
