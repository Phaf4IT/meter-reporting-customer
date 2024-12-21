import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {MeasureValueTable} from "@/app/api/admin/measure-value/_database/measureValueTable";
import {MeasureValue, MeasureValueTranslation} from "@/app/admin/measure-value/measureValue";

export async function findMeasureValues(company: string) {
    return getEntityManager(MeasureValueTable)
        .findBy({
            company: company
        })
        .then((measureValues) =>
            measureValues.map((measureValueTable: MeasureValueTable) => {
                return new MeasureValue(
                    measureValueTable.name,
                    MeasureValueTranslation.getTranslations(measureValueTable.translations),
                    measureValueTable.measureUnit,
                    measureValueTable.type,
                    measureValueTable.isEditable,
                    measureValueTable.defaultValue);
            })
        );

}

export async function saveMeasureValue(measureValue: MeasureValue, company: string) {
    return getEntityManager(MeasureValueTable)
        .create(new MeasureValueTable(
            measureValue.name,
            measureValue.getTranslations(),
            measureValue.unit,
            measureValue.getType(),
            measureValue.isEditable,
            measureValue.defaultValue,
            company))
        .then(measureValueTable => new MeasureValue(
            measureValueTable.name,
            MeasureValueTranslation.getTranslations(measureValueTable.translations),
            measureValueTable.measureUnit,
            measureValueTable.type,
            measureValueTable.isEditable,
            measureValueTable.defaultValue)
        )
}


export async function updateMeasureValue(measureValue: MeasureValue, company: string) {
    return getEntityManager(MeasureValueTable)
        .update(new MeasureValueTable(
            measureValue.name,
            measureValue.getTranslations(),
            measureValue.unit,
            measureValue.getType(),
            measureValue.isEditable,
            measureValue.defaultValue,
            company))
        .then(() => measureValue)
}

export async function deleteMeasureValue(measureValue: MeasureValue, company: string) {
    return getEntityManager(MeasureValueTable)
        .delete(new MeasureValueTable(
            measureValue.name,
            measureValue.getTranslations(),
            measureValue.unit,
            measureValue.getType(),
            measureValue.isEditable,
            measureValue.defaultValue,
            company)
        );
}