import {Logger} from "@/lib/logger";

export async function sendVerificationRequest(config: Config) {
    Logger.info("Sending verification request...");
    const EMAIL_TO = process.env.MJ_EMAIL_TO;
    const EMAIL_FROM = process.env.MJ_EMAIL_FROM || 'test@example.com';

    if (EMAIL_TO === undefined || EMAIL_TO === config.identifier) {
        if (process.env.IS_MAIL_ENABLED === 'true') {
            Logger.info("Sending with mailjet...");
            const mailjet = {
                apiKey: process.env.MJ_APIKEY_PUBLIC || 'your-api-key',
                apiSecret: process.env.MJ_APIKEY_PRIVATE || 'your-api-secret',
                url: process.env.MJ_URL || 'https://api.mailjet.com/v3.1/send',
            };

            const body: MailjetMessageRequest = {
                messages: [{
                    From: {
                        Email: EMAIL_FROM
                    },
                    To: [
                        {
                            Email: config.identifier
                        }
                    ],
                    Subject: "Sign in to Your page",
                    TextPart: `Please click here to authenticate - ${config.url}`
                }]
            }
            Logger.info(`Sending body ${JSON.stringify(body)}...`);

            const response = await fetch(mailjet.url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${mailjet.apiKey}:${mailjet.apiSecret}`)}`,
                },
                body: JSON.stringify(body),
                method: "POST",
            }).catch(reason => {
                Logger.error(reason)
                return reason;
            });

            if (!response.ok) {
                const {errors} = await response.json()
                throw new Error(JSON.stringify(errors))
            }
        } else {
            Logger.info('Faking mail sent...')
            Logger.info(`Please click here to authenticate - ${config.url}`)
        }
    } else {
        Logger.error(`Not sending for mail address ${config.identifier}`)
    }
}

interface Config {
    identifier: string;
    url: string
}

interface MailjetMessageRequest {
    messages: MailjetMessage[]
}

interface MailjetMessage {
    From: {
        Email: string,
        Name?: string | undefined
    },
    To: {
        Email: string,
        Name?: string | undefined
    }[],
    Subject: string,
    TextPart?: string | undefined,
    HTMLPart?: string | undefined
}