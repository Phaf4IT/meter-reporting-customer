import {GenericContainer, StartedTestContainer} from "testcontainers";

export async function createWiremockServer(): Promise<StartedTestContainer> {
    return await new GenericContainer("wiremock/wiremock")
        .withReuse()
        .withExposedPorts(8080)
        .withCommand(["-verbose"])
        .start();
}

export interface WiremockRequest {
    request: {
        body: string;
    }
}