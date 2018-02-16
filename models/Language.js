const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const languageSchema = new Schema({
	name: String,
	flagImgPath: {
		type: String,
		default: '/images/flags/Missing_flag.png'
	}
}, {
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
	});

const Language = mongoose.model("Language", languageSchema);

module.exports = Language;