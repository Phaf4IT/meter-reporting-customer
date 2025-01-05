import {getRandomEmail} from "@/testlib/fixtures/email.fixture";
import {sql} from "@/lib/neonClient";
import {retry} from "ts-retry";

export async function createAdminUser(companyName: string) {
    const randomEmail = getRandomEmail();
    await retry(
        async () => {
            await sql()(`INSERT INTO users (name,
                                            email,
                                            "emailVerified",
                                            image,
                                            role,
                                            company)
                         VALUES ('the_admin',
                                 '${randomEmail}',
                                 now(),
                                 null,
                                 'admin',
                                 '${companyName}');`)
        },
        {delay: 100, maxTry: 3}
    );
    return randomEmail;
}