import NextAuth from "next-auth"
import {sendVerificationRequest} from "@/lib/authSendRequest"
import getAdapter from "@/components/authjs/auth-adapter";
import {getAuthorization} from "@/components/authjs/authorization";


export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: getAdapter(),
    callbacks: {
        authorized: async ({auth, request}) => getAuthorization(auth, request),
    },
    providers: [{
        id: "http-email",
        name: "Email",
        type: "email",
        maxAge: 60 * 60 * 24, // Email link will expire in 24 hours
        sendVerificationRequest,
    }],
    session:
        {
            maxAge: 4 * 60 * 60 // 4 hours
        }
});

