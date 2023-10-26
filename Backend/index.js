const server = require('./server.js');

const { PORT } = require('./.env');

server.on('error', (error) => {
    console.error("Error starting the server:", error);
});

server.listen(PORT, () => {
    console.log(`El servidor está corriendo correctamente en el puerto ${PORT}`);

});

