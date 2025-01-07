import PostgresAdapter from "@auth/pg-adapter";
import {XataClient} from "@/lib/xata";
import {XataAdapter} from "@auth/xata-adapter";
import {Adapter} from "@auth/core/adapters";
import {getPool} from "@/lib/neonClient";

function getAdapter(): Adapter {
    if (process.env.DATABASE_PROVIDER === 'neon') {
        return getNeonPostgresAdapter() as Adapter;
    } else if (process.env.DATABASE_PROVIDER === 'xata') {
        return getXataAdapter() as Adapter;
    }
    throw Error
}

const getNeonPostgresAdapter = () => {
    return PostgresAdapter(getPool())
};

const getXataAdapter = () => {
    return XataAdapter(new XataClient());
};
export default getAdapter;
