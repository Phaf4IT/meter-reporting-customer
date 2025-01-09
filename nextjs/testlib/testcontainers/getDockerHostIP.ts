import Docker from "dockerode";

const docker = new Docker();

export async function getDockerHostIP(): Promise<string> {
    try {
        const networks = await docker.listNetworks();

        const bridgeNetwork = networks.find((network) => network.Name === 'bridge');

        if (!bridgeNetwork) {
            console.log('Geen bridge netwerk gevonden');
            return "";
        }

        const networkInfo = await docker.getNetwork(bridgeNetwork.Id).inspect();
        console.log('IP-adres van Docker-host (Gateway):', networkInfo.IPAM.Config[0].Gateway);
        return networkInfo.IPAM.Config[0].Gateway;
    } catch (error) {
        console.error('Fout bij het ophalen van Docker-netwerkinformatie:', error);
    }
    return "";
}