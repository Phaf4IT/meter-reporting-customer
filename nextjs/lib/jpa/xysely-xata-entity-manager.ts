import {Kysely, ParseJSONResultsPlugin} from 'kysely';
import {getXataClient} from "@/lib/xata";
import {XataDialect} from "@xata.io/kysely";
import {XyselyEntityManager} from "@/lib/jpa/xysely-entity-manager";
import {Entity, EntityClasss} from "@/lib/jpa/entity";

export class XyselyXataEntityManager<T extends Entity> extends XyselyEntityManager<T> {
    constructor(entityClass: EntityClasss<T>) {
        super(new Kysely<any>({
            dialect: new XataDialect({xata: getXataClient()}),
            plugins: [new ParseJSONResultsPlugin()]
        }), entityClass);
    }
}
