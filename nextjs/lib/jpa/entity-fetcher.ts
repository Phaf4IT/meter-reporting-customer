import {EntityManager} from "@/lib/jpa/entity-manager";
import {KyselyNeonEntityManager} from "@/lib/jpa/kysely-neon-entity-manager";
import {KyselyXataEntityManager} from "@/lib/jpa/kysely-xata-entity-manager";
import {Entity, EntityClasss} from "@/lib/jpa/entity";
import {KyselyEntityManager} from "@/lib/jpa/kysely-entity-manager";

export const getEntityManager = <T extends Entity>(entityClass: EntityClasss<T>): EntityManager<T> => {
    if (process.env.DATABASE_PROVIDER === 'neon') {
        return getNeonEntityManager(entityClass);
    } else if (process.env.DATABASE_PROVIDER === 'xata') {
        return getXataEntityManager(entityClass)
    } else {
        throw Error
    }
}

function getNeonEntityManager<T extends Entity>(entityClass: EntityClasss<T>): EntityManager<T> {
    if (entityManagers.has(entityClass)) {
        return entityManagers.get(entityClass)!;
    } else {
        const kyselyNeonEntityManager = new KyselyNeonEntityManager(entityClass);
        entityManagers.set(entityClass, kyselyNeonEntityManager)
        return kyselyNeonEntityManager;
    }
}

function getXataEntityManager<T extends Entity>(entityClass: EntityClasss<T>): EntityManager<T> {
    if (entityManagers.has(entityClass)) {
        return entityManagers.get(entityClass)!;
    } else {
        const kyselyXataEntityManager = new KyselyXataEntityManager(entityClass);
        entityManagers.set(entityClass, kyselyXataEntityManager)
        return kyselyXataEntityManager;
    }
}

export const entityManagers: Map<EntityClasss<any>, KyselyEntityManager<any>> = new Map();