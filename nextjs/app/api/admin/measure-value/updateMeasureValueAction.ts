"use server"
import {updateMeasureValue as update} from "@/app/api/admin/measure-value/_database/measureValueRepository"
import {MeasureValue} from "@/app/admin/measure-value/measureValue";

export async function updateMeasureValue(data: MeasureValue, company: string) {
    return update(data, company)
}