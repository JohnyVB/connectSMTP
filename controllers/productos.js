const { response, request } = require('express');

const { Producto } = require('../models');

const productosGet = async (req = request, res = response) => {

    const { desde = 0, limite = 10 } = req.query;
    const query = { estado: true };

    const productos = await Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite));

    res.status(200).send({
        productos
    });
}

const productoGet = async (req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre');

    res.status(200).send({
        producto
    });
}

const productoPost = async (req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
        return res.status(400).send({
            msg: `El producto con el nombre: ${productoDB.nombre} ya existe`
        });
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);
    await producto.save();

    res.status(200).send({
        producto
    });
}

const productoPut = async(req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data} = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id , data, { new: true });

    res.status(200).send({
        producto
    });
}

const productoDelete = async (req = request, res = response) => {
    
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false}, { new: true });

    res.status(200).send({
        producto
    });
}

module.exports = {
    productosGet,
    productoGet,
    productoPost,
    productoPut,
    productoDelete
}