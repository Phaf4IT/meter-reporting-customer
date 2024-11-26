import {auth} from "@/auth"

// // Define POST handler with authentication check
// export const POST = auth(async function POST(req) {
//     if (req.auth) {
//         // If authenticated, return user auth data as JSON
//         return NextResponse.json(req.auth)
//     }
//
//     // If not authenticated, return an error response with status 401
//     return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
// })
export async function POST(req, res) {
    await auth(req, res)
    if (req.auth) {
        return Response.json({
            message: "Meters sent successfully"
        },
        {
            status: 200
        }
        )
    }
    return Response.json({
        error: "Invalid Credentials"
    },
    {
        status: 401
    })
}