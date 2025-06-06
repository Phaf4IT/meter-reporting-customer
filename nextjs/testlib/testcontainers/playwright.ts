import {GenericContainer, StartedTestContainer, Wait} from 'testcontainers';
import {getDockerHostIP} from "@/testlib/testcontainers/getDockerHostIP";

export class PlaywrightContainer {
    private container?: StartedTestContainer;
    private wsEndpoint: any;

    async start(serverPort: number) {
        const genericContainer: GenericContainer =
            new GenericContainer("mcr.microsoft.com/playwright:v1.52.0-noble")
                .withReuse()
                .withEnvironment({
                    "WS_PATH": 'playwright',
                    "LANGUAGE": 'nl',
                    "LANG": "nl_NL.UTF-8",
                    "LC_ALL": "nl_NL.UTF-8",
                })
                .withWorkingDir("/home/pwuser")
                .withUser("pwuser")
                .withPlatform("linux/arm64")
                // .withExposedPorts(3000)
                .withCommand([
                    "/bin/sh",
                    "-c",
                    "npx -y playwright@1.52.0 run-server --port 3000 --host 0.0.0.0"
                ])
                .withExposedPorts(3000)
                .withWaitStrategy(Wait.forListeningPorts());
        if (process.env.PLATFORM === 'linux') {
            genericContainer
                .withExtraHosts([{
                    host: "host.docker.internal",
                    ipAddress: `${await getDockerHostIP()}`,
                }])
        }
        console.log("starting playwright container")
        this.container = await genericContainer
            .start();

        const port = this.container.getMappedPort(3000);
        const host = this.container.getHost();

        this.wsEndpoint = `ws://${host}:${port}`;
        console.log("configuring nginx")
        await this.configureNginx(serverPort);
        console.log("playwright container succesfully started")
        return this;
    }

    private async configureNginx(serverPort: number) {
        const nginxConfig = `
        events { worker_connections 1024; }

        http {
            include       mime.types;
            default_type  application/octet-stream;
        
            server {
                listen ${serverPort};
        
                server_name localhost;
        
                location / {
                    proxy_pass http://host.docker.internal:${serverPort};
                    proxy_set_header Host \$host;
                    proxy_set_header X-Real-IP \$remote_addr;
                    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
                    proxy_set_header X-Forwarded-Proto \$scheme;
                }
            }
        }
        error_log /var/log/nginx/error.log debug;
        `;

        await this.container!.exec([
            'sh', '-c',
            'rm -f /home/pwuser/nginx.conf || true'
        ], {user: 'root'});

        await this.container!.exec([
            'sh', '-c',
            'rm -f /etc/nginx/nginx.conf || true'
        ], {user: 'root'});

        await this.container!.exec([
            'sh', '-c',
            `cat << 'EOF' > /home/pwuser/nginx.conf
            ${nginxConfig}
EOF`
        ], {user: 'root'});

        // Installeer Nginx
        await this.container!.exec([
            'sh', '-c',
            'apt-get update && apt-get install -y nginx locales'
        ], {user: 'root'});

        // Voeg locales toe
        await this.container!.exec([
            'sh', '-c',
            'echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \\' +
            '    echo "nl_NL.UTF-8 UTF-8" >> /etc/locale.gen && \\' +
            '    echo "de_DE.UTF-8 UTF-8" >> /etc/locale.gen'
        ], {user: 'root'});
        await this.container!.exec([
            'sh', '-c',
            'locale-gen nl_NL.UTF-8 en_US.UTF-8 de_DE.UTF-8'
        ], {user: 'root'});

        // Kopieer de configuratie naar de juiste locatie
        await this.container!.exec([
            'sh', '-c',
            'cp /home/pwuser/nginx.conf /etc/nginx/nginx.conf'
        ], {user: 'root'});

        // Start Nginx
        await this.container!.exec([
            'sh', '-c',
            'nginx'
        ], {user: 'root'});
    }

    public getWsEndpoint(): string {
        return this.wsEndpoint;
    }

    public getContainer() {
        return this.container!;
    }
}
