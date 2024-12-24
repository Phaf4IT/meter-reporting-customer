"use server"
import {MeasureValue} from "@/components/admin/measure-value/measureValue";
import {deleteMeasureValue as remove} from "@/components/admin/measure-value/_database/measureValueRepository"

export async function deleteMeasureValue(data: MeasureValue, company: string) {
    return remove(data, company);
}