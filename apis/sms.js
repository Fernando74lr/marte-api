const express = require('express');
const router = express.Router();
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// new Date((Date.UTC(2022, 0, 21, 4, 31)))
const sendSMSAt = (msg, to, at, res) => {
    client.messages
        .create({
            messagingServiceSid: 'MGffe7124594a0f520a8ed28133b14de89',
            body: msg,
            sendAt: at,
            scheduleType: 'fixed',
            to: to
        })
        .then(message => {
            console.log('OK, id: ', message.sid);
            res.json({
                ok: true,
                msg: message.sid
            });
        })
        .catch((error) => {
            console.log(error);
            res.json({
                ok: false,
                msg: error
            });
        });
};

const sendSMS = (msg, to, res) => {
    client.messages
        .create({
            body: msg,
            from: '+15077365807',
            to: to
        })
        .then(message => {
            console.log('OK, id: ', message.sid);
            res.json({
                ok: true,
                msg: message.sid
            });
        })
        .catch((error) => {
            console.log(error);
            res.json({
                ok: false,
                msg: error
            });
        });
};

// Route for send SMS
router.post('/sendSMSAt', (req, res) => {
    console.log(req.body);
    const msg = req.body.msg;
    const to = req.body.to;
    const at = req.body.at;
    sendSMSAt(msg, to, at, res);
});

// Route for send SMS
router.post('/sendSMS', (req, res) => {
    console.log(req.body);
    const msg = req.body.msg;
    const to = req.body.to;
    sendSMS(msg, to, res);
});

module.exports = router;