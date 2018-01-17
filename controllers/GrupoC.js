var mysql = require('mysql');
var config = require('.././database/database.js');

module.exports = {
    guardarGrupo: function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        var nombre = req.query.nombre;
        var credencial = req.query.credencial;
        var usuario;

        var db = mysql.createConnection(config);
        db.connect();

        db.query("SELECT usuario.idUsuario FROM usuario INNER JOIN credencial ON usuario.idCredencial = credencial.idCredencial WHERE credencial.username = '" + credencial + "'", function (err, rows, fields) {
            if (err) {
                console.log(err);
                db.end();
            } else {
                db.end();

                if (rows == "") {
                    res.send("No Existe el usuario y/o Actualizar datos de tu perfil");

                } else {

                    usuario = rows[0].idUsuario;

                    var db2 = mysql.createConnection(config);
                    db2.connect();

                    db2.query("SELECT ValidarGuardarGrupo('" + usuario + "', '" + nombre + "') AS msm", function (err, rows, fields) {
                        if (err) {
                            console.log(err);
                            db2.end();
                        } else {

                            db2.end();
                            if (rows[0].msm == 'true') {
                                var db3 = mysql.createConnection(config);
                                db3.connect();

                                db3.query("INSERT INTO `grupo` (`nombre`, `idUsuario`, `codigo`) VALUES ('" + nombre + "', '" + usuario + "','" + generar(10) + "')", function (err, rows, fields) {
                                    if (err) {
                                        console.log(err);
                                        db3.end();
                                    } else {

                                        db3.end();

                                        var db4 = mysql.createConnection(config);
                                        db4.connect();

                                        db4.query("INSERT INTO `grupousuario` (`idUsuario`, `idGrupo`, `idRol`, `idEstadoVisibilidad`) VALUES ('" + usuario + "', (SELECT grupo.idGrupo FROM grupo WHERE grupo.idUsuario = " + usuario + " AND grupo.nombre = '" + nombre + "'), '1', '1')", function (err, rows, fields) {
                                            if (err) {
                                                console.log(err);
                                                db4.end();
                                            } else {
                                                res.send("Grupo Creado Correctamente");
                                                db4.end();
                                            }
                                        });
                                    }
                                });
                            } else {
                                res.send("El grupo que deseas crear ya existe");
                            }
                        }
                    });
                }
            }
        });
    },

    buscarGrupo: function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        var credencial = req.query.credencial;

        var db = mysql.createConnection(config);
        db.connect();

        db.query("SELECT grupo.idGrupo, grupo.nombre, grupo.idUsuario, grupo.codigo FROM grupo INNER JOIN usuario ON grupo.idUsuario = usuario.idUsuario INNER JOIN credencial ON usuario.idCredencial = credencial.idCredencial WHERE credencial.username = '" + credencial + "'", function (err, rows, fields) {
            if (err) {
                console.log(err);
                db.end();
            } else {
                res.send(rows);
                db.end();
            }
        });

    },

    ingresarGrupo: function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        var credencial = req.query.credencial;
        var codigo = req.query.codigo;

        var db = mysql.createConnection(config);
        db.connect();

        db.query("INSERT INTO `grupousuario` (`idUsuario`, `idGrupo`, `idRol`, `idEstadoVisibilidad`) VALUES ((SELECT usuario.idUsuario FROM usuario INNER JOIN credencial ON usuario.idCredencial = credencial.idCredencial WHERE credencial.username = '" + credencial + "'), (SELECT grupo.idGrupo FROM grupo WHERE grupo.codigo = '" + codigo + "'), '2', '1')", function (err, rows, fields) {
            if (err) {
                console.log(err);
                db.end();
            } else {
                res.send("Acceso confirmado al grupo");
                db.end();
            }
        });

    },

    buscarPertenecerGrupo: function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        var credencial = req.query.credencial;

        var db = mysql.createConnection(config);
        db.connect();

        db.query("SELECT grupousuario.idGrupo, grupousuario.idGrupoUsuario, (SELECT credencial.username FROM grupo INNER JOIN usuario ON grupo.idUsuario = usuario.idUsuario INNER JOIN credencial ON usuario.idCredencial = credencial.idCredencial WHERE grupo.idGrupo = grupousuario.idGrupo) AS 'usuario', (SELECT grupo.nombre FROM grupo WHERE grupo.idGrupo = grupousuario.idGrupo) AS 'grupo' FROM grupousuario WHERE grupousuario.idUsuario = (SELECT usuario.idUsuario FROM usuario INNER JOIN credencial ON usuario.idCredencial = credencial.idCredencial WHERE credencial.username = '" + credencial + "') AND grupousuario.idRol = 2"
            , function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    db.end();
                } else {
                    res.send(rows);
                    db.end();
                }
            });

    },

    buscarIntegrantesGrupo: function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        var idGrupo = req.query.idGrupo;

        var db = mysql.createConnection(config);
        db.connect();

        db.query("SELECT "
            + "grupousuario.idGrupoUsuario, "
            + "(SELECT credencial.username FROM usuario INNER JOIN credencial ON usuario.idCredencial = credencial.idCredencial WHERE usuario.idUsuario =  grupousuario.idUsuario) AS 'usuario', "
            + "(SELECT rol.descripcion FROM rol WHERE rol.idRol = grupousuario.idRol) AS 'rol' "
            + "FROM "
            + "grupousuario "
            + "WHERE "
            + "grupousuario.idGrupo = " + idGrupo + ""
            , function (err, rows, fields) {
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
function generar(longitud) {
    var caracteres = "ABCDEFGHIJKLMNPQRTUVWXYZ012346789";
    var contraseña = "";
    for (i = 0; i < longitud; i++) contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    return contraseña;
}