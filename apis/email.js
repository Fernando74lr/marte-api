const express = require('express');
const router = express.Router();
require('dotenv').config();

// SendGrid configuration
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
	'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'
);
sgMail.setSubstitutionWrappers('--', '--');

// Send Email
const sendEmail = (msg, res) => {
	sgMail
		.send(msg)
		.then((response) => {
			console.log('Email sent');
			res.json({
				ok: true,
				message: response,
			});
		})
		.catch((error) => {
			console.error('Error inside: ' + error);
			res.json({
				ok: false,
				message: error,
			});
		});
};

// Send multiple emails
const sendMultipleEmail = (msg, res) => {
	sgMail
		.sendMultiple(msg)
		.then((response) => {
			console.log('Email sent');
			res.json({
				ok: true,
				message: response,
			});
		})
		.catch((error) => {
			console.error('Error inside: ' + error);
			res.json({
				ok: false,
				message: error,
			});
		});
};

// Route: send one single email
router.post('/sendEmail', (req, res) => {
	console.log(req.body);
	const msg = req.body;
	sendEmail(msg, res);
});

// Route: send multiple emails
router.post('/sendMultipleEmail', (req, res) => {
	console.log(req.body);
	const msg = req.body;
	sendMultipleEmail(msg, res);
});

module.exports = router;
