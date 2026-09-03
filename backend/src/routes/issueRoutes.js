const express = require("express");

const authMiddleware =
    require("../middlewares/authMiddleware");

const {
    createIssue,
    getIssues,
    updateIssueState,
    updateIssueTitle
} = require("../controllers/issueController");

const router = express.Router();


// Create issue
router.post(
    "/issue",
    authMiddleware,
    createIssue
);


// Get issues
router.get(
    "/issues/:boardId",
    authMiddleware,
    getIssues
);


// Update issue state
router.put(
    "/issue",
    authMiddleware,
    updateIssueState
);


// Update issue title
router.patch(
    "/issue/:issueId",
    authMiddleware,
    updateIssueTitle
);


module.exports = router;