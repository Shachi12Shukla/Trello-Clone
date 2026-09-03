const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const workspaceRoutes = require('./routes/workspaceRoutes');
const boardRoutes = require('./routes/boardRoutes');
const issueRoutes = require("./routes/issueRoutes");

const app = express();

app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173"
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    })
);

// Routes
app.use("/", authRoutes);
app.use("/", workspaceRoutes);
app.use("/", boardRoutes);
app.use("/", issueRoutes);

module.exports = app;