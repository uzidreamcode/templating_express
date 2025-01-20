const jwt = require("jsonwebtoken");
const response = require("../tools/response");
const { db } = require("../../config/sequelize");
const controller = require('../controllers/authController');
const { userSessionCache } = require('../tools/sessionCache');
const secretKey = process.env.JWT_SECRET;

// ROLES
// 1 = Superadmin
// 2 = Admin
// 3 = Approver
// 4 = User
// 5 = Checker

const verifyToken = async (req, res, next) => {
   
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const cookieToken = req.cookies['SESSION'];

    if (!token && !cookieToken) {
        return response(req, res, {
            status: 401,
            message: "Unauthorized - Token not provided",
        });
    }

    const jwtToken = token || cookieToken;

    jwt.verify(jwtToken, secretKey, async (err, decoded) => {
        if (err) {
            if (decoded && decoded.id) {
                userSessionCache.delete(decoded.id);
            }

            return response(req, res, {
                status: 401,
                message: "Unauthorized - Invalid token",
            });
        }

        let userData = userSessionCache.get(decoded.id);

        if (!userData) {
            userData = await controller.loggedInUser({ user: decoded });

            if (!userData) {
                return response(req, res, {
                    status: 404,
                    message: "User Not Found",
                });
            }

            userSessionCache.set(decoded.id, userData);
        }

        req.user = userData;
        next();
        const userRoles = req.user ? req.user.role : [];
        const userRolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];
        const hasAllowedRole = userRolesArray.some((role) => allowedRoles.includes(role));

        if (hasAllowedRole) {
            
        } else {
            return response(req, res, {
                status: 403,
                code: req.method == 'GET' ? '-01' : '-03',
                message: "Forbidden - Forbidden access",
            });
        }
    });
};

module.exports = {
    verifyToken,
};