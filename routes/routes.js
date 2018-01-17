var express = require('express');
var router = express.Router();
var controllers = require('.././controllers');

router.get('/GuardarUsuario', controllers.UsuarioC.guardarUsuario);
router.get('/IniciarSesionUsuario', controllers.UsuarioC.iniciarSesion);
router.get('/GuardarInformacionUsuario', controllers.UsuarioC.guardarInformacionUsuario);
router.get('/BuscarInformacionUsuario', controllers.UsuarioC.buscarInformacionUsuario);

router.get('/GuardarGrupo', controllers.GrupoC.guardarGrupo);
router.get('/IngresarGrupo', controllers.GrupoC.ingresarGrupo);
router.get('/ListarGrupo', controllers.GrupoC.buscarGrupo);
router.get('/ListarGrupoPertenecer', controllers.GrupoC.buscarPertenecerGrupo);
router.get('/ListarIntegrantesGrupo', controllers.GrupoC.buscarIntegrantesGrupo);

router.get('/GuardarUbicacion', controllers.UbicacionC.guardarUbicacion);
router.get('/ObtenerUltimaUbicacion', controllers.UbicacionC.buscarUltimaUbicacionUsuario);


module.exports = router;
