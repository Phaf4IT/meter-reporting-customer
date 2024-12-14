import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {Customer} from "@/app/admin/customer/customer";
import {NonActiveCustomerTable} from "@/app/api/admin/customer/_database/nonActiveCustomerTable";

export async function saveCustomer(customer: Customer, company: string) {
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
        .then((customerTable: NonActiveCustomerTable) => new Customer(
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
