export async function sendVerificationRequest(email: string, url: string) {
    console.log("Sending verification request...");
    console.log(email);
    console.log(url);
    // Call the cloud Email provider API for sending emails
    const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
        // The body format will vary depending on provider, please see their documentation
        body: JSON.stringify({
            personalizations: [{to: [{email: email}]}],
            from: {email: "noreply@company.com"},
            subject: "Sign in to Your page",
            content: [
                {
                    type: "text/plain",
                    value: `Please click here to authenticate - ${url}`,
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