import {Kysely, PostgresDialect} from 'kysely';
import {KyselyEntityManager} from "@/lib/jpa/kysely-entity-manager";
import {Entity, EntityClasss} from "@/lib/jpa/entity";
import {getPool} from "@/lib/neonClient";

export class KyselyNeonEntityManager<T extends Entity> extends KyselyEntityManager<T> {
    constructor(entityClass: EntityClasss<T>) {
        super(getNeonKysely(), entityClass);
    }
}

let instance: Kysely<any> | undefined = undefined;

function getNeonKysely() {
    if (instance) return instance;
    else {
        const pool = getPool();
        instance = new Kysely<any>({
            dialect: new PostgresDialect({
                pool,
            }),
        });
        return instance;
    }
}