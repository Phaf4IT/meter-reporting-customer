import {sql} from "@/lib/neonClient";
// import {getCompanyName} from "@/__tests__/settings/setupTests";
import {retry} from "ts-retry";

export async function createUser(customerEmail: string) {
    await retry(
        async () => {
            await sql(process.env.DATABASE_URL!, process.env.NEON_URL!)(`INSERT INTO users (name,
                                            email,
                                            "emailVerified",
                                            image,
                                            role,
                                            company)
                         VALUES ('random',
                                 '${customerEmail}',
                                 now(),
                                 null,
                                 '',
                                 '${process.env.COMPANY_NAME}');`);
        },
        {delay: 100, maxTry: 3}
    );
}