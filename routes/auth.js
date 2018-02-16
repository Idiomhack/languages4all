const express = require("express");
const authRoutes = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport');
const multer = require("multer");
const upload = multer({dest: "./public/images/profile"})
const bcryptSalt = 10;

const User = require("../models/User");
const Language = require("../models/Language");

const genders = User.schema.path("gender").enumValues;
const cities = User.schema.path("city").enumValues;

authRoutes.get("/signup", (req, res, next) => {
  Language.find((err, languages) => {
    if(err) return next(err);
	res.render("auth/signup", { languages, genders, cities, userInfo: {}});
  });
});

authRoutes.post("/signup", upload.single('photo'), (req, res, next) => {
	let userInfo = {
		name: req.body.name,
		password: req.body.password,
		email: req.body.email,
		gender: req.body.gender,
		city: req.body.city,
		description: req.body.description,
		interests: req.body.interests,
		imageUrl: req.body.imageUrl
	};

	if (req.file) {
		userInfo["imageUrl"] = `/images/profile/${req.file.filename}`;
	}

	Language.find((err, languages) => {
		if (err) {
			next(err);
			return;
		}

		if (req.body.name === "" || req.body.password === "" || req.body.email === "") {
			res.render("auth/signup", {
				message: "Indicate a name, password and email to sign up", languages, genders, cities, userInfo
			});
			return;
		}

		User.findOne({ "email": req.body.email }, (err, user) => {
			if (err) {
				next(err);
				return;
			}
			if (user !== null) {
				res.render("auth/signup", {
					message: "Email registered before", languages, genders, cities, userInfo
				});
				return;
			}
		});

		User.findOne({ "name": req.body.name }, (err, user) => {
			if (err) {
				next(err);
				return;
			}
			if (user !== null) {
				res.render("auth/signup", {
					message: "Name already exists", languages, genders, cities, userInfo
				});
				return;
			}
		});

		const salt = bcrypt.genSaltSync(bcryptSalt);
		const hashPass = bcrypt.hashSync(req.body.password, salt);

		userInfo["password"] = hashPass;

		let newUser = new User(userInfo);

		newUser.save((err) => {
			if (err) {
				next(err);
				return;
			}

			res.redirect("/");
		});
	});
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/profiles",
  failureRedirect: "/auth/login"
}));

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = authRoutes;