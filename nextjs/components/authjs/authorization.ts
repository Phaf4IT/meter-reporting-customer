import {Session} from "next-auth";
import {NextRequest} from "next/server";

export async function getAuthorization(auth: Session, request: NextRequest) {
    // Logged in users are authenticated, otherwise redirect to login page
    const isAuthenticated = !!auth && new Date(auth.expires) > new Date();
    if (isAuthenticated) {
        if (adminPaths.find(value => request.nextUrl.pathname.match(value))) {
            return auth.user.role?.includes("admin")
        } else if (regular.find(value => request.nextUrl.pathname.match(value))) {
            return isAuthenticated;
        }
    }
    return isAuthenticated
}

const adminPaths: string[] = ["/admin", "/api/admin"]
const regular: string[] = ["/api/auth", "/report"]