import {createWiremockServer} from "@/testlib/testcontainers/wiremock";
import {createPostgresServer} from "@/testlib/testcontainers/postgres";
import {startServer} from "@/testlib/server";
import supertest from "supertest";
import {createAdminUser} from "@/testlib/db_fixtures/adminUser.fixture";
import {loginAndGetSession} from "@/testlib/authSessionProvider";
import {getGlobalState, storeGlobalState} from "@/test/settings/globalState";
import {WireMock} from "wiremock-captain";
import {teardown} from "jest-dev-server";
import {Logger} from '@/lib/logger';
import {randomUUID} from "node:crypto";
import {PlaywrightContainer} from "@/testlib/testcontainers/playwright";

export async function mochaGlobalSetup() {
    const companyName = `Company-${randomUUID()}`;
    process.env.LOG_LEVEL = 'debug';
    process.env.LOG_FORMAT = 'full';

    const wiremockServer = await createWiremockServer();
    const {
        postgresServer, neonApiServer, neonUrl, databaseUrl
    }
        = await createPostgresServer();
    const wiremockUrl = `http://${wiremockServer.getHost()}:${wiremockServer.getMappedPort(8080)}`;

    const {server, port} = await startServer({
        DATABASE_PROVIDER: 'neon',
        NEON_URL: neonUrl,
        MJ_URL: wiremockUrl + "/v3.1/send",
        DATABASE_URL: databaseUrl,
        AUTH_RESEND_KEY: 'abc123',
        IS_MAIL_ENABLED: true,
        AUTH_SECRET: '123abc'
    });
    const serverBaseUrl = `http://localhost:${port}`;
    const request = supertest(serverBaseUrl);
    const adminEmail = await createAdminUser(companyName, databaseUrl, neonUrl);
    const sessionCookie = await loginAndGetSession(adminEmail, new WireMock(wiremockUrl), serverBaseUrl, request);
    const playwright = await new PlaywrightContainer().start(port);
    storeGlobalState({
        postgresServer,
        neonApiServer,
        wiremockServer,
        server,
        playwrightContainer: playwright.getContainer(),
        environmentVariables: {
            sessionCookie,
            companyName,
            wiremockUrl,
            serverBaseUrl:
            serverBaseUrl,
            neonUrl,
            databaseUrl,
            adminEmail,
            playwrightWebsocketUrl: playwright.getWsEndpoint(),
            defaultLocale: 'nl-NL',
        }
    })
}

export async function mochaGlobalTeardown() {
    Logger.info("Tearing down...")
    const globalState = getGlobalState();
    await teardown(globalState.server);
    await globalState.wiremockServer.stop({remove: false});
    await globalState.neonApiServer.stop({remove: false});
    await globalState.postgresServer.stop({remove: false});
    await globalState.playwrightContainer.stop({remove: false})
}