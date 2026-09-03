const mongoose = require("mongoose");

const boardModel = require("../models/Board");
const workspaceModel = require("../models/Workspace");

const {
    createBoardSchema,
    getBoardsSchema
} = require("../validators/boardValidator");


// CREATE BOARD
const createBoard = async (req, res) => {

    try {

        const validationResult =
            createBoardSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.issues
            });
        }

        const {
            title,
            workspaceId
        } = validationResult.data;

        const userId = req.userId;


        if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
            return res.status(400).json({
                message: "Invalid workspace ID"
            });
        }


        const workspace =
            await workspaceModel.findOne({
                _id: workspaceId
            });


        if (!workspace) {
            return res.status(403).json({
                message:
                    "Board can't be created as no such workspace exist"
            });
        }


        const isAdmin =
            workspace.admin.toString() === userId;

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


        const newBoard =
            await boardModel.create({
                title,
                workspaceId
            });


        return res.status(201).json({
            message: "Board created",
            id: newBoard._id
        });

    } catch (error) {

        console.error(
            "Create board error:",
            error
        );

        return res.status(500).json({
            message: "Failed to create board"
        });
    }
};


// GET BOARDS OF WORKSPACE
const getBoards = async (req, res) => {

    try {

        const validationResult =
            getBoardsSchema.safeParse(req.params);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.issues
            });
        }

        const { workspaceId } =
            validationResult.data;

        const userId = req.userId;


        if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
            return res.status(400).json({
                message: "Invalid workspace ID"
            });
        }


        const workspace =
            await workspaceModel.findOne({
                _id: workspaceId
            });


        if (!workspace) {
            return res.status(403).json({
                message:
                    "There's no such workspace that exists"
            });
        }


        const isAdmin =
            workspace.admin.toString() === userId;

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


        const boards =
            await boardModel.find({
                workspaceId
            });


        if (boards.length === 0) {
            return res.status(404).json({
                message: "No boards found"
            });
        }


        return res.status(200).json({
            message: "Board exists",
            board: boards
        });

    } catch (error) {

        console.error(
            "Get boards error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch boards"
        });
    }
};


module.exports = {
    createBoard,
    getBoards
};