const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = Schema({
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
    status: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const CommentModel = mongoose.model("comment", CommentSchema);

module.exports = CommentModel;