import {Client, neon, neonConfig, NeonQueryFunction, Pool} from "@neondatabase/serverless";
import {Logger} from "@/lib/logger";

export const sql = () => {
    return neon(connectionString());
}

export const connectionString = () => {
    const connectionString = process.env.DATABASE_URL!;
    const neonConnectionString = process.env.NEON_URL!;
    const url = new URL(neonConnectionString);
    neonConfig.fetchEndpoint = () => {
        return `${url.origin}/sql`;
    };
    return connectionString;
}

export const clientPool = async () => {
    /* or using Pool */
    const neonConnectionString = new URL(process.env.NEON_URL!);
    const connectionStringUrl = new URL(process.env.DATABASE_URL!);
    neonConfig.useSecureWebSocket = connectionStringUrl.hostname !== 'db.localtest.me';
    neonConfig.wsProxy = `${neonConnectionString.host}/v1`;

    const pool = new Pool({connectionString: connectionStringUrl.origin});
    const {rows} = await pool.query('SELECT * FROM NOW()');

    Logger.info(rows[0]);

    await pool.end();
}

export const getClient = () => {
    return new Client({
        connectionString: connectionString(),
    })
}

export class NeonClient {
    private queryFunction: NeonQueryFunction<any, any> = neon(connectionString());

    query(strings: TemplateStringsArray, ...params: any[]) {
        return this.queryFunction(strings, params);
    }
}