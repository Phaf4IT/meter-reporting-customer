import {afterAll, beforeAll} from "@jest/globals";
import {useWiremockServer} from "@/testlib/wiremock";
import {usePostgresServer} from "@/testlib/postgres";
import {StartedTestContainer} from "testcontainers";
import {WireMock} from "wiremock-captain";
import {sql} from "@/lib/neonClient";
import {retry} from "ts-retry";

let wiremockServer: StartedTestContainer;
let postgresServer: StartedTestContainer;
let neonApiServer: StartedTestContainer;

beforeAll(async () => {
    process.env.LOG_LEVEL = 'debug';
    process.env.LOG_FORMAT = 'full';

    await useWiremockServer()
        .then(value => wiremockServer = value);
    await usePostgresServer()
        .then(value => {
            postgresServer = value[0];
            neonApiServer = value[1];
        });
}, 150000);
afterAll(() => {
    wiremockServer.stop();
    postgresServer.stop();
    neonApiServer.stop();
});

export function getWiremockContainer(): StartedTestContainer {
    return wiremockServer;
}

export function getWiremockUrl(): string {
    return `http://${wiremockServer.getHost()}:${wiremockServer.getMappedPort(8080)}`;
}

export function getWiremock(): WireMock {
    return new WireMock(getWiremockUrl());
}

export function getPostgresServer() {
    return postgresServer;
}

export function getNeonApiServer() {
    return neonApiServer;
}

export async function getNeonClient() {
    const neonQueryFunction = sql();
    await retry(
        async () => {
            await neonQueryFunction(`SELECT 1`);
        },
        {delay: 100, maxTry: 3}
    );
    return neonQueryFunction;
}