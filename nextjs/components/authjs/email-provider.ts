import {EmailConfig} from "@/node_modules/@auth/core/providers";
import {sendVerificationRequest} from "@/lib/authSendRequest";

export function getEmailProvider(): EmailConfig {
    return {
        id: "http-email",
        name: "Email",
        type: "email",
        maxAge: 60 * 60 * 24, // Email link will expire in 24 hours
        sendVerificationRequest,
        secret: process.env.AUTH_SECRET
    };
}