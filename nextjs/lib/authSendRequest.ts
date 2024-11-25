export async function sendVerificationRequest(config: Config) {
    console.log("Sending verification request...");
    const EMAIL_TO = process.env.MJ_EMAIL_TO;

    if (EMAIL_TO === config.identifier) {
        const mailjet = {
            apiKey: process.env.MJ_APIKEY_PUBLIC || 'your-api-key',
            apiSecret: process.env.MJ_APIKEY_PRIVATE || 'your-api-secret'
        };

        const body: MailjetMessageRequest = {
            messages: [{
                From: {
                    Email: "noreply@company.com"
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
        // Call the cloud Email provider API for sending emails
        const response = await fetch("https://api.mailjet.com/v3.1/send", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`${mailjet.apiKey}:${mailjet.apiSecret}`)}`,
            },
            body: JSON.stringify(body),
            method: "POST",
        })

        if (!response.ok) {
            console.log(response)
            const {errors} = await response.json()
            throw new Error(JSON.stringify(errors))
        }
    } else {
        console.error(`Not sending for mail address ${config.identifier}`)
    }
}

interface Config {
    // emailaddress to
    identifier: string;
    // activation url
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