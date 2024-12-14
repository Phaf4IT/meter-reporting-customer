import {Kysely} from 'kysely';
import {connectionString} from "@/lib/neonClient";
import {NeonDialect} from "kysely-neon";
import {XyselyEntityManager} from "@/lib/jpa/xysely-entity-manager";
import {Entity, EntityClasss} from "@/lib/jpa/entity"; 

export class XyselyNeonEntityManager<T extends Entity> extends XyselyEntityManager<T> {
    constructor(entityClass: EntityClasss<T>) {
        super(new Kysely<any>({
            dialect: new NeonDialect({
                connectionString: connectionString(),
            }),
        }), entityClass);
    }
}
