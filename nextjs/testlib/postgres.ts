import {GenericContainer, Network, StartedTestContainer} from "testcontainers";
import {PostgreSqlContainer} from "@testcontainers/postgresql";
import {LogWaitStrategy} from "testcontainers/build/wait-strategies/log-wait-strategy";
import {info} from "@/lib/logger";

export async function usePostgresServer(): Promise<StartedTestContainer[]> {
    const network = await new Network().start();
    info("starting postgres")
    const postgresContainer = await new PostgreSqlContainer("postgres")
        .withNetwork(network)
        .withNetworkAliases("postgres")
        .withUsername("postgres")
        .withDatabase("main")
        .withPassword("postgres")
        .withWaitStrategy(new LogWaitStrategy(new RegExp(".*PostgreSQL init process complete.*"), 1))
        .withHealthCheck({
            test: ["CMD", "pg_isready", "-d", "main", "-U", "postgres"],
            interval: 30,
            timeout: 60,
            retries: 5,
            startPeriod: 80
        })
        .withExposedPorts(5432)
        .start();
    info("inserting sql data")
    await new GenericContainer("ghcr.io/phaf4it/docker-pg-client:main@sha256:64764ad64d495a4b1ff7ae272accb1644cd4793ba1de400d6050d4954fca19a7")
        .withEnvironment({
            "PGDATABASE": "main",
            "PGHOST": "postgres",
            "PGPORT": "5432",
            "PGUSER": "postgres",
            "PGPASSWORD": "postgres",
        })
        .withNetwork(network)
        .withCopyDirectoriesToContainer([
            {
                source: "./docker/database/scheme/postgres",
                target: "/scripts/"
            }
        ])
        .withWorkingDir("/scripts")
        .withCommand(["insert.sh"])
        .start();

    const pgconnectionstring = `postgres://${postgresContainer.getUsername()}:${postgresContainer.getPassword()}@db.localtest.me:${postgresContainer.getMappedPort(5432)}/main`;
    const neonApiServer = await new GenericContainer("ghcr.io/timowilhelm/local-neon-http-proxy:main")
        .withNetwork(network)
        .withNetworkAliases("neon")
        .withWaitStrategy(new LogWaitStrategy(new RegExp(".*Starting wss on.*"), 1))
        .withEnvironment({
            "PG_CONNECTION_STRING": `postgres://${postgresContainer.getUsername()}:${postgresContainer.getPassword()}@postgres:5432/main`
        })
        .withExposedPorts(4444)
        .start();
    process.env.DATABASE_URL = pgconnectionstring;
    process.env.NEON_URL = `http://${neonApiServer.getHost()}:${neonApiServer.getMappedPort(4444)}`;
    return [postgresContainer, neonApiServer];
}