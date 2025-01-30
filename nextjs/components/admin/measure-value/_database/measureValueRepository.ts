import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {MeasureValueTable} from "@/components/admin/measure-value/_database/measureValueTable";
import {
    getMeasureValueType,
    getMeasureValueTypeName,
    getTranslations,
    getTranslationsAsRecords,
    MeasureValue
} from "@/components/admin/measure-value/measureValue";


export async function findMeasureValues(company: string) {
    return getEntityManager(MeasureValueTable)
        .findBy({
            company: company
        })
        .then((measureValues) =>
            measureValues.map((measureValueTable: MeasureValueTable) => mapTableToDomain(measureValueTable))
        );

}

export async function findMeasureValuesByNames(names: string[], company: string) {
    return getEntityManager(MeasureValueTable)
        .findBy({
            company: company,
            name: names
        })
        .then((measureValues) =>
            measureValues.map((measureValueTable: MeasureValueTable) => mapTableToDomain(measureValueTable))
        );

}

export async function saveMeasureValue(measureValue: MeasureValue, company: string) {
    return getEntityManager(MeasureValueTable)
        .create(mapDomainToTable(measureValue, company))
        .then(measureValueTable => mapTableToDomain(measureValueTable)
        )
}


export async function updateMeasureValue(measureValue: MeasureValue, company: string) {
    return getEntityManager(MeasureValueTable)
        .update(mapDomainToTable(measureValue, company))
        .then(() => measureValue)
}


export async function deleteMeasureValue(measureValue: MeasureValue, company: string) {
    return getEntityManager(MeasureValueTable)
        .delete(mapDomainToTable(measureValue, company)
        );
}

function mapTableToDomain(measureValueTable: MeasureValueTable): MeasureValue {
    return {
        name: measureValueTable.name,
        translations: getTranslations(measureValueTable.translations),
        unit: measureValueTable.measureUnit || undefined,
        type: getMeasureValueType(measureValueTable.type),
        isEditable: measureValueTable.isEditable,
        defaultValue: measureValueTable.defaultValue || undefined
    };
}

function mapDomainToTable(measureValue: MeasureValue, company: string) {
    return new MeasureValueTable(
        measureValue.name,
        getTranslationsAsRecords(measureValue),
        measureValue.unit,
        getMeasureValueTypeName(measureValue),
        measureValue.isEditable,
        measureValue.defaultValue,
        company);
}