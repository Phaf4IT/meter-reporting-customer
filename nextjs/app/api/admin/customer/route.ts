import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {getCustomers} from "@/components/admin/customer/action/getCustomersAction";
import {createCustomer} from "@/components/admin/customer/action/createCustomerAction";
import {customerFromJson} from "@/components/admin/customer/customer";
import {updateCustomer} from "@/components/admin/customer/action/updateCustomerAction";
import {deleteCustomer} from "@/components/admin/customer/action/deleteCustomerAction";

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
        const customer = await createCustomer(customerFromJson(data), session.user.company);

        return NextResponse.json(customer);
    } catch (err) {
        console.error("Error creating campaign:", err);
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
        const customer = await updateCustomer(customerFromJson(data), session.user.company);

        return NextResponse.json(customer);
    } catch (err) {
        console.error("Error creating campaign:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function GET(): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        return getCustomers()
            .then(value => NextResponse.json(value));
    } catch (err) {
        console.error("Error creating campaign:", err);
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
        await deleteCustomer(customerFromJson(data), session.user.company);

        return NextResponse.json({});
    } catch (err) {
        console.error("Error creating campaign:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}