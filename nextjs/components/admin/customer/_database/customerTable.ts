import {Entity} from "@/lib/jpa/entity";
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import Customer from "@/components/database/schemas/public/Customer";

@EntityClass("customer")
export class CustomerTable extends Entity implements Customer {
    @PrimaryKey
    @Field()
    email: string;
    @Field()
    title: string | null;
    @Field("first_name")
    firstName: string;
    @Field("middle_name")
    middleName: string | null;
    @Field("last_name")
    lastName: string;
    @Field("street_lines")
    streetLines: string[];
    @Field("postal_code")
    postalCode: string;
    @Field("city")
    city: string;
    @Field("country")
    country: string;
    @Field("state_or_province")
    stateOrProvince: string;
    @Field("phone_number")
    phoneNumber: string;
    @PrimaryKey
    @Field("company")
    company: string;

    constructor(
        email: string,
        title: string | undefined,
        firstName: string,
        middleName: string | undefined,
        lastName: string,
        streetLines: string[],
        postalCode: string,
        city: string,
        country: string,
        stateOrProvince: string,
        phoneNumber: string,
        company: string
    ) {
        super();
        this.email = email;
        this.title = title || null;
        this.firstName = firstName;
        this.middleName = middleName || null;
        this.lastName = lastName;
        this.streetLines = streetLines;
        this.postalCode = postalCode;
        this.city = city;
        this.country = country;
        this.stateOrProvince = stateOrProvince;
        this.phoneNumber = phoneNumber;
        this.company = company;
    }
}
