const Trabajador = require("../models/trabajadorSchema.js");  // Cambiamos Cliente por Trabajador
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const enviarmail = async (email, nombre, surname, dni) => {
    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'cristopher.cueva.developer@gmail.com',
            pass: 'etyk qgfg xbmw ieec', // Replace with your generated App Password
        }
    }
    const mensaje = {
        from: 'cristopher.cueva.developer@gmail.com',
        to: email,
        subject: `Bienvenido a la Familia Home Revive ${nombre} ${surname}`,
        text: `Hola ${nombre}, espero te encuentres bien, Te enviamos tus credenciales para que puedas acceder a nuestra comunidad
        teniendo como usuario ${dni} y como contraseña ${dni}, NO LO COMPARTAS CON NADIE`,
    }

    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(mensaje);
}

const getTrabajadores = async (req, res) => {
    try {
        const trabajadores = await Trabajador.find();
        res.json(trabajadores);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createTrabajador = async (req, res) => {
    const { name, surname, dni, email, phone, cargo, estado } = req.body;

    try {
        const trabajadorFound = await Trabajador.findOne({ dni });

        if (trabajadorFound) {
            return res.status(400).json({ message: "El trabajador ya existe" });
        }

        const passwordHash = await bcrypt.hash(dni, 10);
        const usernameHash = dni;

        const newTrabajador = new Trabajador({
            name,
            surname,
            dni,
            email,
            phone,
            cargo,
            estado,
            username: usernameHash,
            password: passwordHash,
        });

        const trabajadorSaved = await newTrabajador.save();
        enviarmail(email, name, surname, dni)
        res.json(trabajadorSaved);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getTrabajador = async (req, res) => {
    try {
        const trabajador = await Trabajador.findById(req.params.id);
        if (!trabajador) return res.status(404).json({ message: "Trabajador not found" });
        return res.json(trabajador);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateTrabajador = async (req, res) => {
    const { name, surname, email, phone, cargo, estado } = req.body;
    const trabajadorId = req.params.id;

    try {
        const trabajadorUpdated = await Trabajador.findByIdAndUpdate(trabajadorId, {
            name,
            surname,
            email,
            phone,
            cargo,
            estado
        }, { new: true });

        if (!trabajadorUpdated) {
            return res.status(404).json({ message: "Trabajador no encontrado" });
        }

        res.json(trabajadorUpdated);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { enviarmail, getTrabajadores, createTrabajador, getTrabajador, updateTrabajador };
