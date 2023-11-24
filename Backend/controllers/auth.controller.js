const trabajador = require("../models/trabajadorSchema.js");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../libs/jwt.js");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require('../.env');


exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userFound = await trabajador.findOne({ username });

        if (!userFound) return res.status(400).json({ message: "Personal not found" });

        // Verificar si el estado del usuario es 'Activo'
        if (userFound.estado !== 'Activo') {
            return res.status(400).json({ message: "Account is not active" });
        }

        const isMatch = await bcrypt.compare(password, userFound.password);

        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = await createAccessToken({ id: userFound._id });

        res.cookie('token', token, {
            // Configuraciones adicionales para la cookie, si las hay
        });
        res.json({
            id: userFound._id,
            email: userFound.email,
            name: userFound.name,
            surname: userFound.surname,
            cargo: userFound.cargo,
            estado: userFound.estado,
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




exports.logout = async (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};



exports.verifyToken = async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });

        const userFound = await trabajador.findById(user.id);

        if (!userFound) return res.status(401).json({ message: "Unauthorized" });

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            name: userFound.name,
            surname: userFound.surname,
            cargo: userFound.cargo,
            estado: userFound.estado,
        });
    });
};

