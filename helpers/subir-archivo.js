
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['jpg', 'jpeg', 'png', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;

        const nombreSplit = archivo.name.split('.');
        const extension = nombreSplit[nombreSplit.length - 1];

        if (!extensionesValidas.includes(extension)) {

            return reject(`La extension ${extension} del archivo no es valida`);

        }

        const nombreNuevo = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreNuevo);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nombreNuevo);
        });
    });

   

}


module.exports = {
    subirArchivo
}