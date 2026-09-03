const mongoose = require("mongoose");
require('dotenv').config();

// Connect to DB
const uri = process.env.URI;
mongoose.connect(uri)
    .then( ()=> console.log("Connected to DB!"))
    .catch( (err) => console.log("Connection error: ", err));

// Schemas
const userSchema = mongoose.Schema({
    username: String,
    password: String
});

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

const boardSchema = mongoose.Schema({
    title: String,
    workspaceId: mongoose.Types.ObjectId
});

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

// Models
const workspaceModel = mongoose.model("workspaces", workspaceSchema);
const userModel = mongoose.model("users", userSchema);
const boardModel = mongoose.model("boards", boardSchema);
const issueModel = mongoose.model("issues", issueSchema);

module.exports = {
    userModel,
    workspaceModel,
    boardModel,
    issueModel
}