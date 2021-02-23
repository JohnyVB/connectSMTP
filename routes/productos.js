const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, esAdminRole, validarCampos } = require('../middlewares');
const { productosGet, productoGet, productoPost, productoPut, productoDelete } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators')

const router = Router();


router.get('/', productosGet);

router.get('/:id', [
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], productoGet);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de categoria valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], productoPost);

router.put('/:id',[
    validarJWT,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio debe ser un numero').isNumeric(),
    check('descripcion', 'La descripcion es obligatorio').not().isEmpty(),
    validarCampos
], productoPut);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], productoDelete);


module.exports = router;