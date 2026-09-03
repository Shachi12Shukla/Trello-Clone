const express = require("express");

const authMiddleware =
    require("../middlewares/authMiddleware");

const {
    createBoard,
    getBoards
} = require("../controllers/boardController");

const router = express.Router();


// Create board
router.post(
    "/board",
    authMiddleware,
    createBoard
);


// Get boards of workspace
router.get(
    "/boards/:workspaceId",
    authMiddleware,
    getBoards
);


module.exports = router;