export class Meter {
    readonly id: string;
    readonly customerEmail: string;
    readonly gas: number;
    readonly water: number;
    readonly light: number;
    readonly date: string;

    constructor(id: string, customerEmail: string, gas: number, water: number, light: number, date: string) {
        this.id = id;
        this.customerEmail = customerEmail;
        this.gas = gas;
        this.water = water;
        this.light = light;
        this.date = date;
    }

    static fromJSON(json: any): Meter {
        return new Meter(
            json.id,
            json.customerEmail,
            json.gas,
            json.water,
            json.light,
            json.date,
        );
    }
}