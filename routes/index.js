const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect('/profiles');
	} else {
		res.redirect('/auth/login');
	}
});

module.exports = router;
