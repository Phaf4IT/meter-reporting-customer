import {EntityManager} from "@/lib/jpa/entity-manager";
import {XyselyNeonEntityManager} from "@/lib/jpa/xysely-neon-entity-manager";
import {XyselyXataEntityManager} from "@/lib/jpa/xysely-xata-entity-manager";
import {Entity, EntityClasss} from "@/lib/jpa/entity";

export const getEntityManager = <T extends Entity>(entityClass: EntityClasss<T>): EntityManager<T> => {
    if (process.env.DATABASE_PROVIDER === 'neon') {
        return new XyselyNeonEntityManager(entityClass);
    } else if (process.env.DATABASE_PROVIDER === 'xata') {
        return new XyselyXataEntityManager(entityClass)
    } else {
        throw Error
    }
}