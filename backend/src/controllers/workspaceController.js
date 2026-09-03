const mongoose = require("mongoose");

const workspaceModel = require("../models/Workspace");
const userModel = require("../models/User");

const {
    createWorkspaceSchema,
    addMemberSchema,
    getWorkspaceSchema,
    removeMemberSchema
} = require("../validators/workspaceValidator");


// CREATE WORKSPACE
const createWorkspace = async (req, res) => {

    try {

        const validationResult =
            createWorkspaceSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.issues
            });
        }

        const {
            title,
            description
        } = validationResult.data;

        const userId = req.userId;

        const newWorkspace = await workspaceModel.create({
            title,
            description,
            admin: userId,
            members: []
        });

        return res.status(201).json({
            message: "workspace created",
            id: newWorkspace._id,
            workspace: newWorkspace
        });

    } catch (error) {

        console.error("Create workspace error:", error);

        return res.status(500).json({
            message: "Failed to create workspace"
        });
    }
};


// ADD MEMBER
const addMemberToWorkspace = async (req, res) => {

    try {

        const validationResult =
            addMemberSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.issues
            });
        }

        const {
            workspaceId,
            memberUsername
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


        if (
            !workspace ||
            workspace.admin.toString() !== userId
        ) {
            return res.status(411).json({
                message:
                    "Either this workspace doesn't exists or you are not an admin"
            });
        }


        const memberUser =
            await userModel.findOne({
                username: memberUsername
            });


        if (!memberUser) {
            return res.status(411).json({
                message:
                    "No user with this username exists in our DB"
            });
        }


        const isAlreadyMember =
            workspace.members.some(
                memberId =>
                    memberId.toString() ===
                    memberUser._id.toString()
            );


        if (isAlreadyMember) {
            return res.status(411).json({
                message:
                    "User is already a member of this workspace"
            });
        }


        await workspaceModel.updateOne(
            {
                _id: workspaceId
            },
            {
                $push: {
                    members: memberUser._id
                }
            }
        );


        return res.status(200).json({
            message: "New member added"
        });

    } catch (error) {

        console.error(
            "Add member error:",
            error
        );

        return res.status(500).json({
            message: "Failed to add member"
        });
    }
};


// GET ALL WORKSPACES
const getWorkspaces = async (req, res) => {

    try {

        const userId = req.userId;

        const workspaces =
            await workspaceModel.find({
                $or: [
                    { admin: userId },
                    { members: userId }
                ]
            });


        if (workspaces.length === 0) {
            return res.status(200).json({
                message: "No workspaces found",
                success: true,
                workspaces: []
            });
        }


        return res.status(200).json({
            workspaces,
            success: true
        });

    } catch (error) {

        console.error(
            "Error fetching workspaces:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch workspaces",
            success: false
        });
    }
};


// GET WORKSPACE BY ID
const getWorkspace = async (req, res) => {

    try {

        const validationResult =
            getWorkspaceSchema.safeParse(req.query);

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


        const isAdmin =
            workspace?.admin?.toString() === userId;

        const isMember =
            workspace?.members?.some(
                memberId =>
                    memberId.toString() === userId
            );


        if (
            !workspace ||
            (!isAdmin && !isMember)
        ) {
            return res.status(403).json({
                message:
                    "Either this workspace doesn't exist or you don't have access"
            });
        }


        const members =
            await userModel.find({
                _id: workspace.members
            });


        return res.status(200).json({
            workspace: {
                title: workspace.title,
                description: workspace.description,
                members: members.map(member => ({
                    username: member.username,
                    _id: member._id
                }))
            }
        });

    } catch (error) {

        console.error(
            "Get workspace error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch workspace"
        });
    }
};


// GET MEMBERS
const getMembers = async (req, res) => {

    try {

        const userId = req.userId;
        const { workspaceId } = req.params;


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
            return res.status(404).json({
                message: "No workspace exists"
            });
        }


        const members =
            await userModel.find({
                _id: {
                    $in: workspace.members
                }
            }).select("username");


        const admin =
            await userModel.findById(
                workspace.admin
            ).select("username");


        const isAdmin =
            workspace.admin.toString() === userId;

        const isMember =
            workspace.members.some(
                id => id.toString() === userId
            );


        if (!isAdmin && !isMember) {
            return res.status(403).json({
                message:
                    "You don't have access to view members of this workspace"
            });
        }


        return res.status(200).json({
            isAdmin,
            admin: {
                username: admin.username
            },
            members
        });

    } catch (error) {

        console.error(
            "Get members error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch members"
        });
    }
};


// REMOVE MEMBER
const removeMember = async (req, res) => {

    try {

        const validationResult =
            removeMemberSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.issues
            });
        }

        const {
            workspaceId,
            memberUsername
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


        if (
            !workspace ||
            workspace.admin.toString() !== userId
        ) {
            return res.status(411).json({
                message:
                    "Either this workspace doesn't exists or you are not an admin"
            });
        }


        const memberUser =
            await userModel.findOne({
                username: memberUsername
            });


        if (!memberUser) {
            return res.status(411).json({
                message:
                    "No user with this username exists in our DB"
            });
        }


        const isMember =
            workspace.members.some(
                memberId =>
                    memberId.toString() ===
                    memberUser._id.toString()
            );


        if (!isMember) {
            return res.status(411).json({
                message:
                    "member with this id is not a part of the workspace"
            });
        }


        await workspaceModel.updateOne(
            {
                _id: workspaceId
            },
            {
                $pull: {
                    members: memberUser._id
                }
            }
        );


        return res.status(200).json({
            message: "Member removed"
        });

    } catch (error) {

        console.error(
            "Remove member error:",
            error
        );

        return res.status(500).json({
            message: "Failed to remove member"
        });
    }
};


module.exports = {
    createWorkspace,
    addMemberToWorkspace,
    getWorkspaces,
    getWorkspace,
    getMembers,
    removeMember
};