export interface Tariff {
    id: string;
    campaignName: string;
    customerIds: string[]; // UUID's als string array
    description: string;
    measureValueName?: string; // optioneel
    rate: number;
    currency: string;
    unit: Unit;
    rangeFrom?: number; // optioneel
    rangeTo?: number; // optioneel
    validFrom: Date;
    validTo?: Date;
}

export enum Unit {
    usage_based = 'usage_based', annual = 'annual', daily = 'daily', monthly = 'monthly'
}

export function getUnit(type: string): Unit {
    return Unit[type as keyof typeof Unit];
}

export function tariffFromJson(json: any): Tariff {
    return {
        id: json.id,
        campaignName: json.campaignName,
        customerIds: json.customerIds,
        description: json.description,
        measureValueName: json.measureValueName,
        rate: json.rate,
        currency: json.currency,
        unit: json.unit,
        rangeFrom: json.rangeFrom,
        rangeTo: json.rangeTo,
        validFrom: new Date(json.validFrom),
        validTo: json.validTo ? new Date(json.validTo) : undefined,
    };
}
