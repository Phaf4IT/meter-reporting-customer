import {NextRequest, NextResponse} from 'next/server';
import {auth} from '@/auth';
import {parse} from 'csv-parse/sync';
import {modifiableCustomerFromJson} from "@/components/admin/customer/modifiable-customer";
import {createEntity} from "@/components/admin/entity/action/createEntityAction";
import {createCustomer} from "@/components/admin/customer/action/createCustomerAction";

export async function POST(request: NextRequest): Promise<Response> {
    const session = await auth();
    if (!session) {
        return new Response('Unauthorized', {status: 401});
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
        return new Response('No file uploaded', {status: 400});
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let records;
    try {
        records = parse(buffer.toString(), {
            columns: true,
            skip_empty_lines: true
        });
    } catch (err) {
        console.error('CSV parse error:', err);
        return new Response('Invalid CSV format', {status: 400});
    }

    function getTitle(row: any) {
        const title = row["Titel"];
        if (title === 'none' || title === 'mr' || title === 'mrs' || title === 'family') {
            return title;
        }
        return null;
    }

    try {
        const created = [];
        for (const row of records) {
            const entity = await createEntity({
                entityTypeName: 'Locatie',
                fieldValues: {
                    'Kavelnummer': row["Kavelnummer"],
                }
            }, session.user.company);

            const customer = {
                id: undefined,
                entityId: entity.id,
                email: row["Email"] || null,
                title: getTitle(row),
                firstName: row["Voornaam"] || null,
                middleName: row["Middelnaam"] || null,
                lastName: row["Achternaam"] || null,
                phoneNumber: row["Telefoonnumer"] || null,
                additionalFields: {
                    streetLines: row["Adresregels"] ? row["Adresregels"].split('|') : [],
                    postalCode: row["Postcode"] || null,
                    city: row["Stad"] || null,
                    country: row["Land"] || null,
                    stateOrProvinceCode: row["Provincie"] || null
                }
            };

            console.log(customer);

            const createdCustomer = await createCustomer(
                modifiableCustomerFromJson(customer),
                session.user.company
            );

            created.push(createdCustomer);
        }

        return NextResponse.json({success: true, count: created.length});
    } catch (err) {
        console.error('Error creating customers:', err);
        return new Response('Internal Server Error', {status: 500});
    }
}
