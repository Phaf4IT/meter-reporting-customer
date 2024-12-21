import {MeasureValue} from "@/app/admin/measure-value/measureValue";

export async function getMeasureValues(): Promise<MeasureValue[]> {
    return fetch('/api/admin/measure-value')
        .then(response => response.json())
        .then(data => data.map((item: any) => MeasureValue.fromJSON(item)));
}

export async function saveMeasureValue(measureValue: MeasureValue, isNew: boolean): Promise<MeasureValue> {
    const method = isNew ? 'POST' : 'PUT';
    return fetch(`/api/admin/measure-value`, {
        method,
        body: JSON.stringify(measureValue),
        headers: {'Content-Type': 'application/json'},
        credentials: "include"
    }).then(response => response.json())
        .then((item: any) => MeasureValue.fromJSON(item));
}

export async function deleteMeasureValue(measureValue: MeasureValue): Promise<boolean> {
    return fetch(`/api/admin/measure-value`, {
        method: 'DELETE',
        body: JSON.stringify(measureValue),
        credentials: "include"
    }).then(response => response.ok);
}
