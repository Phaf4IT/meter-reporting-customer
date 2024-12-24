"use server"
import {updateMeasureValue as update} from "@/components/admin/measure-value/_database/measureValueRepository"
import {MeasureValue} from "@/components/admin/measure-value/measureValue";

export async function updateMeasureValue(data: MeasureValue, company: string) {
    return update(data, company)
}