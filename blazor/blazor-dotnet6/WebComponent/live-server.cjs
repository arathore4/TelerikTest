var liveServer = require("live-server");

var params = {
	port: 8005, // Set the server port. Defaults to 8080.
	root: "./public", // Set root directory that's being served. Defaults to cwd.
	open: true, // When false, it won't load your browser by default.
	logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
	file: "index.html",
	middleware: [function(req, res, next) {
		next(); 
	}], // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
	proxy: [
		["/_blazor", "http://localhost:7075/_blazor"],
		["/_content", "http://localhost:7075/_content"],
	],
};
liveServer.start(params);