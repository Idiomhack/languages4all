const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: String,
	email: String,
	password: String,
	description: String,
	interests: String,
	city: {
		type: String,
		enum: ['Madrid','Barcelona', 'Other'],
    default: 'Other'
	},
	languagesOffered: {
		type: [Schema.Types.ObjectId],
		ref: 'Language'
	},
	languagesDemanded: {
		type: [Schema.Types.ObjectId],
		ref: 'Language'
	},
	gender: {
		type: String,
		enum: ['Male', 'Female']
	},
	role: {
		type: String,
		enum: ['User', 'Admin'],
		default: 'User'
	},
	imageUrl: {
		type: String,
		default: '/images/profile/noimage.jpg'
	}
}, {
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
	});

const User = mongoose.model("User", userSchema);

module.exports = User;