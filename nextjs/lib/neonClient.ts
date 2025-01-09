import {Client, neon, neonConfig, NeonQueryFunction, Pool} from "@neondatabase/serverless";
import {Logger} from "@/lib/logger";

let pool: Pool | undefined = undefined;

export const sql = (databaseUrl: string, neonUrl: string) => {
    return neon(connectionString(databaseUrl, neonUrl));
}

export const connectionString = (databaseUrl: string, neonUrl: string) => {
    const url = new URL(neonUrl);
    neonConfig.fetchEndpoint = () => {
        return `${url.origin}/sql`;
    };
    return databaseUrl;
}

export const getPool = () => {
    if (!pool) {
        const neonConnectionString = new URL(process.env.NEON_URL!);
        const connectionStringUrl = new URL(process.env.DATABASE_URL!);
        neonConfig.useSecureWebSocket = connectionStringUrl.hostname !== 'db.localtest.me';
        neonConfig.wsProxy = `${neonConnectionString.host}/v1`;
        pool = new Pool({connectionString: process.env.DATABASE_URL!, max: 10});
    }
    return pool;
}

export const clientPool = async () => {
    const pool = getPool();
    const {rows} = await pool.query('SELECT * FROM NOW()');

    Logger.info(rows[0]);

    await pool.end();
}

export const getClient = () => {
    return new Client({
        connectionString: connectionString(process.env.DATABASE_URL!, process.env.NEON_URL!),
    })
}

export class NeonClient {
    private queryFunction: NeonQueryFunction<any, any> = neon(connectionString(process.env.DATABASE_URL!, process.env.NEON_URL!));

    query(strings: TemplateStringsArray, ...params: any[]) {
        return this.queryFunction(strings, params);
    }
}