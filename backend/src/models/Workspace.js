const mongoose = require("mongoose");

const workspaceSchema = mongoose.Schema({
    title: String,

    description: String,

    admin: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },

    members: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "users"
        }
    ]
});

const workspaceModel = mongoose.model("workspaces", workspaceSchema);

module.exports = workspaceModel;