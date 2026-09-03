const { z } = require("zod");

const createBoardSchema = z.object({
    title: z
        .string()
        .min(1, "Board title is required")
        .max(50, "Board title cannot exceed 50 characters"),

    workspaceId: z
        .string()
        .min(1, "Workspace ID is required")
});

const getBoardsSchema = z.object({
    workspaceId: z
        .string()
        .min(1, "Workspace ID is required")
});

module.exports = {
    createBoardSchema,
    getBoardsSchema
};