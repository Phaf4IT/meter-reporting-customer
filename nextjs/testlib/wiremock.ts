import {GenericContainer, StartedTestContainer} from "testcontainers";

export async function useWiremockServer(): Promise<StartedTestContainer> {
    const container = await new GenericContainer("wiremock/wiremock")
        .withExposedPorts(8080)
        .start();
    return container;
}