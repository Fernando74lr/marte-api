const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
let serviceAccount = require('../marte-db.json');

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

let db = admin.firestore();

router.get('/check-card-id', (req, res) => {
	const { cardId } = req.query;
	db.collection('users')
		.where('cardId', '==', cardId)
		.get()
		.then((querySnapshot) => {
			if (!querySnapshot.empty) {
				const snapshot = querySnapshot.docs[0]; // use only the first document, but there could be more
				const user = snapshot.data(); // now you have a DocumentReference
				res.json({ ok: true, user });
			} else {
				res.json({
					ok: false,
					msg: 'No existe usuario con ese código de tarjeta.',
				});
			}
		})
		.catch((error) => {
			res.json({ ok: false, error: error.message });
		});
});
module.exports = router;
