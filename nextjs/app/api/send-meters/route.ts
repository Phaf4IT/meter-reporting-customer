import {auth} from "@/auth"
import {NextRequest, NextResponse} from "next/server";

// // Define POST handler with authentication check
export async function POST(
    request: NextRequest
): Promise<Response> {
    const context: AppRouteHandlerFnContext = {};
    return auth(async (req) => {
        if (req.auth) {
            const body = await request.text()
            console.log(`Success with values: ${body}`)
            return NextResponse.json({message: `Success with values: ${body}`})
        } else {
            return NextResponse.json({message: "Failure"}, {status: 400})
        }
    })(request, context) as Promise<Response>;
}

export type AppRouteHandlerFnContext = {
    params?: Record<string, string | string[]>
}