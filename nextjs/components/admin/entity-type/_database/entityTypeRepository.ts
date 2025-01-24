import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {EntityTypeTable} from "@/components/admin/entity-type/_database/entityTypeTable";
import {EntityType} from "@/components/admin/entity-type/entityType";

export async function findEntityTypesByCompany(company: string) {
    return getEntityManager(EntityTypeTable)
        .findBy({
            company: company
        })
        .then(entityTypes => entityTypes.map(entityType => mapTableToDomain(entityType)));
}

export async function findEntityTypeByCompanyAndName(name: string, company: string): Promise<EntityType | undefined> {
    return getEntityManager(EntityTypeTable)
        .findBy({
            name: name,
            company: company
        })
        .then(entityTypes => entityTypes
            .map(entityType => mapTableToDomain(entityType))
            .find(() => true))
}

export async function findEntityTypesByCompanyAndNames(name: string[], company: string) {
    return getEntityManager(EntityTypeTable)
        .findBy({
            name: name,
            company: company
        })
        .then(entityTypes => entityTypes.map(entityType => mapTableToDomain(entityType)));
}

export async function deleteEntityType(entityType: EntityType, company: string) {
    return getEntityManager(EntityTypeTable)
        .delete(mapDomainToTable(entityType, company));
}

export async function saveEntityType(entityType: EntityType, company: string) {
    return getEntityManager(EntityTypeTable)
        .create(mapDomainToTable(entityType, company))
        .then(entityType => mapTableToDomain(entityType));
}

export async function updateEntityType(entityType: EntityType, company: string) {
    return getEntityManager(EntityTypeTable)
        .update(mapDomainToTable(entityType, company))
        .then(() => entityType);
}

function mapTableToDomain(entityType: EntityTypeTable): EntityType {
    return {
        name: entityType.name,
        fields: entityType.fields,
        translations: entityType.translations,
    }
}

function mapDomainToTable(entityType: EntityType, company: string): EntityTypeTable {
    return EntityTypeTable.of({
        name: entityType.name,
        fields: entityType.fields,
        translations: entityType.translations,
        company
    });
}
