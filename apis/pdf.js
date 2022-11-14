
const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');

const urlAPIPDF = 'https://us1.pdfgeneratorapi.com/api/v3/';

const jwt = require('jsonwebtoken');

const generateToken = () => {
    const secret = '244ff277aa3c67b3c1c0e5c4fe2864b6e5a3d173ba27aa028d8ec38051f8fe55';
    const privateKey = '3bb2bee61ce11daf327c07e1be5cad03ab74238ceb47a48bf3e0be8520ac445a';
    const payload = { iss: privateKey, sub: 'glopezberistain@computodo.net' }; //, exp: (60*1000)*2 };
    const options = { expiresIn: '1m' }; // 1 minute
    return jwt.sign(payload, secret, options);
}

// Get PDF template ID
const getPDFTemplate = (type) => {
    switch (type) {
        case 'consult': return '413056';
        case 'lab_study': return '413057';
        default: return 'ERROR';
    };
};

// Gnerate PDF through API
const generatePDF = (type, filename, data, res) => {
    const template = getPDFTemplate(type);
    const endpoint = `templates/${template}/output?name=${filename}&format=pdf&output=url`;
    const url = urlAPIPDF + endpoint;
    const token = generateToken().trim();

    if (token) {
        // Options
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        axios
            .post(url, JSON.stringify(data), options)
            .then(({ data }) => {
                console.log(data);
                res.json({
                    ok: true,
                    response: data
                });
            })
            .catch((error) => {
                console.log('Error axios: ', error);
                res.json({
                    ok: false,
                    error: error
                });
            });
    } else {
        console.log('TOKEN error');
        res.json({
            ok: false,
            token: token
        });
    }
}

// router.get('/', (req, res) => {
//     res.json({
//         token: generateToken().trim()
//     })
// });

// Generate PDF Endpoint
router.post('/generatePDF', (req, res) => {
    const type = req.query.type;
    const filename = req.query.filename;
    const data = req.body;
    if (type && filename && data) {
        generatePDF(type, filename, data, res);
    } else {
        res.json({
            ok: false,
            error: 'Problem with query params or data json'
        });
    }   
});

module.exports = router;
