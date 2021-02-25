const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivo } = require('../middlewares');

const { cargarArchivo, actualizarImagen, actualizarImagenCloudinary, mostrarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers')

const router = Router();

router.post('/', validarArchivo , cargarArchivo);

router.get('/:coleccion/:id', [
    check('id', 'El ID deber ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El ID deber ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary)



module.exports = router;