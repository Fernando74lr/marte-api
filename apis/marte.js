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
const updateUserInTableField = (user, table, timer, res) => {
	const userRef = db.collection('users').doc(user.userId);
	userRef
		.update({
			inTable: timer === 0 ? false : true,
			timer:
				timer === 0
					? 0
					: moment().add(parseInt(timer), 'minutes').unix(),
		})
		.then(() => {
			res.json({
				ok: true,
				timer,
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
	const { cardId, tableId, timer = 15 } = req.query;
	db.collection('users')
		.where('cardId', '==', cardId)
		.get()
		.then((querySnapshot) => {
			if (!querySnapshot.empty) {
				const snapshot = querySnapshot.docs[0];
				const user = snapshot.data();
				const tableColor = tableId.split('_')[0];
				const tableNum = tableId.split('_')[1];

				if (timer === 'no') {
					res.json({
						ok: true,
						msg: 'NO PASÓ NADA',
						timer,
						user,
					});
				} else if (parseInt(timer) === 0) {
					updateUserInTableField(
						user,
						{ tableColor, tableNum },
						0,
						res
					);
				} else if (parseInt(timer) > 0) {
					updateUserInTableField(
						user,
						{ tableColor, tableNum },
						user.inTable ? 0 : timer,
						res
					);
				}
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

router.get('/update-current-card-id', (req, res) => {
	const { cardId } = req.query;
	const userRef = db.collection('cardConfig').doc('currentCard');
	userRef
		.update({ cardId })
		.then(() => {
			res.json({
				ok: true,
				cardId,
			});
		})
		.catch((error) => {
			res.json({
				ok: false,
				cardId,
			});
		});
});

router.post('/new-alert', (req, res) => {
	const data = {
		...req.body,
		created: admin.firestore.Timestamp.now(),
		deleted: false,
	};
	db.collection('alerts')
		.add(data)
		.then(() => {
			res.json({ ok: true, ...data });
		})
		.catch((error) => {
			res.json({
				ok: false,
				error,
			});
		});
});

module.exports = router;
