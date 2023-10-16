const Cliente = require("../models/clienteSchema.js");
const bcrypt = require('bcrypt');
const { createAccessToken } = require('../libs/jwt.js');
const nodemailer = require('nodemailer');

const enviarmail = async (email, nombre, surname, dni) => {
    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'cristopher.cueva.developer@gmail.com',
            pass: "xfxg vmap asuo ykco",
        }
    }
    const mensaje = {
        from: 'cristopher.cueva.developer@gmail.com',
        to: email,
        subject: `HOME REVIVE TE SALUDA!  ${nombre} ${surname}`,
        text: `Hola ${nombre}, espero te encuentres bien, Gracias por confiar en nosotros
        nos pondremos en contacto contigo para informarte como va tu proceso de remodelacion`,
    }

    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(mensaje);
}

const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createCliente = async (req, res) => {
    const { name, surname, dni, email, phone, username, password, customFields } = req.body;

    try {
        // Verifica si ya existe un cliente con el mismo DNI
        const clienteFound = await Cliente.findOne({ dni });

        if (clienteFound) {
            return res.status(400).json({ message: "El cliente ya existe" });
        }

        // Hashea la contraseña antes de guardarla en la base de datos
        const passwordHash = await bcrypt.hash(password, 10);
        const usernameHash = dni;
        // Crea un nuevo cliente con los datos proporcionados
        const newCliente = new Cliente({
            name,
            surname,
            dni,
            email,
            phone,
            username: usernameHash,
            password: passwordHash,
            customFields, // Campos mixtos
        });

        // Guarda el nuevo cliente en la base de datos
        const clienteSaved = await newCliente.save();
        enviarmail(email, name, surname, dni)
        const token = await createAccessToken({ id: personalsaved._id })
        res.cookie('token', token);
        // Devuelve el cliente creado como respuesta
        res.json(clienteSaved);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const getCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) return res.status(404).json({ message: "Personal not found" });
        return res.json(cliente);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const updateCliente = async (req, res) => {
    const { name, surname, email, phone, customFields } = req.body;
    const clienteId = req.params.id; // ID del cliente a actualizar

try {
    // Actualiza los campos del cliente con los nuevos valores y devuelve el cliente actualizado
    const clienteUpdated = await Cliente.findByIdAndUpdate(clienteId, {
        name,
        surname,
        email,
        phone,
        customFields
    }, { new: true });

    if (!clienteUpdated) {
        return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Devuelve el cliente actualizado como respuesta
    res.json(clienteUpdated);
} catch (error) {
    return res.status(500).json({ message: error.message });
}
}

module.exports = {enviarmail, getClientes, createCliente, getCliente, updateCliente};
