export interface Tariff {
    id: string;
    campaignName: string;
    customerIds: string[]; // UUID's als string array
    description: string;
    measureValueName?: string; // optioneel
    rate: number;
    currency: string;
    unit: 'usage_based' | 'annual' | 'daily' | 'monthly';
    rangeFrom?: number; // optioneel
    rangeTo?: number; // optioneel
    validFrom: Date;
    validTo?: Date;
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
