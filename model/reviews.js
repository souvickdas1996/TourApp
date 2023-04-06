const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ReviewModel = mongoose.model("review", ReviewSchema);

module.exports = ReviewModel;