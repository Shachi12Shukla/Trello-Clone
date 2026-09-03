const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const token = req.headers.token;

    if (!token) {
        return res.status(403).json({
            message: "You are not logged in"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);

        const userId = decoded.userId;

        if (!userId) {
            return res.status(403).json({
                message: "Malformed token"
            });
        }

        req.userId = userId;

        next();

    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;