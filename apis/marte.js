const express = require('express');
const moment = require('moment');
const router = express.Router();

const admin = require('firebase-admin');
let serviceAccount = require('../marte-db.json');

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

let db = admin.firestore();

// console.log(
// 	moment(admin.firestore.Timestamp.now()).add(10, 'minutes').unix()
// .format('hh:mm:ss')
// );
const updateUserInTableField = (user, table, res) => {
	const userRef = db.collection('users').doc(user.userId);
	userRef
		.update({
			inTable: true,
			timer: moment().add(15, 'minutes').unix(),
		})
		.then(() => {
			res.json({
				ok: true,
				msg: `Mesa ${table.tableNum} ${table.tableColor} en uso para: ${user.name}`,
				user,
			});
		})
		.catch((error) => {
			res.json({
				ok: false,
				msg: 'Error al intentar actualizar al usuario',
				error: error.message,
			});
		});
};

router.get('/check-card-id', (req, res) => {
	const { cardId, tableId } = req.query;
	db.collection('users')
		.where('cardId', '==', cardId)
		.get()
		.then((querySnapshot) => {
			if (!querySnapshot.empty) {
				const snapshot = querySnapshot.docs[0];
				const user = snapshot.data();
				const tableColor = tableId.split('_')[0];
				const tableNum = tableId.split('_')[1];
				updateUserInTableField(user, { tableColor, tableNum }, res);
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
