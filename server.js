// Express
const express = require('express');
const app = express();

// Routes
const marte = require('./apis/marte');

// CORS
cors = require('cors');
app.use(cors());
app.use(express.json());

// Set routes
app.use('/api/marte', marte);

app.get('/', (req, res) => {
	res.json({
		ok: true,
	});
});

// Server PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}...`));
