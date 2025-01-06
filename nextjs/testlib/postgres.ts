import {GenericContainer, StartedTestContainer} from "testcontainers";
import {PostgreSqlContainer} from "@testcontainers/postgresql";
import {LogWaitStrategy} from "testcontainers/build/wait-strategies/log-wait-strategy";
import {info} from "@/lib/logger";
import {Network} from "@/testlib/network";

export async function createPostgresServer(): Promise<{
    postgresServer: StartedTestContainer,
    neonApiServer: StartedTestContainer,
    pgconnectionstring: string,
    neonUrl: string
}> {
    const network = await new Network("database-network").start();

    info("starting postgres")
    const postgresServer = await new PostgreSqlContainer("postgres")
        .withReuse()
        .withNetwork(network)
        .withNetworkAliases("postgresTest")
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
        .withReuse()
        .withEnvironment({
            "PGDATABASE": "main",
            "PGHOST": "postgresTest",
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
    info("starting neon")
    const pgconnectionstring = `postgres://${postgresServer.getUsername()}:${postgresServer.getPassword()}@db.localtest.me:${postgresServer.getMappedPort(5432)}/main`;
    const neonApiServer = await new GenericContainer("ghcr.io/timowilhelm/local-neon-http-proxy:main")
        .withReuse()
        .withNetwork(network)
        .withWaitStrategy(new LogWaitStrategy(new RegExp(".*Starting wss on.*"), 1))
        .withEnvironment({
            "PG_CONNECTION_STRING": `postgres://${postgresServer.getUsername()}:${postgresServer.getPassword()}@postgresTest:5432/main`
        })
        .withExposedPorts(4444)
        .start();
    return {
        postgresServer,
        neonApiServer,
        pgconnectionstring,
        neonUrl: `http://${neonApiServer.getHost()}:${neonApiServer.getMappedPort(4444)}`
    };
}