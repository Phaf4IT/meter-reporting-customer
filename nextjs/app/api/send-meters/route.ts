import {auth} from "@/auth"
import {NextRequest, NextResponse} from "next/server";

// // Define POST handler with authentication check
export async function POST(
    request: NextRequest
): Promise<Response> {
    const context: AppRouteHandlerFnContext = {};
    return auth(async (req) => {
        if (req.auth) {
            console.log(`Success with values: ${request.json}`)
            return NextResponse.json({message: `Success with values: ${request.json}`})
        } else {
            return NextResponse.json({message: "Failure"}, {status: 400})
        }
    })(request, context) as Promise<Response>;
}

export type AppRouteHandlerFnContext = {
    params?: Record<string, string | string[]>
}