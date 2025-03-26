import {GenericContainer, StartedTestContainer, Wait} from 'testcontainers';
import {getDockerHostIP} from "@/testlib/testcontainers/getDockerHostIP";

export class PlaywrightContainer {
    private container?: StartedTestContainer;
    private wsEndpoint: any;

    async start(serverPort: number) {
        const genericContainer: GenericContainer =
            new GenericContainer("ghcr.io/phaf4it/docker-playwright-client:main")
                .withReuse()
                .withEnvironment({
                    "WS_PATH": 'playwright',
                    "LANGUAGE": 'nl'
                })
                .withPlatform("linux/x86_64")
                .withExposedPorts(9222)
                .withWaitStrategy(Wait.forListeningPorts());
        if (process.env.PLATFORM === 'linux') {
            genericContainer
                .withExtraHosts([{
                    host: "host.docker.internal",
                    ipAddress: `${await getDockerHostIP()}`,
                }])
        }
        this.container = await genericContainer
            .start();

        const execResult = await this.container.exec(`env HOST_PORT=${serverPort} update-nginx-port`);

        if (execResult.exitCode !== 0) {
            throw Error("Could not reset nginx");
        }

        const port = this.container.getMappedPort(9222);
        const host = this.container.getHost();

        this.wsEndpoint = `ws://${host}:${port}/playwright`;
        return this;
    }

    public getWsEndpoint(): string {
        return this.wsEndpoint;
    }

    public getContainer() {
        return this.container!;
    }
}
