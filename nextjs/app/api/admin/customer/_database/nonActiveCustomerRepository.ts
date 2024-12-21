import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {Customer} from "@/app/admin/customer/customer";
import {NonActiveCustomerTable} from "@/app/api/admin/customer/_database/nonActiveCustomerTable";

export async function saveCustomer(customer: Customer, company: string): Promise<Customer> {
    return getEntityManager(NonActiveCustomerTable)
        .create(new NonActiveCustomerTable(
            customer.email,
            // TODO
            undefined,
            customer.firstName,
            customer.middleName,
            customer.lastName,
            customer.streetLines,
            customer.postalCode,
            customer.city,
            customer.country,
            customer.stateOrProvinceCode,
            customer.phoneNumber,
            company,
            undefined))
        .then((customerTable: NonActiveCustomerTable) => mapTableToDomain(customerTable)
        )
}

function mapTableToDomain(customerTable: NonActiveCustomerTable): Customer {
    return {
        email: customerTable.email,
        title: customerTable.title,
        firstName: customerTable.firstName,
        middleName: customerTable.middleName,
        lastName: customerTable.lastName,
        streetLines: customerTable.streetLines,
        postalCode: customerTable.postalCode,
        city: customerTable.city,
        country: customerTable.country,
        stateOrProvinceCode: customerTable.stateOrProvinceCode,
        phoneNumber: customerTable.phoneNumber
    };
}