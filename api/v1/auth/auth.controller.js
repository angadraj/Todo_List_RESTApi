require('dotenv').config();
const { sendResponse } = require('../../module/utils/response');
const UserModel = require('../../module/models/user.model');
const emailValidator = require('email-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { sendEmail } = require('../../module/utils/mailService');
const logger = require('../../module/utils/logger');

const authController = {
    
    register: async function (req, res) {
        try {
            const { name, email, password, confirmPassword } = req.body;
            if (!name || !email || !password || !confirmPassword) {
                return sendResponse(res, 400, false, "name, email, password & confirm password are required", null, "error");
            }
            if (password !== confirmPassword) {
                return sendResponse(res, 400, false, "Password does not match!");
            }
            const validEmail = await emailValidator.validate(email);
            if (!validEmail) {
                return sendResponse(res, 400, false, "Email invalid", null, "error");
            }

            const existingUser = await UserModel.findOne({email: email});
            if (existingUser) {
                return sendResponse(res, 406, false, "Already registered", null, "error");
            }

            const encryptedPass = await bcrypt.hash(password, 10);
            const newUser = await UserModel.create({
                name: name,
                email: email,
                password: encryptedPass
            })
            const token = jwt.sign({
                'userId': newUser.id,
                'email': newUser.email
            }, process.env.JWT_SECRET);

            sendEmail({userEmail: newUser.email});

            return sendResponse(res, 200, true, "Welcome User", {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                active: newUser.active,
                token: token
            }, null);
            
        } catch (e) {
            logger.error(e);
            return sendResponse(res, 500, false, e.message, null, "error");
        }
    },

    login: async function (req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return sendResponse(res, 400, false, "email & password are required", null, "error");
            }
            const existingUser = await UserModel.findOne({
                email: email
            })
            if (!existingUser) {
                return sendResponse(res, 400, false, "Please register yourself", null, "error");
            }
            const passwordMatch = await bcrypt.compare(password, existingUser.password);
            if (!passwordMatch) {
                return sendResponse(res, 400, false, "Invalid Credentials", null, "error");
            }
            const token = jwt.sign({
                'userId': existingUser.id,
                'email': existingUser.email
            }, process.env.JWT_SECRET);

            return sendResponse(res, 200, true, "User logged in", { token: token, userId: existingUser.id, email: existingUser.email, name: existingUser.name, active: existingUser.active }, null);

        } catch (e) {
            logger.error(e);
            return sendResponse(res, 500, false, e.message, null, "error");
        }
    }
}

module.exports = authController;