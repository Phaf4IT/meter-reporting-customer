import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {MeasureValueTable} from "@/app/api/admin/measure-value/_database/measureValueTable";
import {
    getMeasureValueType,
    getMeasureValueTypeName,
    getTranslations,
    getTranslationsAsRecords,
    MeasureValue
} from "@/app/admin/measure-value/measureValue";


export async function findMeasureValues(company: string) {
    return getEntityManager(MeasureValueTable)
        .findBy({
            company: company
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
        unit: measureValueTable.measureUnit,
        type: getMeasureValueType(measureValueTable.type),
        isEditable: measureValueTable.isEditable,
        defaultValue: measureValueTable.defaultValue
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