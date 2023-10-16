const server = require('./server.js');

const { PORT } = require('./.env');

try {
    server.listen(PORT);
    console.log("El servidor está corriendo correctamente");
} catch (error) {
    console.error("Error starting the server:", error);
}

