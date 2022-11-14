const express = require("express");
require("dotenv").config();
const router = express.Router();
const axios = require("axios");

//Send welcome template to recipient
//This is the first step to initiate a conversation with a client
//process.env.TEMP_NUMBER is the verified number asigned by Whatsapp to send messages

const sendTemplateWhatsApp = (
    recipientNumber,
    templateName,
    templateParameters
) => {
    let tempObj = {};
    axios({
        url: `https://graph.facebook.com/v13.0/${process.env.TEMP_NUMBER}/messages`,
        method: "POST",
        data: {
            messaging_product: "whatsapp",
            to: recipientNumber,
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: "es_MX",
                },
                components: [
                    {
                        type: "body",
                        parameters: templateParameters,
                    },
                ],
            },
        },
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
    })
        .then((message) => {
            console.log(recipientNumber);
            console.log("Status:", message.status, message.statusText);
            tempObj = { number: recipientNumber, status: message.status };
        })
        .catch((err) => {
            console.log(err);
        });

    return tempObj;
};

// Send custom Whatsapp Message after Template is responded
const sendCustomWhatsApp = (recipientNumber, message) => {
    axios({
        url: `https://graph.facebook.com/v13.0/${process.env.TEMP_NUMBER}/messages`,
        method: "POST",
        data: {
            messaging_product: "whatsapp",
            to: recipientNumber,
            text: { body: message },
        },
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
    })
        .then((message) => {
            console.log(recipientNumber);
            console.log("Status:", message.status, message.statusText);
        })
        .catch((err) => {
            console.log(err);
        });
};

//
// Route for send Template Message on Whatsapp Cloud API

// Object example for sending a message:

router.post("/sendTemplateWhatsApp", (req, res) => {
    let arrRecipients = req.body.arrRecipients;
    let templateName = req.body.templateName;
    let templateParameters = req.body.templateParameters;
    arrRecipients.forEach((recipientNumber) => {
        sendTemplateWhatsApp(recipientNumber, templateName, templateParameters);
    });

    res.json({ msg: "Message sent" });
});

// Route for send custom Message on Whatsapp Cloud API

// Object example for sending a message
// Example
// {
//     "arrRecipients": [521111111111, 522222222222, 523333333333],
//     "msg": "Test from postman"
// }
router.post("/sendCustomWhatsApp", (req, res) => {
    let arrRecipients = req.body.arrRecipients;
    let message = req.body.msg;
    console.log(arrRecipients, message);
    arrRecipients.forEach((recipientNumber) => {
        sendCustomWhatsApp(recipientNumber, message);
    });
    res.json({ msg: "Message sent" });
});

module.exports = router;
