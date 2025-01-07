import {getContainerRuntimeClient, Network as BaseNetwork, RandomUuid, StartedNetwork} from "testcontainers";
import Docker from 'dockerode';

const dockerClient = new Docker();

export class Network extends BaseNetwork {
    private readonly name: string;

    constructor(name: string, uuid = new RandomUuid()) {
        super(uuid);
        this.name = name;
    }

    async start() {
        const client = await getContainerRuntimeClient();
        const network = client.network.getById((await new ReusableNetwork(this.name).createReusableNetwork()).getId()!);
        return new StartedNetwork(client, this.name, network);
    }
}

class ReusableNetwork {
    private readonly name: string;
    private networkId?: string;

    constructor(name: string) {
        this.name = name;
        this.networkId = undefined;
    }

    async createReusableNetwork() {
        const existingNetworks = await this.findNetwork();

        if (existingNetworks.length > 0) {
            this.networkId = existingNetworks[0].Id;
        } else {
            this.networkId = await this.createNetwork();
        }

        return this;
    }

    getId() {
        return this.networkId;
    }

    private async findNetwork() {
        const networks = await dockerClient.listNetworks();

        return networks.filter((network: any) => network.Name === this.name && network.Labels && network.Labels['com.testcontainers.hash']);
    }

    private async createNetwork() {
        const network = await dockerClient.createNetwork({
            Name: this.name,
            Labels: {'com.testcontainers.hash': 'default'},
        });

        return network.id;
    }
}