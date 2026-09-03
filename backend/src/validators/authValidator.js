const { z } = require("zod");

const signupSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 2 characters long")
        .max(30, "Username cannot exceed 30 characters"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password cannot exceed 20 characters")
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
});

const signinSchema = z.object({
    username: z
        .string()
        .min(1, "Username is required"),

    password: z
        .string()
        .min(1, "Password is required")
});

module.exports = {
    signupSchema,
    signinSchema
};