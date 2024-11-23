import NextAuth from "next-auth"
import {XataAdapter} from "@auth/xata-adapter"
import {XataClient} from "@/lib/xata"
import ForwardEmail from "next-auth/providers/forwardemail"

const client = new XataClient()

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: XataAdapter(client),
    providers: [
        ForwardEmail({
      // If your environment variable is named differently than default
      apiKey: AUTH_FORWARDEMAIL_KEY,
      from: "no-reply@raffeltje.nl"
    }),
    ],
})