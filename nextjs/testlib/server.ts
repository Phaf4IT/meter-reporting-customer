import {detectPort} from "detect-port";
import {Logger} from "@/lib/logger";
import {setup} from "jest-dev-server";
import {retry} from "ts-retry";


export async function startServer(env: EnvironmentConfiguration) {
    const port = await detectPort();
    const command = `${getEnv(env)} ${process.env.NYC_ENABLED ? 'nyc ' : ''}npm run dev -- -p ${port}`;
    Logger.info(`Running cmd "${command}"`)
    const server = await setup({
        command: command,
        launchTimeout: 500000,
        port: port
    });
    await waitOnServer(`http://localhost:${port}`);

    return {port, server};
}


function getEnv(config: EnvironmentConfiguration): string {
    return Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join(' ');
}

async function waitOnServer(serverBaseUrl: string) {
    let res: Response;

    await retry(
        async () => {
            try {
                res = await fetch(serverBaseUrl, {method: 'GET'});
            } catch (error) {
                console.log(error)
            }
            Logger.debug(`STATUS ${res.status}`)
            if (res.ok) {
                console.log('Server is healthy!');
            } else {
                console.log(await res.text())
                console.log(res.status)
                throw Error;
            }
        },
        {delay: 15000, maxTry: 3}
    );
}

interface EnvironmentConfiguration {
    DATABASE_PROVIDER: string
    DATABASE_URL: string
    NEON_URL: string
    MJ_URL: string
    AUTH_RESEND_KEY: string
    IS_MAIL_ENABLED: boolean
    AUTH_SECRET: string
    IS_TEST_SERVER: boolean
}