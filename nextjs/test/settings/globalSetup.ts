import 'tsconfig-paths/register';
import {createWiremockServer} from "@/testlib/wiremock";
import {createPostgresServer} from "@/testlib/postgres";
import {startServer} from "@/testlib/server";
import supertest from "supertest";
import {createAdminUser} from "@/testlib/db_fixtures/adminUser.fixture";
import {loginAndGetSession} from "@/testlib/authSessionProvider";
import {getGlobalState, storeGlobalState} from "@/test/settings/globalState";
import {WireMock} from "wiremock-captain";
import {teardown} from "jest-dev-server";
import {Logger} from '@/lib/logger';

export async function mochaGlobalSetup() {
    const companyName = 'companyX';
    process.env.LOG_LEVEL = 'debug';
    process.env.LOG_FORMAT = 'full';

    const wiremockServer = await createWiremockServer();
    const {
        postgresServer, neonApiServer
    }
        = await createPostgresServer();
    const wiremockUrl = `http://${wiremockServer.getHost()}:${wiremockServer.getMappedPort(8080)}`;

    const {server, port} = await startServer({
        DATABASE_PROVIDER: 'neon',
        NEON_URL: process.env.NEON_URL!,
        MJ_URL: wiremockUrl + "/v3.1/send",
        DATABASE_URL: process.env.DATABASE_URL!,
        AUTH_RESEND_KEY: 'abc123',
        IS_MAIL_ENABLED: true,
        AUTH_SECRET: '123abc'
    });
    const serverBaseUrl = `http://localhost:${port}`;
    const request = supertest(serverBaseUrl);
    const adminEmail = await createAdminUser(companyName);
    const sessionCookie = await loginAndGetSession(adminEmail, new WireMock(wiremockUrl), serverBaseUrl, request);

    storeGlobalState({
        postgresServer,
        neonApiServer,
        wiremockServer,
        sessionCookie,
        companyName,
        wiremockUrl,
        wiremock: new WireMock(wiremockUrl),
        request,
        serverBaseUrl: serverBaseUrl,
        server
    })
}

export async function mochaGlobalTeardown() {
    Logger.info("Tearing down...")
    const globalState = getGlobalState();
    await teardown(globalState.server);
    await globalState.wiremockServer.stop();
    await globalState.neonApiServer.stop();
    await globalState.postgresServer.stop();
}