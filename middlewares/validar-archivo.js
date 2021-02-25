const { response, request } = require('express');

const validarArchivo = (req = request, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).send({
            msg: 'No hay archivos.'
        });
    }

    next();
}

module.exports = {
    validarArchivo
}