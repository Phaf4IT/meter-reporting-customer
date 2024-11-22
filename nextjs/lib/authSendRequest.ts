export async function sendVerificationRequest(config: Config) {
    console.log("Sending verification request...");
    console.log(config);
    console.log(config.identifier);
    console.log(config.url);
    // Call the cloud Email provider API for sending emails
    const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
        // The body format will vary depending on provider, please see their documentation
        body: JSON.stringify({
            personalizations: [{to: [{email: config.identifier}]}],
            from: {email: "noreply@company.com"},
            subject: "Sign in to Your page",
            content: [
                {
                    type: "text/plain",
                    value: `Please click here to authenticate - ${config.url}`,
                },
            ],
        }),
        method: "POST",
    })

    if (!response.ok) {
        console.log(response)
        const {errors} = await response.json()
        throw new Error(JSON.stringify(errors))
    }
}

interface Config {
    identifier: string;
    url: string
}