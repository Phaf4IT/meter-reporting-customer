import {Entity} from "@/components/admin/entity/entity";

export function getEntity(entityName: string): Entity {
    return {
        entityTypeName: entityName,
        fieldValues: {
            streetLines: ['1234 Elm Street'],
            postalCode: '12345',
            city: 'Metropolis',
            country: 'Country',
            stateOrProvinceCode: 'NY',
        }
    }
}