import {StartedTestContainer} from "testcontainers";
import {SpawndChildProcess} from "spawnd";
import {Logger} from "@/lib/logger";

interface GlobalState {
    postgresServer: StartedTestContainer,
    neonApiServer: StartedTestContainer,
    wiremockServer: StartedTestContainer,
    server: SpawndChildProcess[],
    sessionCookie: string,
    companyName: string,
    wiremockUrl: string,
    serverBaseUrl: string,
    neonUrl: string,
    pgconnectionstring: string,
}

let globalState: GlobalState;

export function storeGlobalState(gl: GlobalState) {
    globalState = gl;
    process.env.ADMIN_SESSION_COOKIE = gl.sessionCookie;
    process.env.COMPANY_NAME = gl.companyName;
    process.env.WIREMOCK_URL = gl.wiremockUrl;
    process.env.SERVER_URL = gl.serverBaseUrl;
    process.env.DATABASE_URL = gl.pgconnectionstring;
    process.env.NEON_URL = gl.neonUrl;
    Logger.info('Global state stored');
}

export function getGlobalState() {
    return globalState;
}