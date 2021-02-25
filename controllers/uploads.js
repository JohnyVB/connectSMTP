const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, request } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');
const { join } = require('path');

const cargarArchivo = async (req = request, res = response) => {

    try {
        
        const nombreArchivo = await subirArchivo(req.files);
        res.send({
            nombreArchivo
        });

    } catch (msg) {
        return res.status(400).send({msg});
    }

}

const actualizarImagen = async (req = request, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).send({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).send({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;
    
    }

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombreArchivo = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombreArchivo;
    modelo.save();

    res.send({
        modelo
    });
}


const actualizarImagenCloudinary = async (req = request, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).send({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).send({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;

    }

    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombreArchivo = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombreArchivo.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    modelo.save();

    res.send({
        modelo
    });
}

const mostrarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).send({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).send({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;

    }

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }
    
    res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}