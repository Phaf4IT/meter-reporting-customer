import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {findCustomersByEntityIdsAction} from "@/components/admin/customer/action/findCustomersByEntityIdsAction";
import {getNonActiveCustomersAction} from "@/components/admin/customer/action/getNonActiveCustomersAction";

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
            return getNonActiveCustomersAction()
                .then(value => NextResponse.json(value));
        }
    } catch (err) {
        console.error("Error creating customer:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}
