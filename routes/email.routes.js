const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../helpers/validateFields');

const { sendEmail } = require('../controllers/emailHandler');

const router = Router();

router.post('/sendemail',[
    // check('correo', 'El correo es obligatorio').isEmail(),
    // check('password', 'La contraseña es obligatoria').not().isEmpty(),
    // validate
],sendEmail );



module.exports = router;