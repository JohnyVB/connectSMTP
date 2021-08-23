const { request, response } = require('express');

const sendEmail = async (req = request, res = response) => {

    try {


    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = {
    sendEmail
}
