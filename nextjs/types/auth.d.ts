import {DefaultSession, User as DefaultUser} from "next-auth"
import {JWT as DefaultJWT} from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's role. */
            role: string
            company: string
        } & DefaultSession["user"]
    }

    interface User {
        role: string
        company: string
        & DefaultUser
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** The user's role */
        role: string
        company: string
            & DefaultJWT
    }
}