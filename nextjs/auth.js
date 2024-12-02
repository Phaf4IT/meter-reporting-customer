import NextAuth from "next-auth"
import {XataAdapter} from "@auth/xata-adapter"
import {XataClient} from "@/lib/xata"
import {sendVerificationRequest} from "@/lib/authSendRequest"

const client = new XataClient()

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: XataAdapter(client),
    callbacks: {
        authorized: async ({auth}) => {
            // Logged in users are authenticated, otherwise redirect to login page
            let isAuthenticated = !!auth && new Date(auth.expires) > new Date();
            if (isAuthenticated) {
                // TODO use auth.user.role to get role-based access control
                console.log(auth.expires)
            }
            return isAuthenticated
        },
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
})