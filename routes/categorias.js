const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, esAdminRole, validarCampos } = require('../middlewares');
const { 
    categoriasGet,
    categoriaGet,
    categoriaPost,
    categoriaPut,
    categoriaDelete 
} = require('../controllers/categorias')

const { existeCategoriaPorId } = require('../helpers/db-validators')

const router = Router();

//Publico
router.get('/', categoriasGet);

//Privato - todos
router.get('/:id',[
    validarJWT,
    check('id').custom(existeCategoriaPorId),
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos
], categoriaGet);

//Privado - todos
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos 
], categoriaPost);

//Privado - todos
router.put('/:id',[
    validarJWT,
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoriaPut);

//Privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], categoriaDelete);


module.exports = router;