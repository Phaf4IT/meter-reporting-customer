import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {CustomerTable} from "@/components/admin/customer/_database/customerTable";
import {Customer} from "@/components/admin/customer/customer";
import {
    findEntitiesByCompanyAndIds,
    findEntityByCompanyAndId
} from "@/components/admin/entity/_database/entityRepository";
import {EntityTable} from "@/components/admin/entity/_database/entityTable";
import {getLocation} from "@/components/admin/entity/temporaryLocation";

export async function findCustomers(company: string) {
    return getEntityManager(CustomerTable)
        .findBy({
            company: company
        })
        .then(async (customers) => {
                const entities = await findEntitiesByCompanyAndIds(customers.map(c => c.entityId), company);
                return customers.map((customerTable: CustomerTable) =>
                    mapTableToDomain(customerTable, entities.find(entity => customerTable.entityId === entity.id)!));
            }
        );
}

export async function findCustomerByEmail(email: string, company: string) {
    return getEntityManager(CustomerTable)
        .findBy({
            company: company,
            email: email
        })
        .then((customers) =>
            customers
                .map((customerTable: CustomerTable) =>
                    findEntityByCompanyAndId(customerTable.entityId, company)
                        .then(entity => mapTableToDomain(customerTable, entity!)))
                .find(() => true)!
        );
}

export async function findCustomersByIds(ids: string[], company: string) {
    return getEntityManager(CustomerTable)
        .findBy({
            company: company,
            id: ids
        })
        .then(async (customers) => {
                const entities = await findEntitiesByCompanyAndIds(customers.map(c => c.entityId), company);
                return customers.map((customerTable: CustomerTable) => mapTableToDomain(customerTable,
                    entities.find(entity => customerTable.entityId === entity.id)!));
            }
        );
}

export async function saveCustomer(customer: Customer, company: string) {
    return getEntityManager(CustomerTable)
        .create(mapDomainToTable(customer, company))
        .then(customerTable =>
            findEntityByCompanyAndId(customerTable.entityId, company)
                .then(entity => {
                        return mapTableToDomain(customerTable, entity!);
                    }
                )
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
    return CustomerTable.of({
        id: customer.id,
        email: customer.email,
        title: customer.title || null,
        firstName: customer.firstName,
        middleName: customer.middleName || null,
        lastName: customer.lastName,
        entityId: customer.entityId!,
        phoneNumber: customer.phoneNumber,
        company
    });
}

function mapTableToDomain(customerTable: CustomerTable, entityTable: EntityTable): Customer {
    const location = getLocation(entityTable);
    return {
        id: customerTable.id,
        email: customerTable.email,
        title: customerTable.title || undefined,
        entityId: customerTable.entityId,
        firstName: customerTable.firstName,
        middleName: customerTable.middleName || undefined,
        lastName: customerTable.lastName,
        ...location,
        phoneNumber: customerTable.phoneNumber
    };
}