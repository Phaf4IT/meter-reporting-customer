import {neonConfig, Pool} from "@neondatabase/serverless";
import PostgresAdapter from "@auth/pg-adapter";
import {XataClient} from "./lib/xata";
import {XataAdapter} from "@auth/xata-adapter";

const getAdapter = () => {
    if (process.env.DATABASE_PROVIDER === 'postgres') {
        return getNeonPostgresAdapter();
    } else if (process.env.DATABASE_PROVIDER === 'xata') {
        return getXataAdapter();
    }
    throw Error
};

const getNeonPostgresAdapter = () => {
    const connectionString = 'postgres://postgres:postgres@db.localtest.me:5432/main';
    neonConfig.fetchEndpoint = (host) => {
        const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
        return `${protocol}://${host}:${port}/sql`;
    };
    const connectionStringUrl = new URL(connectionString);
    neonConfig.useSecureWebSocket = connectionStringUrl.hostname !== 'db.localtest.me';
    neonConfig.wsProxy = (host) => (host === 'db.localtest.me' ? `${host}:4444/v1` : undefined);

    console.log(connectionString)
    const pool = new Pool({connectionString})
    return PostgresAdapter(pool)
};

const getXataAdapter = () => {
    const client = new XataClient()
    return XataAdapter(client);
};
export default getAdapter;
