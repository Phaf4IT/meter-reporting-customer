import {GenericContainer, Wait} from 'testcontainers';

export class PlaywrightContainer {
    private container: any;
    private wsEndpoint: any;

    async start(serverPort: number) {
        const genericContainer =
            new GenericContainer("ghcr.io/phaf4it/docker-playwright-client:main")
                .withReuse()
                .withEnvironment({
                    "WS_PATH": 'playwright',
                    "HOST_PORT": `${serverPort}`,
                    "LANGUAGE": 'nl'
                })
                .withExposedPorts(9222)
                .withWaitStrategy(Wait.forListeningPorts());
        this.container = await genericContainer
            .start();

        const port = this.container.getMappedPort(9222);
        const host = this.container.getHost();

        this.wsEndpoint = `ws://${host}:${port}/playwright`;
        return this;
    }

    public getWsEndpoint(): string {
        return this.wsEndpoint;
    }

    public getContainer() {
        return this.container;
    }
}
