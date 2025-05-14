import {Tariff, Unit} from "@/components/admin/tariff/tariff";
import {randomUUID} from "node:crypto";

export function getTariff(): Tariff {
    return {
        campaignName: randomUUID(),
        currency: "EUR",
        customerIds: [],
        description: randomUUID(),
        id: "",
        measureValueName: undefined,
        rangeFrom: 0,
        rangeTo: 0,
        rate: 1,
        unit: Unit.annual,
        validFrom: new Date(),
        validTo: undefined,
        isDeposit: false
    }
}