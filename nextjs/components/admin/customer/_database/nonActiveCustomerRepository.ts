import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {Customer} from "@/components/admin/customer/customer";
import {NonActiveCustomerTable} from "@/components/admin/customer/_database/nonActiveCustomerTable";
import {findEntityByCompanyAndId} from "@/components/admin/entity/_database/entityRepository";
import {EntityTable} from "@/components/admin/entity/_database/entityTable";
import {getLocation} from "@/components/admin/entity/temporaryLocation";

export async function saveCustomer(customer: Customer, company: string): Promise<Customer> {
    return getEntityManager(NonActiveCustomerTable)
        .create(NonActiveCustomerTable.of({
            id: customer.id,
            email: customer.email,
            title: customer.title || null,
            firstName: customer.firstName,
            middleName: customer.middleName || null,
            lastName: customer.lastName,
            entityId: customer.entityId!,
            phoneNumber: customer.phoneNumber,
            company,
            archiveDate: new Date()
        }))
        .then((customerTable: NonActiveCustomerTable) =>
            findEntityByCompanyAndId(customerTable.entityId, company)
                .then(entity => mapTableToDomain(customerTable, entity!))
        )
}

function mapTableToDomain(customerTable: NonActiveCustomerTable, entityTable: EntityTable): Customer {
    const location = getLocation(entityTable);
    return {
        id: customerTable.id,
        email: customerTable.email,
        title: customerTable.title || undefined,
        firstName: customerTable.firstName,
        middleName: customerTable.middleName || undefined,
        lastName: customerTable.lastName,
        entityId: customerTable.entityId,
        ...location,
        phoneNumber: customerTable.phoneNumber
    };
}