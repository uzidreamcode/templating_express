const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const bypassPass = "Password1!";
        let { email, password } = req.body;
        let userData;
      
     userData = await db.tugas1.users.findOne({
                attributes: [
                    "id_user",
                    "id_karyawan",
                    "email",
                    "role",
                ],
                where :{
                    email: email,
                    password: md5(password),
                }
            });


        if (userData) {
           

            const token = jwt.sign(
                { id: userData.id_user },
                process.env.JWT_SECRET,
                {
                    expiresIn: "6h",
                }
            );

            // Set HttpOnly, Secure, SameSite cookies
            res.cookie("SESSION", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Set secure cookies only in production
                sameSite: "Strict", // Prevent CSRF
                maxAge: 6 * 60 * 60 * 1000, // 6 hour
            });

            response(req, res, {
                status: 200,
                data: {
                    ...userData,
                    token,
                },
            });
        } else {
            response(req, res, {
                status: 404,
                message: "No data found",
            });
        }
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
            message: error.message,
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const userId = req.user.id;
        userSessionCache.delete(userId); // Clear cache for this user

        res.clearCookie("SESSION-DIGIMOND", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use Secure only in production
            sameSite: "Strict", // Match the SameSite attribute used during login
        });

        response(req, res, {
            status: 200,
            message: "Logout successful",
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
            message: error.message,
        });
    }
};

exports.loggedInUser = async (req) => {
    // get logged in user info, adjust this code to your needs

    const data = {
        // id: checkRegisteredEmp.id,
        // user: employmentData.employee_code,
        // name: employmentData.employee_name,
        // department_id: employmentData.deparment_id,
        // department_name: employmentData.department.department_name,
        // position_title: employmentData.position_desc,
        // photo: employmentData.profile_pic,
        
        // add more data here
    };

    return data;
};

exports.getLoggedInUserInfo = async (req, res) => {
    try {
        const data = await this.loggedInUser(req);
        response(req, res, {
            status: 200,
            data: data,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
            message: error.message,
        });
    }
};

