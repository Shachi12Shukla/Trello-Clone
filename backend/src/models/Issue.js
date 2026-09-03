const mongoose = require("mongoose");

const issueSchema = mongoose.Schema({
    title: String,

    boardId: mongoose.Types.ObjectId,

    state: {
        type: String,
        required: true,
        enum: [
            "To Do",
            "In-Progress",
            "Completed"
        ]
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
});

const issueModel = mongoose.model("issues", issueSchema);

module.exports = issueModel;