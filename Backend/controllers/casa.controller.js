const Casa = require('../models/casaSchema.js'); // Assuming the model file is named casa.js and is in the models directory

// GET all Casas
const getCasas = async (req, res) => {
    try {
        const casas = await Casa.find();
        res.json(casas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET a single Casa by id
const getCasa = async (req, res) => {
    try {
        // Suponiendo que tienes clienteId disponible en tu solicitud
        const clienteId = req.params.id; 

        // Cambia esta línea para buscar por clienteId
        const casa = await Casa.findById(clienteId)

        if (!casa) return res.status(404).json({ message: "Casa not found" });

        res.json(casa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// CREATE a new Casa
const createCasa = async (req, res) => {
    const { direccion, referencia, visita, estado, trabajadorId, camposcasa, camposrenovacioncasa, clienteId } = req.body;

    try {
        const newCasa = new Casa({
            direccion,
            referencia,
            visita,
            estado,
            trabajadorId,
            camposcasa,
            camposrenovacioncasa,
            clienteId
        });

        const savedCasa = await newCasa.save();
        res.status(201).json(savedCasa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE a Casa
const updateCasa = async (req, res) => {
    const { direccion, referencia, visita, estado, camposcasa, camposrenovacioncasa,trabajadorId } = req.body;
    const casaId = req.params.id;

    try {
        const updatedCasa = await Casa.findByIdAndUpdate(casaId, {
            direccion,
            referencia,
            visita,
            estado,
            camposcasa,
            camposrenovacioncasa,
            trabajadorId,
        }, { new: true });

        if (!updatedCasa) {
            return res.status(404).json({ message: "Casa no encontrada" });
        }
        res.json(updatedCasa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE a Casa
const deleteCasa = async (req, res) => {
    try {
        const result = await Casa.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: "Casa no encontrada" });
        res.json({ message: "Casa eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCasas,
    getCasa,
    createCasa,
    updateCasa,
    deleteCasa
};
