import NextAuth from "next-auth"
import {XataAdapter} from "@auth/xata-adapter"
import {XataClient} from "@/lib/xata"
import {sendVerificationRequest} from "@/lib/authSendRequest"

const client = new XataClient()

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: XataAdapter(client),
    callbacks: {
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
    },
    providers: [{
        id: "http-email",
        name: "Email",
        type: "email",
        maxAge: 60 * 60 * 24, // Email link will expire in 24 hours
        sendVerificationRequest,
    }],
})