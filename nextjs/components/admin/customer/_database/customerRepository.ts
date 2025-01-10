import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {CustomerTable} from "@/components/admin/customer/_database/customerTable";
import {Customer} from "@/components/admin/customer/customer";

export async function findCustomers(company: string) {
    return getEntityManager(CustomerTable)
        .findBy({
            company: company
        })
        .then((customers) =>
            customers.map((customerTable: CustomerTable) => mapTableToDomain(customerTable))
        );

}

export async function saveCustomer(customer: Customer, company: string) {
    return getEntityManager(CustomerTable)
        .create(mapDomainToTable(customer, company))
        .then(customerTable => mapTableToDomain(customerTable)
        )
}


export async function updateCustomer(customer: Customer, company: string) {
    return getEntityManager(CustomerTable)
        .update(mapDomainToTable(customer, company))
        .then(() => customer)
}


export async function deleteCustomer(customer: Customer, company: string) {
    return getEntityManager(CustomerTable)
        .delete(mapDomainToTable(customer, company));
}

function mapDomainToTable(customer: Customer, company: string) {
    return new CustomerTable(
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
        company);
}

function mapTableToDomain(customerTable: CustomerTable): Customer {
    return {
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