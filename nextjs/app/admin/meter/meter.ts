export interface Meter {
    readonly id: string;
    readonly customerEmail: string;
    readonly gas: number;
    readonly water: number;
    readonly light: number;
    readonly date: string;
}

export function meterFromJson(json: any): Meter {
    return {
        id: json.id,
        customerEmail: json.customerEmail,
        gas: json.gas,
        water: json.water,
        light: json.light,
        date: json.date,
    }
}