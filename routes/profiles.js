var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/images/profile' });

const User = require("../models/User");
const Language = require("../models/Language");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const genders = User.schema.path('gender').enumValues;
const cities = User.schema.path('city').enumValues;

router.use("/", function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/auth/login');
    }
});

router.get('/', function (req, res, next) {
	User.findById(req.user.id).populate({
		path: 'languagesOffered',
		model: 'Language'
	}).populate({
		path: 'languagesDemanded',
		model: 'Language'
	}).exec((err, user) => {
		if (err || !user) {
			next(err || new Error("User not found"));
			return;
		}
		req.user = user;
		res.render('profiles/show', { user });
	});
});

module.exports = router;