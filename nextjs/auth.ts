import NextAuth from "next-auth"
import getAdapter from "@/components/authjs/auth-adapter";
import {getAuthorization} from "@/components/authjs/authorization";
import {getEmailProvider} from "@/components/authjs/email-provider";


export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: getAdapter(),
    callbacks: {
        authorized: async ({auth, request}) => getAuthorization(auth, request),
    },
    providers: [getEmailProvider()],
    session:
        {
            maxAge: 4 * 60 * 60 // 4 hours
        }
});

