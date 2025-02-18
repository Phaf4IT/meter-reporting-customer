import {Entity} from "@/lib/jpa/entity";
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import NonActiveCustomer from "@/components/database/schemas/public/NonActiveCustomer";

@EntityClass("non_active_customer")
export class NonActiveCustomerTable extends Entity implements NonActiveCustomer {
    @PrimaryKey
    @Field()
    id: string;
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
    @Field("entity_id")
    entityId: string;
    @Field("phone_number")
    phoneNumber: string | null;
    @PrimaryKey
    @Field("company")
    company: string;
    @Field("additional_fields")
    additionalFields: any | null;
    @Field("archive_date")
    archiveDate: Date;

    constructor(
        id: string,
        email: string,
        title: string | undefined,
        firstName: string,
        middleName: string | undefined,
        lastName: string,
        entityId: string,
        phoneNumber: string | undefined,
        company: string,
        additionalFields: any,
        archiveDate: Date
    ) {
        super();
        this.id = id;
        this.email = email;
        this.title = title || null;
        this.firstName = firstName;
        this.middleName = middleName || null;
        this.lastName = lastName;
        this.entityId = entityId;
        this.phoneNumber = phoneNumber || null;
        this.company = company;
        this.additionalFields = additionalFields;
        this.archiveDate = archiveDate;
    }

    static of({
                  id,
                  email,
                  title,
                  firstName,
                  middleName,
                  lastName,
                  entityId,
                  phoneNumber,
                  company,
                  archiveDate,
                  additionalFields
              }: NonActiveCustomer): NonActiveCustomerTable {
        return new NonActiveCustomerTable(
            id,
            email,
            title || undefined,
            firstName,
            middleName || undefined,
            lastName,
            entityId,
            phoneNumber || undefined,
            company,
            additionalFields,
            archiveDate
        )
    }
}
