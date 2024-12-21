import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {getCustomers} from "@/app/api/admin/customer/getCustomersAction";
import {createCustomer} from "@/app/api/admin/customer/createCustomerAction";
import {Customer} from "@/app/admin/customer/customer";
import {updateCustomer} from "@/app/api/admin/customer/updateCustomerAction";
import {deleteCustomer} from "@/app/api/admin/customer/deleteCustomerAction";

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
        const campaign = await createCustomer(Customer.fromJSON(data), session.user.company); 

        return NextResponse.json(campaign);
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
        const customer = await updateCustomer(Customer.fromJSON(data), session.user.company);

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
        await deleteCustomer(Customer.fromJSON(data), session.user.company); 

        return NextResponse.json({});
    } catch (err) {
        console.error("Error creating campaign:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}