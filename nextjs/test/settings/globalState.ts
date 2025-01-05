import {WireMock} from "wiremock-captain";
import TestAgent from "supertest/lib/agent";
import {StartedTestContainer} from "testcontainers";
import {SpawndChildProcess} from "spawnd";
import {Logger} from "@/lib/logger";

interface GlobalState {
    postgresServer: StartedTestContainer,
    neonApiServer: StartedTestContainer,
    wiremockServer: StartedTestContainer,
    sessionCookie: string,
    companyName: string,
    wiremockUrl: string,
    wiremock: WireMock,
    request: TestAgent,
    serverBaseUrl: string,
    server: SpawndChildProcess[],
}

let globalState: GlobalState;

export function storeGlobalState(gl: GlobalState) {
    globalState = gl;
    process.env.ADMIN_SESSION_COOKIE = gl.sessionCookie;
    process.env.COMPANY_NAME = gl.companyName;
    process.env.WIREMOCK_URL = gl.wiremockUrl;
    process.env.SERVER_URL = gl.serverBaseUrl;
    Logger.info('Global state stored');
}

export function getGlobalState() {
    return globalState;
}