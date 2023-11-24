const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  // tus campos de esquema
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  dni: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  casaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Casa',
  }
}, {
  // esta es la opción para agregar campos de timestamps
  timestamps: true
});

const cliente = mongoose.model('cliente', clienteSchema);

module.exports = cliente;
