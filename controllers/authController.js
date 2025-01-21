const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')

require('dotenv').config();

exports.signup = async (req, res) => {
    const { username, email, password, confirmpassword } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.render('signup', { error: "User already exists." });
    }
    // Match password and confirm password
    if (password !== confirmpassword) {
        return res.status(400).render('signup', { error: "Passwords do not match." });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.render('login');
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('login', { error: "Email not found." });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            res.redirect("/home");
        } else {
            res.render('login', { error: "Wrong Password!" });
        }
    } catch (error) {
        res.status(500).send("An error occurred.");
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('forgot-password', { error: "Email not found." });
        }
        // Generate a 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code

        // Generate a JWT with the code
        const resetToken = jwt.sign(
            { email, code: verificationCode },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15m' } // Valid for 15 minutes
        );

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const reciver = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `
                Password Reset
                Your password reset code is: ${verificationCode}.
                This code will expire in 15 minutes.
                If you didn't request this, please ignore this email.
            `,
        };
        await transporter.sendMail(reciver);
        // Modify your forgotPassword API to return JSON
        return res.status(200).render("verify-code",{
            success: "Password reset email sent. Please check your inbox.",
            resetToken: resetToken
        });


    } catch (error) {
        return res.status(500).send({ message: "Something Went Wrong!" })
    }

};

exports.resendCode = async (req, res) => {
    try {
        const { resetToken } = req.body;

        // Decode the resetToken to get email
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET_KEY);

        // Generate a new 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code

        // Generate a new JWT with the code (resetToken is re-issued)
        const newResetToken = jwt.sign(
            { email: decoded.email, code: verificationCode },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15m' } // Valid for 15 minutes
        );

        // Send the new code to the user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const receiver = {
            from: process.env.EMAIL_USER,
            to: decoded.email,
            subject: 'Password Reset Request',
            text: `
                Password Reset
                Your password reset code is: ${verificationCode}.
                This code will expire in 15 minutes.
                If you didn't request this, please ignore this email.
            `,
        };

        await transporter.sendMail(receiver);

        // After sending the email, return to the same page with a success message
        return res.render('verify-code', {
            success: "A new verification code has been sent to your email.",
            resetToken: newResetToken
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong. Please try again." });
    }
};


exports.verifyCode = async (req, res) => {

    console.log(resetToken)
    const {resetToken, digit1, digit2, digit3, digit4, digit5, digit6 } = req.body;
    const code = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`; // Combine digits
    try {

        // Decode the token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET_KEY)


        // Check if the provided code matches the token's code
        if (decoded.code.toString() === code.toString()) {
            // find user id
            email = decoded.email.toString()
            const user = await User.findOne({ email });
            const userId = user._id;
            console.log(userId)
            return res.render('reset-password', { userId });

        } else {
            return res.render('verify-code', { success: "Password reset email sent.Please check your inbox.", error: 'Invalid verification code.Please try again.', resetToken });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'Something went wrong.' });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { userId, password, confirmpassword } = req.body

        if (!password) {
            return res.status(400).render('reset-password', { message: "Please provide a password." });
        }
        if (!confirmpassword) {
            return res.status(400).render('reset-password', { message: "Please provide confirm password." });
        }

        // Match password and confirm password
        if (password !== confirmpassword) {
            return res.status(400).render('reset-password', { message: "Passwords do not match." });
        }

        // Hash the password (using bcrypt)
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password in the database
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        return res.status(200).render('login');

    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "An error occurred while resetting the password." });
    }
}
