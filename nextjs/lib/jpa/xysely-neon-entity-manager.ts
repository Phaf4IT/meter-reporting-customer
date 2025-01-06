import {Kysely, PostgresDialect} from 'kysely';
import {XyselyEntityManager} from "@/lib/jpa/xysely-entity-manager";
import {Entity, EntityClasss} from "@/lib/jpa/entity";
import {getPool} from "@/lib/neonClient";

export class XyselyNeonEntityManager<T extends Entity> extends XyselyEntityManager<T> {
    constructor(entityClass: EntityClasss<T>) {
        const pool = getPool();
        super(new Kysely<any>({
            dialect: new PostgresDialect({
                pool,
            }),
        }), entityClass);
    }
}
