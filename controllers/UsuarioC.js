var mysql = require('mysql');
var config = require('.././database/database.js');

module.exports = {

    guardarUsuario: function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        var user = req.query.user;
        var pass = req.query.pass;

        var db = mysql.createConnection(config);
        db.connect();

        db.query("SELECT credencial.username FROM credencial WHERE credencial.username = '" + user + "'", function (err, rows, fields) {
            if (err) {
                console.log(err);
                db.end();
            } else {
                db.end();
                if (rows == "") {

                    var db2 = mysql.createConnection(config);
                    db2.connect();

                    db2.query("INSERT INTO `credencial` (`username`, `pass`) VALUES ('" + user + "', '" + pass + "')", function (err, rows, fields) {
                        if (err) {
                            console.log(err);
                            db2.end();
                        } else {
                            res.send("Usuario Guardado Exitosamente");
                            db2.end();
                        }
                    });

                } else {
                    res.send("El usuario que desea guardar ya existe");
                }

            }
        });

    },

    iniciarSesion: function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        var user = req.query.user;
        var pass = req.query.pass;

        var db = mysql.createConnection(config);
        db.connect();

        db.query("SELECT credencial.username FROM credencial WHERE credencial.username = '" + user + "' AND credencial.pass = '" + pass + "'", function (err, rows, fields) {
            if (err) {
                console.log(err);
                db.end();
            } else {

                db.end();

                if (rows == "") {
                    res.send("Credenciales Incorrectas");
                } else {
                    res.send(rows);
                }
            }
        });

    },
    //INSERT INTO `usuario` (`nombre`, `apellido`, `telefono`, `email`) VALUES ('MARIO ', 'PALOMO', '0979212157', 'mariofpalomoa@gmail.com')

    guardarInformacionUsuario: function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        var nombre = req.query.nombre;
        var apellido = req.query.apellido;
        var telefono = req.query.telefono;
        var email = req.query.email;
        var credencial = req.query.credencial;


        var db = mysql.createConnection(config);
        db.connect();

        db.query("SELECT credencial.idCredencial FROM credencial WHERE credencial.username = '" + credencial + "'", function (err, rows, fields) {
            if (err) {
                console.log(err);
                db.end();
            } else {

                db.end();

                if (rows == "") {
                    res.send("No Existe el usuario");
                } else {

                    var db2 = mysql.createConnection(config);
                    db2.connect();

                    db2.query("INSERT INTO `usuario` (`nombre`, `apellido`, `telefono`, `email`, `idCredencial`) VALUES ('" + nombre + " ', '" + apellido + "', '" + telefono + "', '" + email + "', '" + rows[0].idCredencial + "')", function (err, rows, fields) {
                        if (err) {
                            console.log(err);
                            db2.end();
                        } else {

                            db2.end();
                            res.send("Información Actualizada Correctamente");
                        }
                    });
                }

            }
        });
    },

    buscarInformacionUsuario: function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        var credencial = req.query.credencial;

        var db = mysql.createConnection(config);
        db.connect();

        db.query("SELECT "
        +"usuario.idUsuario,"
        +"usuario.nombre,"
        +"usuario.apellido,"
        +"usuario.telefono,"
        +"usuario.email"
        +" FROM "
        +"usuario "
        +"INNER JOIN credencial ON usuario.idCredencial = credencial.idCredencial "
        +"WHERE "
        +"credencial.username = '"+credencial+"'", function (err, rows, fields) {
            if (err) {
                console.log(err);
                db.end();
            } else {

                db.end();
                res.send(rows);

            }
        });

    },
}