export class Customer {
    readonly email: string;
    readonly firstName: string;
    readonly middleName?: string;
    readonly lastName: string;
    readonly streetLines: string[];
    readonly postalCode: string;
    readonly city: string;
    readonly country: string;
    readonly stateOrProvinceCode: string;
    readonly phoneNumber: string;

    constructor(
        email: string,
        firstName: string,
        middleName: string | undefined,
        lastName: string,
        streetLines: string[],
        postalCode: string,
        city: string,
        country: string,
        stateOrProvinceCode: string,
        phoneNumber: string
    ) {
        this.email = email;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.streetLines = streetLines;
        this.postalCode = postalCode;
        this.city = city;
        this.country = country;
        this.stateOrProvinceCode = stateOrProvinceCode;
        this.phoneNumber = phoneNumber;
    }

    static fromJSON(json: any): Customer {
        return new Customer(
            json.email,
            json.firstName,
            json.middleName,
            json.lastName,
            json.streetLines,
            json.postalCode,
            json.city,
            json.country,
            json.stateOrProvinceCode,
            json.phoneNumber
        );
    }
}
