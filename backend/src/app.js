const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const workspaceRoutes = require('./routes/workspaceRoutes');
const boardRoutes = require('./routes/boardRoutes');
const issueRoutes = require("./routes/issueRoutes");

const app = express();

app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
];

app.use(
    cors({
        origin: function (origin, callback) {    
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);

// Routes
app.use("/", authRoutes);
app.use("/", workspaceRoutes);
app.use("/", boardRoutes);
app.use("/", issueRoutes);

module.exports = app;