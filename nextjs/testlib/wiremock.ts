import {GenericContainer, StartedTestContainer} from "testcontainers";

export async function createWiremockServer(): Promise<StartedTestContainer> {
    return await new GenericContainer("wiremock/wiremock")
        .withExposedPorts(8080)
        .start();
}

export interface WiremockRequest {
    request: {
        body: string;
    }
}