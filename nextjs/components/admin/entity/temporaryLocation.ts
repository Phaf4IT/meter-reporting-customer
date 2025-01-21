import {EntityTable} from "@/components/admin/entity/_database/entityTable";

export interface TemporaryLocation {
    streetLines: string[],
    postalCode: string,
    stateOrProvinceCode: string,
    city: string,
    country: string
}


export function getLocation(entityTable: EntityTable): TemporaryLocation {
    return {
        ...entityTable.fieldValues
    }
}