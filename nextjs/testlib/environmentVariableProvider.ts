let environmentVariableProvider: EnvironmentVariables;

export interface EnvironmentVariables {
    sessionCookie: string,
    companyName: string,
    wiremockUrl: string,
    serverBaseUrl: string,
    neonUrl: string,
    databaseUrl: string,
    adminEmail: string,
    playwrightWebsocketUrl: string,
    defaultLocale: string
}

export function getEnvironmentVariableProvider(): EnvironmentVariables {
    if (!environmentVariableProvider) {
        environmentVariableProvider = new EnvironmentVariableProvider();
    }
    return environmentVariableProvider;
}


export class EnvironmentVariableProvider implements EnvironmentVariables {
    readonly adminEmail: string;
    readonly companyName: string;
    readonly neonUrl: string;
    readonly databaseUrl: string;
    readonly serverBaseUrl: string;
    readonly sessionCookie: string;
    readonly wiremockUrl: string;
    readonly playwrightWebsocketUrl: string;
    readonly defaultLocale: string;


    constructor() {
        this.adminEmail = process.env.ADMIN_EMAIL!;
        this.companyName = process.env.COMPANY_NAME!;
        this.neonUrl = process.env.NEON_URL!;
        this.databaseUrl = process.env.DATABASE_URL!;
        this.wiremockUrl = process.env.WIREMOCK_URL!;
        this.serverBaseUrl = process.env.SERVER_URL!;
        this.sessionCookie = process.env.ADMIN_SESSION_COOKIE!;
        this.playwrightWebsocketUrl = process.env.PLAYWRIGHT_WEBSOCKET_URL!;
        this.defaultLocale = process.env.DEFAULT_LOCALE!;
    }
}