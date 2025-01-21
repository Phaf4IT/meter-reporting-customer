import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {EntityTable} from "@/components/admin/entity/_database/entityTable";
import {Entity} from "@/components/admin/entity/entity";

export async function findEntitiesByCompany(company: string) {
    return getEntityManager(EntityTable)
        .findBy({
            company: company
        })
        .then(entities => entities.map(entity => mapTableToDomain(entity)));
}

export async function findEntityByCompanyAndId(id: string, company: string) {
    return getEntityManager(EntityTable)
        .findBy({
            id: id,
            company: company
        })
        .then(entities => entities.find(() => true));
}

export async function findEntitiesByCompanyAndIds(ids: string[], company: string) {
    return getEntityManager(EntityTable)
        .findBy({
            id: ids,
            company: company
        });
}

export async function deleteEntity(entity: Entity, company: string) {
    return getEntityManager(EntityTable)
        .delete(mapDomainToTable(entity, company));
}

export async function saveEntity(entity: Entity, company: string) {
    return getEntityManager(EntityTable)
        .create(mapDomainToTable(entity, company))
        .then(entity => mapTableToDomain(entity));
}

export async function updateEntity(entity: Entity, company: string) {
    return getEntityManager(EntityTable)
        .update(mapDomainToTable(entity, company))
        .then(() => entity);
}

function mapTableToDomain(entity: EntityTable): Entity {
    return {
        id: entity.id,
        entityType: entity.entityType,
        fieldValues: entity.fieldValues,
    }
}

function mapDomainToTable(entity: Entity, company: string): EntityTable {
    return EntityTable.of({
        id: entity.id || '',
        entityType: entity.entityType,
        fieldValues: entity.fieldValues,
        company
    });
}