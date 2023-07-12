const jwt = require("jsonwebtoken");

module.exports = (req, res) => {
    const token = req.header("x-auth-token");
    if (!token)
        return res.status(400).send({ message: "Access denied, No Token Provided.0" });

    jwt.verify(token, process.env.JWTPRIVATEKEY, (error, validToken) => {
        if (error) {
            return res.status(400).send({ message: "Invalid Token" });

        } else {
            req.user = validToken;
            next();
        }
    })
}