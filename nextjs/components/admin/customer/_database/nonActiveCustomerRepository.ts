import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {Customer} from "@/components/admin/customer/customer";
import {NonActiveCustomerTable} from "@/components/admin/customer/_database/nonActiveCustomerTable";

export async function saveCustomer(customer: Customer, company: string): Promise<Customer> {
    return getEntityManager(NonActiveCustomerTable)
        .create(new NonActiveCustomerTable(
            customer.id,
            customer.email,
            customer.title,
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
            new Date()))
        .then((customerTable: NonActiveCustomerTable) => mapTableToDomain(customerTable)
        )
}

function mapTableToDomain(customerTable: NonActiveCustomerTable): Customer {
    return {
        id: customerTable.id,
        email: customerTable.email,
        title: customerTable.title || undefined,
        firstName: customerTable.firstName,
        middleName: customerTable.middleName || undefined,
        lastName: customerTable.lastName,
        streetLines: customerTable.streetLines,
        postalCode: customerTable.postalCode,
        city: customerTable.city,
        country: customerTable.country,
        stateOrProvinceCode: customerTable.stateOrProvince,
        phoneNumber: customerTable.phoneNumber
    };
}