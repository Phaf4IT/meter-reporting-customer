"use server"
import {saveMeasureValue} from "@/components/admin/measure-value/_database/measureValueRepository";
import {MeasureValue} from "@/components/admin/measure-value/measureValue";

export async function createMeasureValue(data: MeasureValue, company: string) {
    return saveMeasureValue(data, company)
}