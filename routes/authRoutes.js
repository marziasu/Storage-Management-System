const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get('/login', (req, res) => res.render('login'));
router.get('/signup', (req, res) => res.render('signup'));
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/forgot-password', (req, res) => res.render('forgot-password'));
router.post('/forgot-password', authController.forgotPassword);

router.post('/resend-code',authController.resendCode);

router.post('/verify-code',authController.verifyCode);


router.post('/reset-password', authController.resetPassword);

module.exports = router;


