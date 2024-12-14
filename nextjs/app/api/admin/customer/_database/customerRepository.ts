import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {CustomerTable} from "@/app/api/admin/customer/_database/customerTable";
import {Customer} from "@/app/admin/customer/customer";

export async function findCustomers(company: string) {
    return getEntityManager(CustomerTable)
        .findBy({
            company: company
        })
        .then((customers) =>
            customers.map((customerTable: CustomerTable) => {

                return new Customer(
                    customerTable.email,
                    customerTable.firstName,
                    customerTable.middleName || undefined,
                    customerTable.lastName,
                    customerTable.streetLines,
                    customerTable.postalCode,
                    customerTable.city,
                    customerTable.country,
                    customerTable.stateOrProvince,
                    customerTable.phoneNumber
                );
            })
        );

}

export async function saveCustomer(customer: Customer, company: string) {
    return getEntityManager(CustomerTable)
        .create(new CustomerTable(
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
            company))
        .then(customerTable => new Customer(
                customerTable.email,
                customerTable.firstName,
                customerTable.middleName || undefined,
                customerTable.lastName,
                customerTable.streetLines,
                customerTable.postalCode,
                customerTable.city,
                customerTable.country,
                customerTable.stateOrProvince,
                customerTable.phoneNumber
            )
        )
}


export async function updateCampaign(customer: Customer, company: string) {
    return getEntityManager(CustomerTable)
        .update(new CustomerTable(
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
            company))
        .then(() => customer)
}

export async function deleteCustomer(customer: Customer, company: string) {
    return getEntityManager(CustomerTable)
        .delete(new CustomerTable(
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
            company)
        );
}