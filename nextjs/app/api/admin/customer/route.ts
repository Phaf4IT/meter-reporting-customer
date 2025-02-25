import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {getCustomers} from "@/components/admin/customer/action/getCustomersAction";
import {createCustomer} from "@/components/admin/customer/action/createCustomerAction";
import {updateCustomer} from "@/components/admin/customer/action/updateCustomerAction";
import {deleteCustomer} from "@/components/admin/customer/action/deleteCustomerAction";
import {modifiableCustomerFromJson} from "@/components/admin/customer/modifiable-customer";
import {findCustomersByEntityIdsAction} from "@/components/admin/customer/action/findCustomersByEntityIdsAction";

export async function POST(
    request: NextRequest
): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        const data = await request.json();
        const customer = await createCustomer(modifiableCustomerFromJson(data), session.user.company);

        return NextResponse.json(customer);
    } catch (err) {
        console.error("Error creating customer:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function PUT(
    request: NextRequest
): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        const data = await request.json();
        const customer = await updateCustomer(modifiableCustomerFromJson(data), session.user.company);

        return NextResponse.json(customer);
    } catch (err) {
        console.error("Error creating customer:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function GET(request: NextRequest): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        const entityIds = request.nextUrl.searchParams.getAll("entityIds");
        if (entityIds && entityIds.length > 0) {
            return findCustomersByEntityIdsAction(entityIds)
                .then(value => NextResponse.json(value));
        } else {
            return getCustomers()
                .then(value => NextResponse.json(value));
        }
    } catch (err) {
        console.error("Error creating customer:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function DELETE(
    request: NextRequest
): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        const data = await request.json();
        await deleteCustomer(modifiableCustomerFromJson(data), session.user.company);

        return NextResponse.json({});
    } catch (err) {
        console.error("Error creating customer:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}