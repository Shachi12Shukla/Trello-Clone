const { z } = require("zod");

const issueStateEnum = z.enum([
    "To Do",
    "In-Progress",
    "Completed"
]);

const createIssueSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Issue title is required")
        .max(200, "Issue title cannot exceed 200 characters"),

    boardId: z
        .string()
        .min(1, "Board ID is required"),

    state: issueStateEnum
});

const getIssuesSchema = z.object({
    boardId: z
        .string()
        .min(1, "Board ID is required")
});

const updateIssueStateSchema = z.object({
    boardId: z
        .string()
        .min(1, "Board ID is required"),

    issueId: z
        .string()
        .min(1, "Issue ID is required"),

    beforeState: issueStateEnum,

    afterState: issueStateEnum
});

const updateIssueTitleSchema = z.object({
    boardId: z
        .string()
        .min(1, "Board ID is required"),

    title: z
        .string()
        .trim()
        .min(3, "Issue title cannot be empty")
        .max(50, "Issue title cannot exceed 50 characters")
});

module.exports = {
    createIssueSchema,
    getIssuesSchema,
    updateIssueStateSchema,
    updateIssueTitleSchema
};