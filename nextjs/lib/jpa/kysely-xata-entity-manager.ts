import {Kysely, ParseJSONResultsPlugin} from 'kysely';
import {getXataClient} from "@/lib/xata";
import {XataDialect} from "@xata.io/kysely";
import {KyselyEntityManager} from "@/lib/jpa/kysely-entity-manager";
import {Entity, EntityClasss} from "@/lib/jpa/entity";

export class KyselyXataEntityManager<T extends Entity> extends KyselyEntityManager<T> {
    constructor(entityClass: EntityClasss<T>) {
        super(getXataKysely(), entityClass);
    }
}

let instance: Kysely<any> | undefined = undefined;

function getXataKysely() {
    if (instance) return instance;
    else {
        instance = new Kysely<any>({
            dialect: new XataDialect({xata: getXataClient()}),
            plugins: [new ParseJSONResultsPlugin()]
        });
        return instance;
    }
}