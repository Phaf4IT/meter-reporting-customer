import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {CustomerTable} from "@/components/admin/customer/_database/customerTable";
import {findEntitiesByCompanyAndIds} from "@/components/admin/entity/_database/entityRepository";
import {ModifiableCustomer} from "@/components/admin/customer/modifiable-customer";
import {Customer} from "@/components/admin/customer/customer";
import {Entity} from "@/components/admin/entity/entity";

export async function findCustomers(company: string): Promise<Customer[]> {
    return getEntityManager(CustomerTable)
        .findBy({
            company: company
        })
        .then(async (customers) => mapCustomers(customers, company));
}

export async function findCustomerByEmail(email: string, company: string) {
    return getEntityManager(CustomerTable)
        .findBy({
            company: company,
            email: email
        })
        .then((customers) =>
            mapCustomers(customers, company)
                .then(customers => customers.find(() => true)!)
        );
}

export async function findCustomersByIds(ids: string[], company: string) {
    return getEntityManager(CustomerTable)
        .findBy({
            company: company,
            id: ids
        })
        .then(async (customers) => {
                return await mapCustomers(customers, company);
            }
        );
}

export async function saveCustomer(customer: ModifiableCustomer, company: string) {
    return getEntityManager(CustomerTable)
        .create(mapDomainToTable(customer, company))
        .then(customerTable =>
            mapTableToDomainModifiable(customerTable)
        )
}

export async function updateCustomer(customer: ModifiableCustomer, company: string) {
    return getEntityManager(CustomerTable)
        .update(mapDomainToTable(customer, company))
        .then(() => customer)
}

export async function deleteCustomer(customer: ModifiableCustomer, company: string) {
    return getEntityManager(CustomerTable)
        .delete(mapDomainToTable(customer, company));
}

async function mapCustomers(customers: CustomerTable[], company: string) {
    const entities = await findEntitiesByCompanyAndIds(customers.map(c => c.entityId), company);
    return customers.map((customerTable: CustomerTable) => {
        const entity = entities.find(entity => customerTable.entityId === entity.id)!;
        return mapTableToDomain(customerTable, entity);
    });
}

function mapDomainToTable(customer: ModifiableCustomer, company: string) {
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

function mapTableToDomainModifiable(customerTable: CustomerTable): ModifiableCustomer {
    return {
        id: customerTable.id,
        email: customerTable.email,
        title: customerTable.title || undefined,
        entityId: customerTable.entityId,
        firstName: customerTable.firstName,
        middleName: customerTable.middleName || undefined,
        lastName: customerTable.lastName,
        phoneNumber: customerTable.phoneNumber
    };
}

function mapTableToDomain(customerTable: CustomerTable, entity: Entity): Customer {
    return {
        id: customerTable.id,
        email: customerTable.email,
        title: customerTable.title || undefined,
        entity,
        firstName: customerTable.firstName,
        middleName: customerTable.middleName || undefined,
        lastName: customerTable.lastName,
        phoneNumber: customerTable.phoneNumber
    };
}