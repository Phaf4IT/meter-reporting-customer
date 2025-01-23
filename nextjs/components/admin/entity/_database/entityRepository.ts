import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {EntityTable} from "@/components/admin/entity/_database/entityTable";
import {Entity} from "@/components/admin/entity/entity";
import {
    findEntityTypeByCompanyAndName,
    findEntityTypesByCompanyAndNames
} from "@/components/admin/entity-type/_database/entityTypeRepository";
import {EntityType} from "@/components/admin/entity-type/entityType";

export async function findEntitiesByCompany(company: string) {
    return getEntityManager(EntityTable)
        .findBy({
            company: company
        })
        .then(async entities => {
            return await getEntities(entities, company);
        });
}

export async function findEntitiesByCompanyAndType(entityType: string, company: string) {
    return getEntityManager(EntityTable)
        .findBy({
            company: company,
            entity_type: entityType
        })
        .then(entities => entities.map(entity => mapTableToDomain(entity)));
}

export async function findEntityByCompanyAndId(id: string, company: string) {
    return getEntityManager(EntityTable)
        .findBy({
            id: id,
            company: company
        })
        .then(entities => entities.find(() => true))
        .then(async entity => {
            if (entity) {
                const entityTypes = await findEntityTypeByCompanyAndName(entity.entityType, company);
                return mapTableToDomain(entity, entityTypes);
            } else {
                return undefined;
            }
        });
}

export async function findEntitiesByCompanyAndIds(ids: string[], company: string) {
    return getEntityManager(EntityTable)
        .findBy({
            id: ids,
            company: company
        })
        .then(entities => getEntities(entities, company));
}

export async function deleteEntity(entity: Entity, company: string) {
    return getEntityManager(EntityTable)
        .delete(mapDomainToTable(entity, company));
}

export async function saveEntity(entity: Entity, company: string) {
    return getEntityManager(EntityTable)
        .create(mapDomainToTable(entity, company))
        .then(async entity => {
            const entityTypes = await findEntityTypeByCompanyAndName(entity.entityType, company);
            return mapTableToDomain(entity, entityTypes);
        });
}

export async function updateEntity(entity: Entity, company: string) {
    return getEntityManager(EntityTable)
        .update(mapDomainToTable(entity, company))
        .then(() => entity);
}

async function getEntities(entities: EntityTable[], company: string) {
    const entityTypes = await findEntityTypesByCompanyAndNames(entities.map(value => value.entityType), company);
    return entities.map(entity => mapTableToDomain(entity, entityTypes.find(value => value.name === entity.entityType)!));
}

function mapTableToDomain(entity: EntityTable, entityType?: EntityType): Entity {
    return {
        id: entity.id,
        entityTypeName: entity.entityType,
        entityType: entityType,
        fieldValues: entity.fieldValues,
    }
}

function mapDomainToTable(entity: Entity, company: string): EntityTable {
    return EntityTable.of({
        id: entity.id || '',
        entityType: entity.entityTypeName,
        fieldValues: entity.fieldValues,
        company
    });
}