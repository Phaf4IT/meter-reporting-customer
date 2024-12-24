import {Entity} from "@/lib/jpa/entity";
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";

@EntityClass("non_active_customer")
export class NonActiveCustomerTable extends Entity {
    @PrimaryKey
    @Field()
    email: string;
    @Field()
    title: string | undefined;
    @Field("first_name")
    firstName: string;
    @Field("middle_name")
    middleName: string | undefined;
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
    stateOrProvinceCode: string;
    @Field("phone_number")
    phoneNumber: string;
    @PrimaryKey
    @Field("company")
    company: string;
    @Field("archive_date")
    archiveDate: Date | undefined;

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
        company: string,
        archiveDate: Date | undefined,
    ) {
        super();
        this.email = email;
        this.title = title;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.streetLines = streetLines;
        this.postalCode = postalCode;
        this.city = city;
        this.country = country;
        this.stateOrProvinceCode = stateOrProvince;
        this.phoneNumber = phoneNumber;
        this.company = company;
        this.archiveDate = archiveDate;
    }
}
