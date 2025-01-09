import {StartedTestContainer} from "testcontainers";
import {SpawndChildProcess} from "spawnd";
import {Logger} from "@/lib/logger";
import {EnvironmentVariables} from "@/testlib/environmentVariableProvider";

interface GlobalState {
    postgresServer: StartedTestContainer,
    neonApiServer: StartedTestContainer,
    wiremockServer: StartedTestContainer,
    playwrightContainer: StartedTestContainer,
    server: SpawndChildProcess[],
    environmentVariables: EnvironmentVariables
}

let globalState: GlobalState;

export function storeGlobalState(gl: GlobalState) {
    globalState = gl;
    process.env.ADMIN_SESSION_COOKIE = gl.environmentVariables.sessionCookie;
    process.env.COMPANY_NAME = gl.environmentVariables.companyName;
    process.env.WIREMOCK_URL = gl.environmentVariables.wiremockUrl;
    process.env.SERVER_URL = gl.environmentVariables.serverBaseUrl;
    process.env.DATABASE_URL = gl.environmentVariables.databaseUrl;
    process.env.NEON_URL = gl.environmentVariables.neonUrl;
    process.env.PLAYWRIGHT_WEBSOCKET_URL = gl.environmentVariables.playwrightWebsocketUrl
    process.env.ADMIN_EMAIL = gl.environmentVariables.adminEmail;
    Logger.info('Global state stored');
}

export function getGlobalState() {
    return globalState;
}