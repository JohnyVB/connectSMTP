const { request, response } = require('express');

const sendEmail = async (req = request, res = response) => {

    try {

        res.status(200).send({
            msg: 'Email sent'
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = {
    sendEmail
}
