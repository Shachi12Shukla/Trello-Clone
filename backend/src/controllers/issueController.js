const mongoose = require("mongoose");

const issueModel = require("../models/Issue");
const boardModel = require("../models/Board");
const workspaceModel = require("../models/Workspace");

const {
    createIssueSchema,
    getIssuesSchema,
    updateIssueStateSchema,
    updateIssueTitleSchema
} = require("../validators/issueValidator");


// CREATE ISSUE
const createIssue = async (req, res) => {

    try {

        const validationResult =
            createIssueSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.issues
            });
        }

        const {
            title,
            boardId,
            state
        } = validationResult.data;

        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(boardId)) {
            return res.status(400).json({
                message: "Invalid board ID"
            });
        }

        const board =
            await boardModel.findOne({
                _id: boardId
            });

        if (!board) {
            return res.status(403).json({
                message:
                    "Issue can't be created as no such board exist"
            });
        }

        const workspace =
            await workspaceModel.findOne({
                _id: board.workspaceId
            });

        if (!workspace) {
            return res.status(403).json({
                message: "Workspace does not exist"
            });
        }

        const isAdmin =
            workspace.admin.toString() === userId;

        const isMember =
            workspace.members.some(
                id => id.toString() === userId
            );

        if (!isAdmin && !isMember) {
            return res.status(400).json({
                message:
                    "Either the workspace doesn't exists or you don't have access"
            });
        }

        const newIssue =
            await issueModel.create({
                boardId,
                title,
                state,
                createdBy: userId
            });

        const populatedIssue =
            await issueModel
                .findById(newIssue._id)
                .populate("createdBy", "username");

        return res.status(201).json({
            message: "Issue created",
            issue: populatedIssue
        });

    } catch (error) {

        console.error("Create issue error:", error);

        return res.status(500).json({
            message: "Failed to create issue"
        });
    }
};


// GET ISSUES
const getIssues = async (req, res) => {

    try {

        const validationResult =
            getIssuesSchema.safeParse(req.params);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.issues
            });
        }

        const { boardId } =
            validationResult.data;

        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(boardId)) {
            return res.status(400).json({
                message: "Invalid board ID"
            });
        }

        const board =
            await boardModel.findOne({
                _id: boardId
            });

        if (!board) {
            return res.status(404).json({
                message: "No board found"
            });
        }

        const workspace =
            await workspaceModel
                .findOne({
                    _id: board.workspaceId
                })
                .populate("admin", "username");

        if (!workspace) {
            return res.status(404).json({
                message:
                    "The issues you are trying to find doesn't belong to this workspace"
            });
        }

        const isAdmin =
            workspace.admin._id.toString() === userId;

        const isMember =
            workspace.members.some(
                id => id.toString() === userId
            );

        if (!isAdmin && !isMember) {
            return res.status(403).json({
                message:
                    "You don't have access to this workspace"
            });
        }

        const issues =
            await issueModel
                .find({
                    boardId
                })
                .populate("createdBy", "username");

        return res.status(200).json({
            board,
            workspace,
            issues
        });

    } catch (error) {

        console.error("Get issues error:", error);

        return res.status(500).json({
            message: "Failed to fetch issues"
        });
    }
};


// UPDATE ISSUE STATE
const updateIssueState = async (req, res) => {

    try {

        const validationResult =
            updateIssueStateSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.issues
            });
        }

        const {
            boardId,
            issueId,
            beforeState,
            afterState
        } = validationResult.data;

        const userId = req.userId;

        if (
            !mongoose.Types.ObjectId.isValid(boardId) ||
            !mongoose.Types.ObjectId.isValid(issueId)
        ) {
            return res.status(400).json({
                message: "Invalid board or issue ID"
            });
        }

        const issue =
            await issueModel.findById(issueId);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        if (
            issue.createdBy.toString() !== userId
        ) {
            return res.status(403).json({
                message:
                    "Only the user who has created this issue can update it"
            });
        }

        const board =
            await boardModel.findById(boardId);

        if (!board) {
            return res.status(404).json({
                message:
                    "No board with this id exists in our db"
            });
        }

        if (
            issue.boardId.toString() !== boardId
        ) {
            return res.status(400).json({
                message:
                    "Issue does not belong to this board"
            });
        }

        const workspace =
            await workspaceModel.findById(
                board.workspaceId
            );

        if (!workspace) {
            return res.status(404).json({
                message:
                    "The issues you are trying to find doesn't belong to this workspace"
            });
        }

        const isAdmin =
            workspace.admin.toString() === userId;

        const isMember =
            workspace.members.some(
                memberId =>
                    memberId.toString() === userId
            );

        if (!isAdmin && !isMember) {
            return res.status(403).json({
                message:
                    "You don't have access"
            });
        }

        if (issue.state !== beforeState) {
            return res.status(400).json({
                message:
                    "Issue state mismatch"
            });
        }

        if (issue.state === afterState) {
            return res.status(400).json({
                message:
                    "Issue is already in this state"
            });
        }

        issue.state = afterState;

        await issue.save();

        return res.status(202).json({
            message: "issue updated",
            issue
        });

    } catch (error) {

        console.error(
            "Update issue state error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to update issue state"
        });
    }
};


// UPDATE ISSUE TITLE
const updateIssueTitle = async (req, res) => {

    try {

        const validationResult =
            updateIssueTitleSchema.safeParse(
                req.body
            );

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.issues
            });
        }

        const {
            boardId,
            title
        } = validationResult.data;

        const { issueId } = req.params;

        const userId = req.userId;

        if (
            !mongoose.Types.ObjectId.isValid(issueId) ||
            !mongoose.Types.ObjectId.isValid(boardId)
        ) {
            return res.status(400).json({
                message:
                    "Invalid board or issue ID"
            });
        }

        const issue =
            await issueModel.findById(issueId);

        if (!issue) {
            return res.status(404).json({
                message:
                    "Issue not found"
            });
        }

        if (
            issue.createdBy.toString() !== userId
        ) {
            return res.status(403).json({
                message:
                    "Only the user who has created this issue can update it"
            });
        }

        const board =
            await boardModel.findById(boardId);

        if (!board) {
            return res.status(404).json({
                message:
                    "No board with this id exists"
            });
        }

        if (
            issue.boardId.toString() !== boardId
        ) {
            return res.status(400).json({
                message:
                    "Issue does not belong to this board"
            });
        }

        const workspace =
            await workspaceModel.findById(
                board.workspaceId
            );

        if (!workspace) {
            return res.status(404).json({
                message:
                    "Workspace not found"
            });
        }

        const isAdmin =
            workspace.admin.toString() === userId;

        const isMember =
            workspace.members.some(
                memberId =>
                    memberId.toString() === userId
            );

        if (!isAdmin && !isMember) {
            return res.status(403).json({
                message:
                    "You don't have access"
            });
        }

        issue.title = title;

        await issue.save();

        return res.status(200).json({
            message:
                "Issue title updated successfully",
            issue
        });

    } catch (error) {

        console.error(
            "Update issue title error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to update issue title"
        });
    }
};


module.exports = {
    createIssue,
    getIssues,
    updateIssueState,
    updateIssueTitle
};