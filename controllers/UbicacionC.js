var mysql = require('mysql');
var config = require('.././database/database.js');

module.exports = {

    guardarUbicacion: function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        var latitud = req.query.latitud;
        var longitud = req.query.longitud;
        var usuario = req.query.usuario;

        var db = mysql.createConnection(config);
        db.connect();

        db.query("INSERT INTO `ubicacion` (`latitud`, `longitud`, `fechaHora`, `idUsuario`) VALUES ('" + latitud + "', '" + longitud + "', NOW(), (SELECT usuario.idUsuario FROM usuario INNER JOIN credencial ON usuario.idCredencial = credencial.idCredencial WHERE credencial.username = '" + usuario + "'))", function (err, rows, fields) {
            if (err) {
                console.log(err);
                db.end();
            } else {
                res.send('Ubicacion Actualizada Correctamente');
                db.end();
            }
        });

    },

    buscarUltimaUbicacionUsuario: function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        var usuario = req.query.usuario;

        var db = mysql.createConnection(config);
        db.connect();

        db.query("SELECT "
            + "ubicacion.idUbicacion, "
            + "ubicacion.latitud, "
            + "ubicacion.longitud, "
            + "credencial.username "
            + "FROM "
            + "ubicacion "
            + "INNER JOIN usuario ON ubicacion.idUsuario = usuario.idUsuario "
            + "INNER JOIN credencial ON usuario.idCredencial = credencial.idCredencial "
            + "WHERE "
            + "credencial.username = '" + usuario + "' "
            + "ORDER BY "
            + "ubicacion.fechaHora DESC "
            + "LIMIT 1", function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    db.end();
                } else {
                    res.send(rows);
                    db.end();
                }
            });

    },

    buscarUltimasUbicacionesUsuarios: function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        var usuario = req.query.usuario;

        var db = mysql.createConnection(config);
        db.connect();

        db.query("SELECT "
            + "ubicacion.idUbicacion, "
            + "ubicacion.latitud, "
            + "ubicacion.longitud, "
            + "credencial.username "
            + "FROM "
            + "ubicacion "
            + "INNER JOIN usuario ON ubicacion.idUsuario = usuario.idUsuario "
            + "INNER JOIN credencial ON usuario.idCredencial = credencial.idCredencial "
            + "WHERE "
            + "credencial.username = '" + usuario + "' "
            + "ORDER BY "
            + "ubicacion.fechaHora DESC "
            + "LIMIT 1", function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    db.end();
                } else {
                    res.send(rows);
                    db.end();
                }
            });

    },

}