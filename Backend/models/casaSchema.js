const mongoose = require('mongoose');

const casaSchema = new mongoose.Schema({
    direccion: {
        type: String,
        required: true
    },
    referencia: {
        type: String,
        required: true
    },
    visita: {
        type: Date,
        require: true
    },
    estado: {
        type: String,
        required: true
    },
    trabajadorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personal',
        required: true
    },
    trabajador2Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personal',
    },
    camposcasa: {
        type: mongoose.Schema.Types.Mixed
    },
    camposrenovacioncasa: {
        type: mongoose.Schema.Types.Mixed
    },
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    }
}, {
    // esta es la opción para agregar campos de timestamps
    timestamps: true
});

const casa = mongoose.model('casa', casaSchema);


module.exports = casa;
