const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/User");

const {
    signupSchema,
    signinSchema
} = require("../validators/authValidator");


const signup = async (req, res) => {

    try {

        const validationResult = signupSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.issues
            });
        }

        const { username, password } = validationResult.data;

        const existingUser = await userModel.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: user._id,
                username: user.username
            }
        });

    } catch (error) {

        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


const signin = async (req, res) => {

    try {

        const validationResult = signinSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.issues
            });
        }

        const { username, password } = validationResult.data;

        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Signin successful",
            token,
            user: {
                _id: user._id,
                username: user.username
            }
        });

    } catch (error) {

        console.error("Signin error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


module.exports = {
    signup,
    signin
};