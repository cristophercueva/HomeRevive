const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../.env");

const authRequired = (req, res, next) => {
    const { token } = req.cookies;

    if (!token)
        return res.status(401).json({ message: "No token, authorization denied" });

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: "Invalid Token" });

        req.user = user;
        next();
    });
};

module.exports = { authRequired };
