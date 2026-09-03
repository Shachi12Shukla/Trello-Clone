const { z } = require("zod");

const createWorkspaceSchema = z.object({
    title: z
        .string()
        .min(1, "Workspace title is required")
        .max(30, "Workspace title cannot exceed 30 characters"),

    description: z
        .string()
        .max(100, "Workspace description cannot exceed 100 characters")
        .optional()
});

const addMemberSchema = z.object({
    workspaceId: z
        .string()
        .min(1, "Workspace ID is required"),

    memberUsername: z
        .string()
        .min(1, "Member username is required")
});

const getWorkspaceSchema = z.object({
    workspaceId: z
        .string()
        .min(1, "Workspace ID is required")
});

const removeMemberSchema = z.object({
    workspaceId: z
        .string()
        .min(1, "Workspace ID is required"),

    memberUsername: z
        .string()
        .min(1, "Member username is required")
});

module.exports = {
    createWorkspaceSchema,
    addMemberSchema,
    getWorkspaceSchema,
    removeMemberSchema
};