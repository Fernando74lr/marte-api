// Express
const express = require('express');
const app = express();

// Routes
const emailAPI = require('./apis/email');
const pdfAPI = require('./apis/pdf');
const smsAPI = require('./apis/sms');
const whatsappAPI = require('./apis/whatsapp');
const marte = require('./apis/marte');

// CORS
cors = require('cors');
app.use(cors());
app.use(express.json());

// Set routes
app.use('/api/email', emailAPI);
app.use('/api/pdf', pdfAPI);
app.use('/api/sms', smsAPI);
app.use('/api/whatsapp', whatsappAPI);
app.use('/api/marte', marte);

app.get('/', (req, res) => {
	res.json({
		APIS: ['/api/pdf/', '/api/email/', '/api/sms/', '/api/whatsapp'],
	});
});

// Server PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}...`));
