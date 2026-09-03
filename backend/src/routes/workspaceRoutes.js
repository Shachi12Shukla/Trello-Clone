const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const {
    createWorkspace,
    addMemberToWorkspace,
    getWorkspaces,
    getWorkspace,
    getMembers,
    removeMember
} = require("../controllers/workspaceController");

const router = express.Router();


// Create workspace
router.post(
    "/workspace",
    authMiddleware,
    createWorkspace
);


// Add member
router.post(
    "/add-member-to-workspace",
    authMiddleware,
    addMemberToWorkspace
);


// Get all workspaces
router.get(
    "/workspaces",
    authMiddleware,
    getWorkspaces
);


// Get workspace
router.get(
    "/workspace",
    authMiddleware,
    getWorkspace
);


// Get members
router.get(
    "/members/:workspaceId",
    authMiddleware,
    getMembers
);


// Remove member
router.delete(
    "/members",
    authMiddleware,
    removeMember
);


module.exports = router;