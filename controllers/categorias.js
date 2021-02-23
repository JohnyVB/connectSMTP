const { response, request } = require('express');

const { Categoria } = require('../models');

const categoriasGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).skip(Number(desde)).limit(Number(limite)).populate('usuario', 'nombre')
    ]);
    
    res.send({
        msg: 'Api Obtener categorias',
        total,
        categorias
    })
}

const categoriaGet = async (req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.send({
        categoria
    })
}

const categoriaPost = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const nombreDB = await Categoria.findOne({ nombre });

    if (nombreDB) {
        return res.status(400).send({
            msg: `La categoria ${ nombreDB.nombre} ya existe`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();


    res.status(201).send({
        categoria
    })
}

const categoriaPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoriaUpdate = await Categoria.findByIdAndUpdate( id, data, { new:true });

    res.send({
        categoriaUpdate
        
    })
}

const categoriaDelete = async (req = request, res = response) => {

    const { id } = req.params;

    const categoriaDeleted = await Categoria.findOneAndUpdate({_id: id}, { estado: false }, { new: true});

    res.send({
        categoriaDeleted
    })
}

module.exports = {
    categoriasGet,
    categoriaGet,
    categoriaPost,
    categoriaPut,
    categoriaDelete
}