const Personal = require("../models/personalSchema.js");
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
        subject: `Bienvenido a la Familia Home Revive ${nombre} ${surname}`,
        text: `Hola ${nombre}, espero te encuentres bien, Te enviamos tus credenciales para que puedas acceder a nuestra comunidad
        teniendo como usuario ${dni} y como contraseña ${dni}, NO LO COMPARTAS CON NADIE`,
    }

    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(mensaje);
}

const getPersonals = async (req, res) => {
    try {
        const personals = await Personal.find();
        res.json(personals);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createPersonal = async (req, res) => {
    const { name, surname, email, phone, dni, cargo } = req.body;
    try {
        const personalFound = await Personal.findOne({ dni })
        if (personalFound)
            return res.status(400).json(['The username is already exists']);

        const passwordHash = await bcrypt.hash(dni, 10);
        const usernameHash = dni;
        const newPersonal = new Personal({
            name,
            surname,
            email,
            phone,
            dni,
            cargo,
            password: passwordHash,
            username: usernameHash,
        });

        const personalsaved = await newPersonal.save();
        enviarmail(email, name, surname, dni)
        const token = await createAccessToken({ id: personalsaved._id })
        res.cookie('token', token);
        res.json(personalsaved);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getPersonal = async (req, res) => {
    try {
        const personal = await Personal.findById(req.params.id);
        if (!personal) return res.status(404).json({ message: "Personal not found" });
        return res.json(personal);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updatePersonal = async (req, res) => {
    try {
        const { name, surname, email, phone, cargo } = req.body;
        const PersonalUpdated = await Personal.findOneAndUpdate(
            { _id: req.params.id },
            { name, surname, email, phone, cargo },
            { new: true }
        );
        return res.json(PersonalUpdated);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { enviarmail, getPersonals, createPersonal, getPersonal, updatePersonal };
