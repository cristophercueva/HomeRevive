const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
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
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  customFields: {
    type: mongoose.Schema.Types.Mixed
  }
});

const cliente = mongoose.model('cliente', clienteSchema);

module.exports = cliente;
