const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuario = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);

        return res.status(200).send({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp( termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex}],
        $and: [{ estado: true }]
    });

    res.send({
        results: usuarios
    });


}

const buscarCategoria = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);

        return res.status(200).send({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.send({
        results: categorias
    });


}

const buscarProducto = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const producto = await Producto.findById(termino);

        return res.status(200).send({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({ nombre: regex, estado: true });

    res.send({
        results: productos
    });


}

const buscar = async (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).send({
            msg: `Las colecciones permitidas son:  ${coleccionesPermitidas}`
        });
    }

    switch (coleccion.toLowerCase()) {
        case 'usuarios':
            buscarUsuario(termino, res);
            break;

        case 'categorias':
            buscarCategoria(termino, res);
            break;

        case 'productos':
            buscarProducto(termino, res);
            break;

        default:

            res.status(401).send({
                msg: 'Ingrese un termino valido: ' + coleccionesPermitidas
            });

            break;
    }
}

module.exports = {
    buscar
}