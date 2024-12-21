"use server"
import {saveMeasureValue} from "@/app/api/admin/measure-value/_database/measureValueRepository";
import {MeasureValue} from "@/app/admin/measure-value/measureValue";

export async function createMeasureValue(data: MeasureValue, company: string) {
    return saveMeasureValue(data, company)
}