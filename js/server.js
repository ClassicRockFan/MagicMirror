/* Magic Mirror
 * Server
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var express = require("express");
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var path = require("path");
var fs = require("fs");
var helmet = require("helmet");
var Utils = require(__dirname + "/utils.js");

var Server = function(config, callback) {

	var port = config.port;
	if (process.env.MM_PORT) {
		port = process.env.MM_PORT;
	}

	console.log("Starting server on port " + port + " ... ");

	server.listen(port, config.address ? config.address : "localhost");

	app.use(helmet());

	app.use("/js", express.static(__dirname));
	var directories = ["/config", "/css", "/fonts", "/modules", "/vendor"];
	var directory;
	for (var i in directories) {
		directory = directories[i];
		app.use(directory, express.static(path.resolve(global.root_path + directory)));
	}

	app.get("/version", function(req,res) {
		res.send(global.version);
	});

	app.get("/config", function(req,res) {
		res.send(config);
	});

	app.get("/", function(req, res) {
		var html = fs.readFileSync(path.resolve(global.root_path + "/index.html"), {encoding: "utf8"});
		html = html.replace("#VERSION#", global.version);

		configFile = "config/config.js";
		if (typeof(global.configuration_file) !== "undefined") {
		    configFile = global.configuration_file;
		}
		html = html.replace("#CONFIG_FILE#", configFile);

		res.send(html);
	});

	if (typeof callback === "function") {
		callback(app, io);
	}
};

module.exports = Server;
