var express = require("express");
var http = require("http");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cors = require("cors");
var passport = require("passport");
var debug = require('debug')('schtroumpfbook:server');
const PORT = 3000;


// Emporter le modéle de BD
require("./api/models/db");
// la configuration passport
require("./api/config/passport");

// les routes des APIs
var routesApi = require("./api/routes/index");
const { listen } = require("express/lib/application");

var app = express();

app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Initialisation du passport
app.use(passport.initialize());

// Utiliser les APIs quand l'URL commence par /api
app.use("/api", routesApi);

// Pas de route qui correspond à la requete , retourner une erreur 404
app.use(function (req, res, next) {
  var err = new Error("Introuvable");
  err.status = 404;
  next(err);
});

// non autorisé , retourner une erreur 401
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({ message: err.name + ": " + err.message });
  }
});

// logs de developpement (on affiche l'erreur)
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}

// log de production (on affiche pas les erreurs)
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});



app.set('port', PORT);

// créer un serveur http

var server = http.createServer(app);

// écouter sur le port PORT

 server.listen(PORT, () => {
  console.log(`application démarrée sur le port ${PORT}`);
});
server.on('error', onError);
server.on('listening', onListening);

// Ecouter les evenements de type error du serveur http
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Ecouter les évenements de type listening du serveur http

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}