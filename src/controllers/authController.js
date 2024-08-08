const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); const User = require('../models/userModel');
const { sendEmail } = require('../utilis/email'); 

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const userId = await User.create(name, email, hashedPassword); 
        const token = signToken(userId);
        res.status(201).json({ status: 'success', token });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
}

exports.login = async(req, res) => {
    console.log("Login request received");
    const { email, password } = req.body;
    console.log("Email:", email);
    console.log("Password:", password);

    if (!email || !password) {
        console.log("Missing email or password");
        return res.status(400).json({ status: 'fail', message: 'Please provide an email and password' });
    }

    try {
        const user = await User.findByEmail(email);
        console.log("User found:", user);

        if (!user) {
            console.log("User not found with email:", email);
            return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            console.log("Invalid password for user:", user.email);
            return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
        }

        const token = signToken(user.id);
        console.log("Token generated:", token);
        res.status(200).json({ status: 'success', token });
    } catch (error) {
        console.log("Error during login:", error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
}


exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const user = await User.findByResetToken(token);
        if (!user) {
            return res.status(400).json({ status: 'fail', message: 'Token is invalid or expired' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await User.updatePassword(user.id, hashedPassword); 
        res.status(200).json({ status: 'success', message: 'Password has been updated' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'Email not found' });
        }
        const token = signToken(user.id);
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        await User.setResetToken(user.id, token, expires);
        const resetURL = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${token}`;

        await sendEmail({
            email: user.email,
            subject: 'Reset Password',
            message: `Click on the following link to reset your password: ${resetURL}`
        });
        res.status(200).json({ status: 'success', message: 'Reset password email sent' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
}
