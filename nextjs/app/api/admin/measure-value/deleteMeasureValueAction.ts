"use server"
import {MeasureValue} from "@/app/admin/measure-value/measureValue";
import {deleteMeasureValue as remove} from "@/app/api/admin/measure-value/_database/measureValueRepository"

export async function deleteMeasureValue(data: MeasureValue, company: string) {
    return remove(data, company);
}