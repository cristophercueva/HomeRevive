const Cliente = require("../models/clienteSchema.js");
const bcrypt = require('bcrypt');

const getClientes = async (req, res, next) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCliente = async (req, res, next) => {
    const { name, surname, dni, email, phone, casaId } = req.body;

    try {
        const clienteFound = await Cliente.findOne({ dni });
        if (clienteFound) {
            return res.status(400).json({ message: "El cliente ya existe" });
        }

        const newCliente = new Cliente({ name, surname, dni, email, phone, casaId });
        const clienteSaved = await newCliente.save();
        res.json(clienteSaved);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCliente = async (req, res, next) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCliente = async (req, res, next) => {
    const { id } = req.params;
    const { name, surname, email, phone, customFields } = req.body;

    try {
        const clienteUpdated = await Cliente.findByIdAndUpdate(id, { name, surname, email, phone, customFields }, { new: true });
        if (!clienteUpdated) return res.status(404).json({ message: "Cliente no encontrado" });
        res.json(clienteUpdated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLastCliente = async (req, res, next) => {
    try {
        const cliente = await Cliente.findOne().sort({ createdAt: -1 });
        if (!cliente) return res.status(404).json({ message: "No hay clientes en la base de datos" });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Middleware de manejo de errores


module.exports = { getClientes, createCliente, getCliente, updateCliente, getLastCliente };
