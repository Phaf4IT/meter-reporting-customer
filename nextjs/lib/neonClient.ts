import {Client, neon, neonConfig, NeonQueryFunction} from "@neondatabase/serverless";

export const sql = () => {
    return neon(connectionString());
}

export const connectionString = () => {
    const connectionString = process.env.DATABASE_URL!;
    neonConfig.fetchEndpoint = (host) => {
        const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
        return `${protocol}://${host}:${port}/sql`;
    };


    neonConfig.wsProxy = (host) => (host === 'db.localtest.me' ? `${host}:4444/v1` : undefined)!;
    return connectionString;
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