import NextAuth from "next-auth"
import getAdapter from "@/components/authjs/auth-adapter";
import {getAuthorization} from "@/components/authjs/authorization";
import {getEmailProvider} from "@/components/authjs/email-provider";

const providers = [];

if (process.env.NEXT_RUNTIME !== "edge") {
    if (process.env.MAIL_PROVIDER === 'smtp') {
        const {default: Nodemailer} = await import(
            "next-auth/providers/nodemailer"
            );
        providers.push(
            Nodemailer({
                server: {
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD,
                    },
                },
                from: process.env.EMAIL_FROM,
            })
        );
    } else {
        providers.push(getEmailProvider());
    }
}
const maxAgeInSeconds = 4 * 60 * 60;

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: getAdapter(),
    callbacks: {
        authorized: async ({auth, request}) => getAuthorization(auth, request),
    },
    providers,
    session:
        {
            maxAge: maxAgeInSeconds
        }
});

