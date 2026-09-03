const mongoose = require("mongoose");

const boardSchema = mongoose.Schema({
    title: String,
    workspaceId: mongoose.Types.ObjectId
});

const boardModel = mongoose.model("boards", boardSchema);

module.exports = boardModel;